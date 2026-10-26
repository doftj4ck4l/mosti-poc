# STEM Intelligence Platform — POC Build Plan

**Project:** MOSTI / MASTIC STEM Intelligence POC
**Repo:** `~/Developer/mostipoc`
**Status:** Frontend phase (shadcn-admin + extracted POC data, mock-free real data)

## 1. Product definition

Rebuild the two static MASTIC HTML dashboards into a real full-stack product — **STEM Intelligence POC** — with a live SQLite database, a Node forecasting/analytics engine behind a REST API, and shadcn-admin as the app shell.

**POC success criteria (from the TeD documents):**
- All data from the existing POC dashboards lives in SQLite, served by Express — no static HTML, no client-embedded JSON blobs
- Dashboard numbers must reproduce exactly: `50.6% mismatch`, `202,588 supply / 141,403 demand / −61,185 gap @2040`, `5 deficit / 5 surplus occupations`
- Scenario Simulator + Gap Closure engine run **server-side** (this is the WP2/WP4 "technology core" story from the grant proposal)
- Authenticated multi-user app (admin/analyst/viewer) with the shadcn-admin shell: sidebar, theme switch, command palette, settings
- Demo-ready in one command

**Language policy:** UI chrome in English; data labels stay in Malay exactly as in the source data (`Pembuatan`, `Jurutera Elektrik`, etc.) — consistent with the existing dashboards and MASTIC's audience.

## 2. Architecture & repo layout

pnpm monorepo, shadcn-admin cloned as-is into `apps/web` (its tooling untouched):

```
mostipoc/
├─ apps/
│  ├─ web/                  # shadcn-admin clone (Vite, TanStack Router/Query)
│  │  ├─ src/routes/        # file-based routes (extended, see §6)
│  │  ├─ src/features/      # one folder per domain screen
│  │  ├─ src/lib/api.ts     # axios client + auth interceptors
│  │  └─ src/queries/       # TanStack Query hooks per domain
│  ├─ server/               # Express 5 + TypeScript (tsx dev, tsc build)
│  │  ├─ src/
│  │  │  ├─ routes/         # auth, analytics, forecast, scenario, admin, meta
│  │  │  ├─ services/       # engine/ (forecast core), mismatch, users
│  │  │  ├─ db/             # drizzle schema, migrations, connection
│  │  │  ├─ middleware/     # auth (JWT), rbac, zod-validate, errors, rate-limit
│  │  │  └─ index.ts
│  │  └─ data/stem-intel.db # SQLite (WAL mode), gitignored
├─ packages/shared/         # zod schemas + TS types shared by web & server
├─ tools/
│  └─ extract/              # parsers for the 2 HTML data blobs → seed JSON
│     ├─ extract-mismatch.ts
│     ├─ extract-masco.ts
│     └─ golden.json        # frozen expected numbers for tests
└─ docs/                    # API contract, data dictionary, demo script
```

**Stack decisions (and why):**

| Concern | Choice | Rationale |
|---|---|---|
| DB | **better-sqlite3** + **Drizzle ORM** + drizzle-kit migrations | Sync/fast, zero-ops, typed schema, real migrations = "real thing" |
| Validation | **zod 4** in `packages/shared` | Same schema validates API input, infers types for the frontend |
| Auth | JWT access (15m) + refresh token in httpOnly cookie, **bcryptjs**, `jose` | Template already has token-auth store + cookie lib; Clerk variant is deleted |
| Charts | **Recharts 3** (template dependency) + shadcn `chart` wrapper | CI bands = Recharts `Area`; forecast boundary = reference line |
| Dev proxy | Vite `/api` → `localhost:3000` | No CORS pain in dev; in prod Express serves `web/dist` |
| Error/log | central error middleware, `pino` | Structured logs, one error envelope |
| Tests | **Vitest**: engine math (node env) + web (template's browser setup already wired) | Golden-value tests are the core guarantee |

## 3. Data pipeline (the critical piece)

The source of truth is the JSON embedded in the two HTML files. Nothing is re-invented; everything is extracted, normalized, and re-served.

**3.1 Extraction (`tools/extract`)**
- `extract-mismatch.ts`: parses `Papan_Pemuka_Ketidaksepadanan_Graduan_EE 24082026.html` → pulls the `data-blob` JSON → emits normalized seed JSON: 2 scopes × 3 groups × ~14 dimensions × categories × counts
- `extract-masco.ts`: parses `Dashboard_Supply_Demand_MASCO_28092026.html` → occupations (10), year series 2015–2040 (actual/forecast/lower/upper × supply/demand), 6 macro series, model params (coef_b, r2_exog, phi, PCA loadings/mean/std, macro correlations), scenario defs
- Both emit `seed/*.json` + `golden.json` (frozen: aggregate 2040 = 202,588 / 141,403 / −61,185; mismatch any = 50.6%; TVET 60.5% vs IPT 35.4%, etc.)

**3.2 SQLite schema (Drizzle, ~14 tables)**

```sql
-- domain
occupations        (kod PK, name, name_ms, group_level)             -- 10 rows
yearly_series      (kod, year, supply_actual, supply_fc, supply_lo, supply_hi,
                    demand_actual, demand_fc, demand_lo, demand_hi)  -- 10×26 rows
macro_indicators   (key, year, value)                                -- 6×26
model_params       (kod, b_supply, b_demand, r2_supply, r2_demand, phi)
pca_meta           (loading, mean, std per key; variance_explained)
macro_corr         (key, supply, demand)
scenario_presets   (id, name, changes_json)                          -- Baseline, Investment+5pp, ...

-- mismatch analytics (pre-aggregated exactly as the dashboard computes them)
mismatch_summary   (scope, grp, base, graduan, bekerja, v, h, d, a, over, under)
mismatch_cut       (scope, grp, dim, label, n, v, h, d, a)
                   -- dim ∈ {tahun, peringkat, institusi, sektor_ekonomi,
                   --        sektor_pekerjaan, kumpulan, income, gpa, nec,
                   --        jawatan, negeri, kursus, aliran}
mismatch_matrix    (scope, grp, cell, count)                        -- vertical×horizontal cross
mismatch_gap       (scope, dim, label, tvet_n, ipt_n, tvet_pct, ipt_pct, gap_pp)

-- app
users              (id, name, email UNIQUE, password_hash, role, status, created_at)
sessions           (id, user_id, refresh_hash, expires_at, created_at, revoked)
audit_log          (id, user_id, action, detail_json, created_at)   -- who ran which simulation
```

Percentages (`vp/hp/ap…`) are **never stored** — always derived `v/n*100` in the API, same formula as the dashboard, so a re-seed can never drift from counts. Seed script is idempotent (`npm run db:reset` = migrate + seed + verify golden).

## 4. Backend design (Express)

**4.1 Layers:** `routes → zod-validate → controller → service → drizzle`. No business logic in controllers.

**4.2 Forecast/analytics engine (`services/engine/`)** — pure functions, fully unit-testable, this is the WP2/WP4 demo core:

1. `pca.ts` — standardize macro deltas by stored mean/std → PC1 = Σ loading·z. (Loadings fixed from source; documented as WP1 stand-in.)
2. `sarimax.ts` — recompute baseline forecast from history + b + phi (AR(1) on differenced series, d=1) and assert it matches the stored forecast within tolerance — *proves we reproduce the reference model before extending it*
3. `scenario.ts` — apply macro deltas → recompute PC1 path → Δ = b·ΔIndex → scenario series + Δ supply/demand/gap at target year (same semantics as dashboard v3: pp factors for rates, % for wages, compounded from 2026)
4. `gapClosure.ts` — solver: binary-search compound annual rate r on demand ↓, supply ↑, or 50/50 split so that gap → 0 at target year (2030/2035/2040); returns required rates + resulting trajectories
5. `insights.ts` — auto-generated insight strings (crossover year, YoY trend, D/S ratio) mirroring the dashboard's dynamic insights

**4.3 API contract (v1, all under `/api/v1`)**

| Method & path | Purpose | Role |
|---|---|---|
| `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me` | JWT flow, httpOnly refresh cookie | public |
| `GET /overview` | Exec summary: KPI cards (mismatch %, 2040 gap, deficit/surplus counts, top risks) | viewer |
| `GET /mismatch/summary?scope&grp` | Headline KPIs | viewer |
| `GET /mismatch/by/{dim}?scope&grp` | Any cut: tahun, peringkat, institusi, sektor_ekonomi, sektor_pekerjaan, kumpulan, income, gpa, nec, jawatan, negeri, kursus(top15) | viewer |
| `GET /mismatch/matrix?scope&grp` | vertical×horizontal cross + TVET−IPT gap table | viewer |
| `GET /occupations` | 10 MASCO with 2040 gap + status | viewer |
| `GET /occupations/{kod}/series` | Merged actual+forecast+CI for charting | viewer |
| `GET /forecast/aggregate?from&to` | Aggregate supply/demand/gap + YoY table | viewer |
| `POST /scenario/simulate` | {changes per macro, targetYear, kod?} → baseline vs scenario series + deltas | analyst |
| `POST /intervention/solve` | {kod|all, targetYear, mode: demand/supply/mix} → required rates + trajectories | analyst |
| `GET /diagnostics` | PC1 variance, R² table, phi decay, CI widths, macro correlations, methodology steps | viewer |
| `GET /meta` | dimensions, macro keys, scenario defs, filter options | viewer |
| `GET/POST/PATCH/DELETE /users` | user management | admin |
| `GET /audit`, `POST /audit` | simulation log (who ran what) | admin/analyst |
| `GET /health` | liveness + db check | public |

Envelopes: `{data, meta}` / errors `{error:{code,message,details}}`. Zod parses every body/query; 400/401/403/404/409/500 handlers centralized; rate-limit on auth; helmet; pino request logs.

**4.4 Auth flow:** login → access JWT (15m, `role` claim) + refresh cookie (7d, rotated, hashed in `sessions`). Axios interceptor retries once on 401 via `/auth/refresh`. RBAC middleware: `viewer < analyst < admin`. Seed: `admin@stemintel.gov.my / Admin#123`, `analyst@…`, `viewer@…` (forced-change flag on first login for realism).

## 5. Frontend design (shadcn-admin conventions)

Follow the template exactly: `features/<domain>/{components,data,index.tsx}`, routes in `src/routes/_authenticated/`, filters as **URL search params** (validated with `validateSearch`) so every dashboard view is shareable/bookmarkable. TanStack Query for all fetching.

**Sidebar IA (replaces template's demo sections):**

```
Overview                        → /  (exec dashboard)
Analytics
  ├─ Graduate Mismatch          → /analytics/mismatch
  └─ Supply & Demand            → /analytics/supply-demand
Simulator
  ├─ Scenario Simulator         → /simulator/scenario
  └─ Gap Closure & Interventions→ /simulator/interventions
Model & Data
  ├─ Methodology & Diagnostics  → /model
  └─ Data Explorer              → /data
Admin (role-gated)
  └─ Users                      → /users
```
Kept from template: Sign-in, Errors (401/403/404/500), Settings (account/appearance/display/notifications), theme switch, command palette, nav-user, search. Removed: apps, chats, tasks.

## 6. Screen-by-screen specification

**S0 — Sign-in `/sign-in`**: real auth wiring; demo-credentials hint card (POC only). *AC: login/refresh/logout round-trip works.*

**S1 — Overview `/`**
- KPI row: mismatch 50.6% (v/h split chips) · 2040 aggregate gap −61,185 · 5 deficit / 5 surplus occupations · PC1 variance 49.1%
- Aggregate supply-vs-demand area chart (2015–2040, forecast shaded, 2026 boundary)
- 2040 gap ranking mini-bars (red deficit / green surplus) — links to Supply & Demand
- Top-3 mismatch cuts (institution, income, level) — links to Mismatch
- Recent simulations list (audit log)
- AC: every number server-computed; every card cross-links to its screen.

**S2 — Graduate Mismatch `/analytics/mismatch`** (faithful rebuild of dashboard 1)
- Sticky filter bar: Scope (Semua sektor / Pembuatan) · Group (Semua / TVET / IPT) · Measure (Menegak / Mendatar / Kedua-dua / Mana-mana) — URL-encoded
- KPIs: any %, v %, h %, dual %, over/under counts
- Charts: trend by year · by institution · by peringkat · by sector (top 15) · by employer type · by ISCO group · by income · by PNGK
- Cross tab: vertical×horizontal; Sepadan vs Tidak Sepadan 100% bars across facets
- Tables: Top-15 courses (n≥300 note) · TVET−IPT gap matrix (min-200 rule)
- Methodology footnote card
- AC: numbers match HTML dashboard to the decimal for identical filter sets (golden-tested); CSV export per table.

**S3 — Supply & Demand `/analytics/supply-demand`** (rebuild of dashboard 2)
- Occupation selector (10 MASCO + Agregat) + year range (Dari/Hingga)
- Main chart: solid = actual/forecast, shaded 80% CI bands, dashed vertical = 2026 forecast start
- Gap chart (demand − supply) colored by sign; crossover-year insight chip
- Yearly table: Supply, YoY%, Demand, YoY%, Gap, D/S ratio
- Executive summary cards
- AC: CI bands render; tooltip parity with original; PDF print button.

**S4 — Scenario Simulator `/simulator/scenario`** (the WP4 demo)
- Occupation picker or "Sektor agregat"; horizon toggle 2030/2035/2040
- Preset chips: Baseline · Pelaburan +5pp · Teknologi +5pp · Pertumbuhan Ekonomi +2pp · Combined Growth · Economic Slowdown + custom sliders (6 macro factors, per-factor min/max/step from scenario defs; pp vs % semantics preserved)
- "Apa kesan" panel: Δ Supply / Δ Demand / Δ Gap at target year vs baseline
- Chart: baseline vs scenario trajectories
- PCA index baseline-vs-scenario indicator
- Per-occupation impact table (all 10, selected row highlighted)
- Save scenario → audit log (analyst+)
- Live disclaimer banner (*simulasi what-if, bukan kausal*)
- AC: debounced slider → server recompute < 150ms p95; results match reference dashboard math.

**S5 — Gap Closure & Interventions `/simulator/interventions`**
- Target year toggle (2030/2035/2040) · occupation or aggregate
- Baseline status card (gap at target, status label)
- Three mathematical options: Demand-only ↓, Supply-only ↑, 50/50 — annual % and person counts
- Custom sliders: demand Δ%/yr, supply Δ%/yr with mode presets
- Result panel: Baseline → After-intervention at target year + trajectory chart
- 2040 gap-by-occupation table (sorted, red/green badges)
- AC: solver converges for all 10 occupations + aggregate (unit tests); results logged to audit.

**S6 — Methodology & Diagnostics `/model`**
- 4-step methodology pipeline (Data → PCA → SARIMAX → Forecast/Scenario)
- Model health cards: history vs horizon warning · PC1 49.1% · per-occupation R²-exog bars · CI-width-2040 chart · phi decay · macro correlation heatmap (2015–2025)
- Known-limitations callouts
- AC: read-only; frames the WP2 grant narrative.

**S7 — Data Explorer `/data`**
- TanStack Table over mismatch cuts: faceted filters (scope/group/dimension), global search, column visibility, pagination, CSV export
- Macro series tab: 6 indicators × 26 years
- Column-provenance header ("Source: SKPG 2018–2024")
- AC: smooth with 10k+ rows; export matches on-screen data.

**S8 — Users `/users`** (admin): template data-table pattern wired to real API, role select, status toggle. *AC: RBAC enforced server-side (403), not just hidden UI.*

**S9 — Settings** (template, trimmed): Account, Appearance, Notifications stub.

**S10 — Error pages:** 401/403/404/500 wired to API error codes; global error boundary with retry.

## 7. Build order — 7 milestones

| # | Milestone | Exit criteria |
|---|---|---|
| **M0** | Scaffold: clone shadcn-admin → apps/web, server + shared packages, Vite proxy, SQLite + Drizzle migrate, extractors + seed + golden.json, db:reset, health endpoint | `pnpm dev` boots both; `/api/v1/health` OK; golden verify passes |
| **M1** | Auth + shell: JWT flow into template auth store, RBAC, sidebar IA, delete demo features, command palette | 3 roles log in; non-analyst blocked from simulator APIs (403) |
| **M2** | Overview + Mismatch screen | Every cut matches HTML dashboard; URL filters shareable |
| **M3** | Supply & Demand screen | 10 occupations + aggregate with CI + boundary; YoY table correct |
| **M4** | Engine parity first, then Scenario + Gap Closure screens | Golden tests green; sliders < 150ms; audit rows written |
| **M5** | Diagnostics + Data Explorer | Charts/tables complete; CSV exports correct |
| **M6** | Users admin + settings polish, print/PDF, empty/loading/error states, dark-mode audit | Full role walkthrough passes |
| **M7** | Hardening: Vitest suites, README + API contract + data dictionary + demo script, seed reset, prod build served by Express | `pnpm test` green; single-command demo |

Roughly **7–9 working days** for one developer.

## 8. Risks & mitigations

1. **SARIMAX fidelity in JS** → replay stored coefficients; prove parity against the blob's precomputed forecasts with tolerance tests. Re-estimation is the funded R&D (WP2), not the POC.
2. **Scenario sensitivity nearly flat** (tiny R²) → keep the source's honest framing; direction still visible — a feature for the grant narrative.
3. **Malay data labels** → stored verbatim; no translations in v1 to avoid drift.
4. **Clerk removal** → template keeps a clean token-auth store; rewire it, delete the `clerk/` route subtree.
5. **Recharts CI bands + dashed forecast boundary** → Area with null gap + ReferenceLine; M3 spike first.
6. **SQLite concurrency** → WAL mode + single-writer API pattern.

## 9. Explicitly out of scope (v1)

Real NEC–MASCO record-level matching (WP1), ML hybrid models beyond SARIMAX replay (WP2), multi-sector expansion, file-upload/ETL UI, email flows, deployments beyond local run.

## 10. Current phase note

**Frontend-first build in progress:** the full screen set (S0–S10) is being built against the **extracted real data** from the two HTML dashboards (embedded as JSON data modules in `apps/web`), with the engine math (PCA scenario, gap-closure solver, insights) implemented in `src/lib/engine/` client-side for now. When the backend lands (M0–M1 server), these modules move to the server and screens switch to TanStack Query + API with no UI redesign.
