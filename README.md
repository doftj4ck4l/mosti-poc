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
- **Extraction tooling:** `tools/extract/extract.mjs`, `extract-spm.mjs` (rerun to regenerate JSON + verify golden numbers)

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
| `/` | Overview — National Talent Chain (6 stages), 5-stage flow, 8-module grid |
| `/analytics/spm` | **Prestasi SPM** — 95 subjects × 2018–2025, GPMP trends, heatmap, outcomes, participation, urban–rural |
| `/data-sources` | **Sumber Data** — catalog, 15 documents, indicator dictionary, agency governance |
| `/analytics/mismatch` | Graduate Mismatch — scope/group/measure filters via URL, 10+ cuts, top courses, TVET−IPT gap matrix |
| `/analytics/supply-demand` | Supply & Demand — 10 MASCO + aggregate, 80% CI bands, forecast boundary, YoY table |
| `/simulator/scenario` | Scenario Simulator — 6 macro sliders, presets, per-occupation impact table |
| `/simulator/interventions` | Gap Closure — required rates (demand/supply/50-50), custom trajectories, status table |
| `/model` | Methodology & Diagnostics — R², CI widths, φ decay, macro correlations, limitations |
| `/data` | Data Explorer — TanStack table over all cuts + macro series, CSV export |
| `/users`, `/settings` | Template admin screens |

Golden reference values (verified by `tools/extract/extract.mjs`): mismatch any = **50.6%**, aggregate 2040 = **202,588 / 141,403 / −61,185**, **5 deficit / 5 surplus** occupations.
