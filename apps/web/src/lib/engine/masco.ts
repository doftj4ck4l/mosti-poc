import blob from '@/features/supply-demand/data/masco-blob.json'
import type {
  MascoBlob,
  ScenarioDef,
} from '@/lib/engine/masco-types'

const data = blob as unknown as MascoBlob

export const years = data.years
export const yearsHist = data.years_hist
export const jobKeys = Object.keys(data.jobs)
export const jobs = data.jobs
export const scenarioMeta = data.scenario_meta
export const macroKeys = scenarioMeta.macro_keys
export const controlIndex = data.control_index
export const macroData = data.macro
export const macroCorr = data.macro_corr
export const macroVsAr = data.macro_vs_ar
export const arDecay = data.ar_decay

export const forecastStartYear = yearsHist[yearsHist.length - 1] + 1
export const forecastStartIdx = years.indexOf(forecastStartYear)
export const histEndYear = yearsHist[yearsHist.length - 1]

export const macroShortNames: Record<string, string> = {
  'Kadar Pertumbuhan Pelaburan Diluluskan MIDA (%)': 'Pertumbuhan Pelaburan MIDA',
  'Annual percentage change ( economic activity at constant 2015 prices)(%)':
    'Pertumbuhan Aktiviti Ekonomi',
  'Annual percentage change (value added per employment) (%)':
    'Pertumbuhan Nilai Ditambah/Pekerja',
  'Purata Gaji Bulanan (RM)': 'Purata Gaji Bulanan',
  'Kadar Inflasi (%)': 'Kadar Inflasi',
  'Kadar Pertumbuhan Teknologi (%)': 'Pertumbuhan Teknologi',
}

export const scenarioDefs: Record<string, ScenarioDef> = {
  'Kadar Pertumbuhan Pelaburan Diluluskan MIDA (%)': {
    min: -5,
    max: 10,
    step: 0.5,
    unit: 'pp',
    type: 'pp',
  },
  'Annual percentage change ( economic activity at constant 2015 prices)(%)': {
    min: -5,
    max: 5,
    step: 0.5,
    unit: 'pp',
    type: 'pp',
  },
  'Annual percentage change (value added per employment) (%)': {
    min: -5,
    max: 5,
    step: 0.5,
    unit: 'pp',
    type: 'pp',
  },
  'Purata Gaji Bulanan (RM)': {
    min: -20,
    max: 30,
    step: 1,
    unit: '%',
    type: 'pct',
  },
  'Kadar Inflasi (%)': {
    min: -3,
    max: 5,
    step: 0.5,
    unit: 'pp',
    type: 'pp',
  },
  'Kadar Pertumbuhan Teknologi (%)': {
    min: -5,
    max: 10,
    step: 0.5,
    unit: 'pp',
    type: 'pp',
  },
}

export type ScenarioChanges = Record<string, number>

export const zeroChanges = (): ScenarioChanges => {
  const c: ScenarioChanges = {}
  macroKeys.forEach((k) => (c[k] = 0))
  return c
}

export const SCENARIO_PRESETS: Record<
  string,
  { label: string; changes: (k: string, i: number) => number }
> = {
  baseline: { label: 'Baseline', changes: () => 0 },
  investment: { label: 'Pelaburan +5pp', changes: (_k, i) => (i === 0 ? 5 : 0) },
  technology: { label: 'Teknologi +5pp', changes: (_k, i) => (i === 5 ? 5 : 0) },
  growth: { label: 'Pertumbuhan Ekonomi +2pp', changes: (_k, i) => (i === 1 ? 2 : 0) },
  combined: {
    label: 'Combined Growth',
    changes: (_k, i) => (i === 0 ? 3 : i === 1 ? 1.5 : i === 2 ? 1 : i === 5 ? 3 : 0),
  },
  slowdown: {
    label: 'Economic Slowdown',
    changes: (_k, i) => (i === 1 ? -2 : i === 2 ? -2 : i === 5 ? -1 : 0),
  },
}

export const SUPPLY_COLOR = '#24558A'
export const DEMAND_COLOR = '#C9A34E'
export const GAP_COLOR = '#C8674A'
export const CI_COLOR = '#94a3b8'

export function merged(
  actual: (number | null)[],
  forecast: (number | null)[],
): (number | null)[] {
  return actual.map((v, i) => (v !== null && v !== undefined ? v : forecast[i]))
}

export function jobSeries(k: string, type: 's' | 'd'): (number | null)[] {
  if (k === 'AGG') return aggSeries(type)
  const j = jobs[k]
  return type === 's'
    ? merged(j.supply_actual, j.supply_forecast)
    : merged(j.demand_actual, j.demand_forecast)
}

export function jobCi(k: string, type: 's' | 'd'): (number | null)[] {
  const j = jobs[k]
  return type === 's'
    ? merged(j.supply_actual, j.supply_lower)
    : merged(j.demand_actual, j.demand_lower)
}

export function jobCiUpper(k: string, type: 's' | 'd'): (number | null)[] {
  const j = jobs[k]
  return type === 's'
    ? merged(j.supply_actual, j.supply_upper)
    : merged(j.demand_actual, j.demand_upper)
}

export function aggSeries(type: 's' | 'd'): (number | null)[] {
  return years.map((_, i) =>
    jobKeys.reduce((a, k) => a + (jobSeries(k, type)[i] ?? 0), 0),
  )
}

export function aggCi(type: 's' | 'd', bound: 'lo' | 'hi'): (number | null)[] {
  return years.map((_, i) =>
    jobKeys.reduce((a, k) => a + ((bound === 'lo' ? jobCi(k, type) : jobCiUpper(k, type))[i] ?? 0), 0),
  )
}

export function classifyGap(g: number): string {
  return g > 0 ? 'defisit bekalan' : g < 0 ? 'lebihan bekalan' : 'seimbang'
}

export function gapStatus(g: number): 'deficit' | 'surplus' | 'balanced' {
  return g > 0 ? 'deficit' : g < 0 ? 'surplus' : 'balanced'
}

export function cagr(v0: number, v1: number, n: number): number | null {
  return v0 > 0 && v1 >= 0 && n > 0 ? (Math.pow(v1 / v0, 1 / n) - 1) * 100 : null
}

export function firstCrossover(
  s: (number | null)[],
  d: (number | null)[],
  ys: number[],
  startIdx = 0,
): number | null {
  let prev = (d[startIdx] ?? 0) - (s[startIdx] ?? 0)
  for (let i = startIdx + 1; i < ys.length; i++) {
    const g = (d[i] ?? 0) - (s[i] ?? 0)
    if ((prev < 0 && g >= 0) || (prev > 0 && g <= 0) || g === 0) return ys[i]
    prev = g
  }
  return null
}

export function indexOfYear(y: number): number {
  return years.indexOf(y)
}

export interface OccupationRow {
  kod: string
  name: string
  supply: number
  demand: number
  gap: number
  status: 'deficit' | 'surplus' | 'balanced'
}

export function occupationRows(year: number): OccupationRow[] {
  const i = indexOfYear(year)
  return jobKeys
    .map((k) => {
      const supply = jobSeries(k, 's')[i] ?? 0
      const demand = jobSeries(k, 'd')[i] ?? 0
      return {
        kod: k,
        name: jobs[k].name,
        supply,
        demand,
        gap: demand - supply,
        status: gapStatus(demand - supply),
      }
    })
    .sort((a, b) => b.gap - a.gap)
}

// ---------- Scenario engine (port of dashboard v3) ----------

export function scenarioMacroValue(
  k: string,
  i: number,
  changes: ScenarioChanges,
): number {
  const base = macroData[k][i] ?? 0
  const chg = changes[k] ?? 0
  const def = scenarioDefs[k]
  return def.type === 'pct' ? base * (1 + chg / 100) : base + chg
}

export function calcScenarioIndex(i: number, changes: ScenarioChanges): number {
  let score = 0
  macroKeys.forEach((k) => {
    const v = scenarioMacroValue(k, i, changes)
    const z = (v - scenarioMeta.macro_mean[k]) / scenarioMeta.macro_std[k]
    score += z * scenarioMeta.pca_loading[k]
  })
  return score
}

export interface ScenarioResult {
  ys: number[]
  bs: (number | null)[]
  bd: (number | null)[]
  bi: (number | null)[]
  si: number[]
  ss: (number | null)[]
  sd: (number | null)[]
}

export function scenarioForJob(
  k: string,
  endY: number,
  changes: ScenarioChanges,
): ScenarioResult {
  const j = jobs[k]
  const endIdx = indexOfYear(endY)
  const start = forecastStartIdx
  const ys = years.slice(start, endIdx + 1)
  const bs = jobSeries(k, 's').slice(start, endIdx + 1)
  const bd = jobSeries(k, 'd').slice(start, endIdx + 1)
  const bi = controlIndex.slice(start, endIdx + 1)
  const si: number[] = []
  const ss: (number | null)[] = []
  const sd: (number | null)[] = []
  for (let i = start; i <= endIdx; i++) {
    const idx = calcScenarioIndex(i, changes)
    si.push(idx)
    const delta = idx - (controlIndex[i] ?? 0)
    ss.push(Math.max(0, (jobSeries(k, 's')[i] ?? 0) + j.coef_b.SUPPLY * delta))
    sd.push(Math.max(0, (jobSeries(k, 'd')[i] ?? 0) + j.coef_b.DEMAND * delta))
  }
  return { ys, bs, bd, bi, si, ss, sd }
}

export function scenarioAggregate(
  endY: number,
  changes: ScenarioChanges,
): ScenarioResult {
  const endIdx = indexOfYear(endY)
  const start = forecastStartIdx
  const ys = years.slice(start, endIdx + 1)
  const n = ys.length
  const bs = aggSeries('s').slice(start, endIdx + 1)
  const bd = aggSeries('d').slice(start, endIdx + 1)
  const bi = controlIndex.slice(start, endIdx + 1)
  const si: number[] = []
  const ss: (number | null)[] = Array(n).fill(0)
  const sd: (number | null)[] = Array(n).fill(0)
  for (let t = 0; t < n; t++) {
    const i = start + t
    si.push(calcScenarioIndex(i, changes))
  }
  jobKeys.forEach((k) => {
    const r = scenarioForJob(k, endY, changes)
    r.ss.forEach((v, t) => (ss[t] = (ss[t] ?? 0) + (v ?? 0)))
    r.sd.forEach((v, t) => (sd[t] = (sd[t] ?? 0) + (v ?? 0)))
  })
  return { ys, bs, bd, bi, si, ss, sd }
}

// ---------- Gap closure / intervention engine (port of dashboard v3) ----------

export interface RequiredRate {
  type: 'demand' | 'supply' | 'none'
  rate: number
  s: number
  d: number
  g: number
}

export function requiredRate(k: string, targetY: number): RequiredRate {
  const h = targetY - 2025
  const i = indexOfYear(targetY)
  const s = jobSeries(k, 's')[i] ?? 0
  const d = jobSeries(k, 'd')[i] ?? 0
  const g = d - s
  if (g < 0) return { type: 'demand', rate: (Math.pow(s / d, 1 / h) - 1) * 100, s, d, g }
  if (g > 0) return { type: 'supply', rate: (Math.pow(d / s, 1 / h) - 1) * 100, s, d, g }
  return { type: 'none', rate: 0, s, d, g }
}

export function balancedRate(k: string, targetY: number): number {
  const req = requiredRate(k, targetY)
  const h = targetY - 2025
  const s = req.s
  const d = req.d
  if (Math.abs(req.g) < 1) return 0
  let lo = 0
  let hi = 0.8
  for (let z = 0; z < 80; z++) {
    const r = (lo + hi) / 2
    let f: number
    if (req.g < 0) f = d * Math.pow(1 + r, h) - s * Math.pow(1 - r, h)
    else f = s * Math.pow(1 + r, h) - d * Math.pow(1 - r, h)
    if (f > 0) hi = r
    else lo = r
  }
  return ((lo + hi) / 2) * 100
}

export interface InterventionRequirements {
  s: number
  d: number
  g: number
  demandRate: number
  supplyRate: number
  balancedDemand: number
  balancedSupply: number
}

export function interventionRequirements(
  k: string,
  targetY: number,
): InterventionRequirements {
  const h = targetY - 2025
  const i = indexOfYear(targetY)
  const s = jobSeries(k, 's')[i] ?? 0
  const d = jobSeries(k, 'd')[i] ?? 0
  const g = d - s
  const demandRate = (Math.pow(s / d, 1 / h) - 1) * 100
  const supplyRate = (Math.pow(d / s, 1 / h) - 1) * 100
  const br = balancedRate(k, targetY)
  return {
    s,
    d,
    g,
    demandRate,
    supplyRate,
    balancedDemand: g < 0 ? br : -br,
    balancedSupply: g < 0 ? -br : br,
  }
}

export interface InterventionSeries {
  ys: number[]
  bs: (number | null)[]
  bd: (number | null)[]
  ss: (number | null)[]
  dd: (number | null)[]
}

export function interventionSeries(
  k: string,
  targetY: number,
  du: number,
  sa: number,
): InterventionSeries {
  const end = indexOfYear(targetY)
  const start = forecastStartIdx
  const ys = years.slice(start, end + 1)
  const bs = jobSeries(k, 's').slice(start, end + 1)
  const bd = jobSeries(k, 'd').slice(start, end + 1)
  const ss: (number | null)[] = []
  const dd: (number | null)[] = []
  ys.forEach((y, i) => {
    const h = y - 2025
    ss.push(Math.max(0, (bs[i] ?? 0) * Math.pow(Math.max(0.001, 1 + sa / 100), h)))
    dd.push(Math.max(0, (bd[i] ?? 0) * Math.pow(Math.max(0.001, 1 + du / 100), h)))
  })
  return { ys, bs, bd, ss, dd }
}
