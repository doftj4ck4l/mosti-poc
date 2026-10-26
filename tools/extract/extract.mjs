import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SRC = '/Users/wasabisnorter/Downloads/MOSTI POC'

function extractBlob(file, marker) {
  const html = readFileSync(join(SRC, file), 'utf8')
  const re = new RegExp(`<script[^>]*>\\s*(\\{\\s*"${marker}"[\\s\\S]*?)</script>`)
  const m = html.match(re)
  if (!m) throw new Error(`data blob not found in ${file}`)
  return JSON.parse(m[1])
}

const mismatch = extractBlob(
  'Papan_Pemuka_Ketidaksepadanan_Graduan_EE 24082026.html',
  'generated_at',
)
const masco = extractBlob('Dashboard_Supply_Demand_MASCO_28092026.html', 'years')

const targets = [
  [join(ROOT, 'apps/web/src/features/mismatch/data/mismatch-blob.json'), mismatch],
  [join(ROOT, 'apps/web/src/features/supply-demand/data/masco-blob.json'), masco],
]
for (const [p, data] of targets) {
  mkdirSync(dirname(p), { recursive: true })
  writeFileSync(p, JSON.stringify(data))
  console.log('wrote', p)
}

const golden = {
  mismatch: {
    any_pct_overall_all: mismatch.overall.all.ap,
    any_pct_tvet: mismatch.overall.tvet.ap,
    any_pct_ipt: mismatch.overall.ipt.ap,
    vertical_pct_overall_all: mismatch.overall.all.vp,
    horizontal_pct_overall_all: mismatch.overall.all.hp,
    base_overall_all: mismatch.overall.all.base,
    graduan: mismatch.overall.all.graduan,
    bekerja: mismatch.overall.all.bekerja,
  },
  masco: {
    years: masco.years.length,
    occupations: Object.keys(masco.jobs).length,
    pca_variance: masco.scenario_meta.pca_variance,
  },
}

const i2040 = masco.years.indexOf(2040)
let supply = 0
let demand = 0
for (const j of Object.values(masco.jobs)) {
  supply += j.supply_forecast[i2040]
  demand += j.demand_forecast[i2040]
}
golden.masco.aggregate_2040 = {
  supply: Math.round(supply),
  demand: Math.round(demand),
  gap: Math.round(demand - supply),
}
const deficits = Object.values(masco.jobs).filter(
  (j) => j.demand_forecast[i2040] - j.supply_forecast[i2040] > 0,
).length
golden.masco.deficit_count_2040 = deficits
golden.masco.surplus_count_2040 = Object.keys(masco.jobs).length - deficits

writeFileSync(join(ROOT, 'tools/extract/golden.json'), JSON.stringify(golden, null, 2))
console.log(JSON.stringify(golden, null, 2))

const assert = (name, actual, expected, tol = 1) => {
  const ok =
    typeof expected === 'number'
      ? Math.abs(actual - expected) <= tol
      : actual === expected
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${actual} vs ${expected}`)
  if (!ok) process.exitCode = 1
}
assert('mismatch any% (all)', golden.mismatch.any_pct_overall_all, 50.6, 0.05)
assert('mismatch any% (TVET)', golden.mismatch.any_pct_tvet, 60.5, 0.05)
assert('mismatch any% (IPT)', golden.mismatch.any_pct_ipt, 35.4, 0.05)
assert('aggregate supply 2040', golden.masco.aggregate_2040.supply, 202588)
assert('aggregate demand 2040', golden.masco.aggregate_2040.demand, 141403)
assert('aggregate gap 2040', golden.masco.aggregate_2040.gap, -61185)
assert('deficit count 2040', golden.masco.deficit_count_2040, 5, 0)
