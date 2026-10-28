# STEM Intelligence — MASTIC POC

Rebuild of the MASTIC E&E workforce POC dashboards as a real admin application.

- **Plan:** see [PLAN.md](./PLAN.md)
- **Frontend:** `apps/web` — shadcn-admin (React 19 · Vite · TanStack Router/Query · Tailwind v4 · Recharts)
- **Source data:** extracted from the original POC files (in `~/Downloads/MOSTI POC`) into JSON modules:
  - `apps/web/src/features/spm/data/spm-blob.json` — SPM 2018–2025: 95 subjects + national series with page-level provenance
  - `apps/web/src/features/data-catalog/data/documents.json` — 15-document catalog (8 SPM reports + Foresight + BEM/MBOT)
  - `apps/web/src/features/mismatch/data/mismatch-blob.json` — SKPG 2018–2024 graduate mismatch (228,680 records)
  - `apps/web/src/features/supply-demand/data/masco-blob.json` — MASCO supply/demand 2015–2040, PCA + SARIMAX model params
- **Engine (client-side for this phase):** `apps/web/src/lib/engine/` — faithful port of the original dashboard math (`calcScenarioIndex`, `scenarioForJob`, `requiredRate`, `balancedRate`, `interventionSeries`)
- **Extraction tooling:** `tools/extract/extract.mjs`, `extract-spm.mjs`, `extract-bem-mbot.mjs` (rerun to regenerate JSON + verify golden numbers)

## Run

```bash
cd apps/web
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # typecheck + production build
pnpm lint
```

Sign in with any credentials (mock auth this phase); demo hint shown on the sign-in page.

## Screens

| Route | Screen |
|---|---|
| `/` | Overview — National Talent Chain, 5-stage flow, 8-module grid |
| `/foresight` | **Foresight Kemahiran** — 10 STEM fields × 5 talent themes, E&E deficit linkage, DDA signals |
| `/analytics/spm` | **Prestasi SPM** — 95 subjects × 2018–2025, GPMP trends, heatmap, outcomes, participation, urban–rural |
| `/analytics/i360` | **Capaian Program STEM** — link-out shell (external, not ingested) |
| `/analytics/impak` | **Minat & Aspirasi STEM** — Kajian Impak KPIs + link-out shell |
| `/analytics/professional` | **Bakat Profesional** — BEM/MBOT stacked trends, field filter, KPIs (illustrative) |
| `/analytics/eande/supply-demand` | E&E Talent Intelligence · Supply & Demand (CI bands, scenario-ready) |
| `/analytics/eande/mismatch` | E&E Talent Intelligence · Graduate Mismatch (full cuts) |
| `/analytics/eande/strength` | E&E Talent Intelligence · **Supply Strength** (funnel + NEC risk table) |
| `/analytics/supply-demand`, `/analytics/mismatch` | Standalone deep links to the same dashboards |
| `/simulator/scenario` | Scenario Simulator — 6 macro sliders, presets, impact table |
| `/simulator/interventions` | Gap Closure — required rates, trajectories, status table |
| `/ask-mastic` | **Ask MASTIC** — deterministic cited Q&A with disclaimer gate |
| `/data-sources` | **Sumber Data** — catalog, 15 documents, indicator dictionary, governance |
| `/data`, `/model` | Data Explorer + Methodology & Diagnostics |
| `/users`, `/settings` | Template admin screens |

Golden reference values (verified by `tools/extract/extract.mjs`): mismatch any = **50.6%**, aggregate 2040 = **202,588 / 141,403 / −61,185**, **5 deficit / 5 surplus** occupations.
