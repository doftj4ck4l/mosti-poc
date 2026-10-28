import blob from '@/features/spm/data/spm-blob.json'

export interface SubjectYear {
  gpmp: number
  passrate: number
  excellent: number
  credit: number
  fail: number
  candidates: number
  fail_count: number
  credit_plus_pct: number
  credit_plus_count: number
}

export interface SpmSubject {
  name: string
  series: Record<string, SubjectYear>
}

interface CoreFact {
  registered: number
  average: number
  averageLabel: string
  cert: number
  gap: number
  sources: Record<string, { year: number; page: number; note?: string }>
}

interface Blob {
  subjects: Record<string, SpmSubject>
  coreFacts: Record<string, CoreFact>
  keyLabels: Record<string, { ms: string; en: string }>
  groups: {
    all: null
    core: string[]
    pure: string[]
    applied: string[]
    vocational: string[]
  }
}

const data = blob as unknown as Blob

export const subjects = data.subjects
export const coreFacts = data.coreFacts
export const groups = data.groups
export const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
export const latestYear = 2025

export const SPM_COLORS = [
  '#0B2E63',
  '#287A5A',
  '#A4681B',
  '#7A3E7C',
  '#2C6E9B',
  '#B24A56',
  '#52677A',
  '#846B2A',
]

export const KEY_CODES = ['1449', '3472', '4531', '4541', '4551', '1103', '1119', '1249']

export const GROUP_LABELS: Record<string, string> = {
  all: 'Semua mata pelajaran',
  core: 'Teras',
  pure: 'Sains Tulen',
  applied: 'Sains Gunaan',
  vocational: 'Vokasional',
}

export const METRICS: Record<string, { label: string; unit: string; lowerBetter: boolean }> = {
  gpmp: { label: 'GPMP', unit: '', lowerBetter: true },
  candidates: { label: 'Calon menduduki', unit: '', lowerBetter: false },
  credit_plus_pct: { label: 'Kepujian+ (%)', unit: '%', lowerBetter: false },
  fail: { label: 'Gagal (%)', unit: '%', lowerBetter: true },
  passrate: { label: 'Lulus (%)', unit: '%', lowerBetter: false },
}

export const localityValues: Record<
  number,
  { bandar: number; luarBandar: number; gap: number }
> = {
  2024: { bandar: 4.47, luarBandar: 4.92, gap: 0.45 },
  2025: { bandar: 4.4, luarBandar: 4.81, gap: 0.41 },
}

export function subjectName(code: string): string {
  return data.keyLabels[code]?.ms ?? subjects[code]?.name ?? code
}

export function subjectNameEn(code: string): string {
  return data.keyLabels[code]?.en ?? subjects[code]?.name ?? code
}

export interface SubjectOption {
  code: string
  name: string
  candidates2025: number
}

export function subjectOptions(): SubjectOption[] {
  return Object.keys(subjects)
    .map((code) => ({
      code,
      name: subjectName(code),
      candidates2025: subjects[code].series['2025']?.candidates ?? 0,
    }))
    .sort((a, b) => b.candidates2025 - a.candidates2025)
}

export function seriesFor(
  code: string,
  metric: keyof SubjectYear
): { year: number; value: number | null }[] {
  return years.map((y) => {
    const row = subjects[code]?.series[String(y)]
    return { year: y, value: row ? (row[metric] as number) : null }
  })
}

export function delta(code: string, metric: keyof SubjectYear, from: number, to: number): number | null {
  const a = subjects[code]?.series[String(from)]?.[metric]
  const b = subjects[code]?.series[String(to)]?.[metric]
  if (a === undefined || b === undefined || a === null || b === null) return null
  return (b as number) - (a as number)
}

export function groupCodes(group: string): string[] {
  if (group === 'all') return Object.keys(subjects)
  return (groups[group as 'core' | 'pure' | 'applied' | 'vocational'] ?? []) as string[]
}

export function nationalSeries(metric: 'average' | 'cert' | 'registered' | 'gap') {
  return years.map((y) => ({ year: y, value: coreFacts[String(y)]?.[metric] ?? null }))
}

export function pctChange(a: number, b: number): number | null {
  return a ? ((b - a) / a) * 100 : null
}
