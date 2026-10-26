export interface MismatchCategory {
  label: string
  total: number
  n: number
  v: number
  h: number
  d: number
  a: number
  vp: number
  hp: number
  dp: number
  ap: number
}

export interface MismatchSummary {
  label?: string
  total?: number
  n: number
  v: number
  h: number
  dual: number
  a: number
  d: number
  any: number
  vp: number
  hp: number
  dp: number
  ap: number
  bekerja: number
  graduan: number
  base: number
  onlyv: number
  onlyh: number
  none: number
  over: number
  under: number
  by_tahun: MismatchCategory[]
  by_peringkat: MismatchCategory[]
  by_institusi: MismatchCategory[]
  by_sektor_ekonomi: MismatchCategory[]
  by_sektor_pekerjaan: MismatchCategory[]
  by_kumpulan: MismatchCategory[]
  by_income: MismatchCategory[]
  by_gpa: MismatchCategory[]
  by_nec: MismatchCategory[]
  by_jawatan: MismatchCategory[]
  by_negeri: MismatchCategory[]
  top_kursus: MismatchCategory[]
}

export interface MismatchBlob {
  overall: Record<'all' | 'tvet' | 'ipt', MismatchSummary>
  manufacturing: Record<'all' | 'tvet' | 'ipt', MismatchSummary>
  cmp_sektor: string[]
}

export type MismatchScope = keyof Pick<MismatchBlob, 'overall' | 'manufacturing'>
export type MismatchGroup = 'all' | 'tvet' | 'ipt'
export type MismatchMeasure = 'vp' | 'hp' | 'dp' | 'ap'

export interface MismatchFilters {
  scope: MismatchScope
  grp: MismatchGroup
  measure: MismatchMeasure
}
