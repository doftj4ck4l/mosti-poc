export interface JobSeries {
  name: string
  kod: string
  coef_b: { SUPPLY: number; DEMAND: number }
  r2_exog: { SUPPLY: number; DEMAND: number }
  supply_actual: (number | null)[]
  supply_forecast: (number | null)[]
  supply_lower: (number | null)[]
  supply_upper: (number | null)[]
  demand_actual: (number | null)[]
  demand_forecast: (number | null)[]
  demand_lower: (number | null)[]
  demand_upper: (number | null)[]
}

export interface ScenarioMeta {
  pca_variance: number
  macro_keys: string[]
  macro_mean: Record<string, number>
  macro_std: Record<string, number>
  pca_loading: Record<string, number>
  scenario_note: string
}

export interface MacroSwing {
  macro_swing: number
  actual_range: number
  pct: number
  phi: number
  r2_exog: number
}

export interface MacroVsArEntry {
  name: string
  SUPPLY: MacroSwing
  DEMAND: MacroSwing
}

export interface MascoBlob {
  years: number[]
  years_hist: number[]
  jobs: Record<string, JobSeries>
  macro: Record<string, (number | null)[]>
  control_index: (number | null)[]
  macro_corr: Record<string, { supply: number; demand: number }>
  macro_vs_ar: Record<string, MacroVsArEntry>
  ar_decay: Record<string, number[]>
  scenario_meta: ScenarioMeta
}

export interface ScenarioDef {
  min: number
  max: number
  step: number
  unit: 'pp' | '%'
  type: 'pp' | 'pct'
}
