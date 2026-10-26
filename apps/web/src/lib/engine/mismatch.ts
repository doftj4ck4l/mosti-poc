import blob from '@/features/mismatch/data/mismatch-blob.json'
import type {
  MismatchBlob,
  MismatchCategory,
  MismatchFilters,
  MismatchGroup,
  MismatchMeasure,
  MismatchScope,
  MismatchSummary,
} from '@/lib/engine/mismatch-types'

const data = blob as unknown as MismatchBlob

export type MismatchDim =
  | 'tahun'
  | 'peringkat'
  | 'institusi'
  | 'sektor_ekonomi'
  | 'sektor_pekerjaan'
  | 'kumpulan'
  | 'income'
  | 'gpa'
  | 'nec'
  | 'jawatan'
  | 'negeri'
  | 'kursus'

export const DIM_LABELS: Record<MismatchDim, string> = {
  tahun: 'Tahun Kajian',
  peringkat: 'Peringkat Pengajian',
  institusi: 'Kategori Institusi',
  sektor_ekonomi: 'Sektor Ekonomi',
  sektor_pekerjaan: 'Jenis Majikan',
  kumpulan: 'Kumpulan Pekerjaan Utama',
  income: 'Pendapatan Bulanan',
  gpa: 'Pencapaian Akademik (PNGK)',
  nec: 'Kategori NEC',
  jawatan: 'Taraf Jawatan',
  negeri: 'Negeri',
  kursus: 'Kursus Pengajian (15 Teratas)',
}

const DIM_KEYS: Record<MismatchDim, keyof MismatchSummary> = {
  tahun: 'by_tahun',
  peringkat: 'by_peringkat',
  institusi: 'by_institusi',
  sektor_ekonomi: 'by_sektor_ekonomi',
  sektor_pekerjaan: 'by_sektor_pekerjaan',
  kumpulan: 'by_kumpulan',
  income: 'by_income',
  gpa: 'by_gpa',
  nec: 'by_nec',
  jawatan: 'by_jawatan',
  negeri: 'by_negeri',
  kursus: 'top_kursus',
}

export const MEASURE_LABELS: Record<MismatchMeasure, string> = {
  vp: 'Menegak',
  hp: 'Mendatar',
  dp: 'Kedua-dua',
  ap: 'Mana-mana',
}

export const SCOPE_LABELS: Record<MismatchScope, string> = {
  overall: 'Semua sektor',
  manufacturing: 'Sektor pembuatan',
}

export const GROUP_LABELS: Record<MismatchGroup, string> = {
  all: 'Semua',
  tvet: 'TVET',
  ipt: 'Bukan TVET (IPT)',
}

export function getDataset(
  scope: MismatchScope,
  grp: MismatchGroup,
): MismatchSummary {
  const raw = data[scope][grp]
  // Summary uses base/any/dual; components use n/a/d (as on per-category rows).
  // Normalize once here so every consumer sees consistent fields.
  return { ...raw, n: raw.base, a: raw.any, d: raw.dual, total: raw.base, label: '' }
}

export function getCut(
  ds: MismatchSummary,
  dim: MismatchDim,
): MismatchCategory[] {
  return ds[DIM_KEYS[dim]] as unknown as MismatchCategory[]
}

export function pctOf(c: MismatchCategory, m: MismatchMeasure): number {
  return c[m]
}

export function matchedOf(c: MismatchCategory, m: MismatchMeasure): number {
  return c.n - c[m === 'vp' ? 'v' : m === 'hp' ? 'h' : m === 'dp' ? 'd' : 'a']
}

export function unmatchedOf(c: MismatchCategory, m: MismatchMeasure): number {
  return c[m === 'vp' ? 'v' : m === 'hp' ? 'h' : m === 'dp' ? 'd' : 'a']
}

export interface GapRow {
  label: string
  tvetN: number
  iptN: number
  tvetPct: number
  iptPct: number
  gapPp: number
}

export function gapRows(
  scope: MismatchScope,
  dim: MismatchDim,
  measure: MismatchMeasure,
): GapRow[] {
  const tvet = getDataset(scope, 'tvet')
  const ipt = getDataset(scope, 'ipt')
  const t = getCut(tvet, dim)
  const i = getCut(ipt, dim)
  const map = new Map<string, { t?: MismatchCategory; i?: MismatchCategory }>()
  t.forEach((c) => (map.set(c.label, { ...map.get(c.label), t: c })))
  i.forEach((c) => (map.set(c.label, { ...map.get(c.label), i: c })))
  const rows: GapRow[] = []
  map.forEach((v, label) => {
    if (v.t && v.i && v.t.n >= 200 && v.i.n >= 200) {
      rows.push({
        label,
        tvetN: v.t.n,
        iptN: v.i.n,
        tvetPct: v.t[measure],
        iptPct: v.i[measure],
        gapPp: v.t[measure] - v.i[measure],
      })
    }
  })
  return rows.sort((a, b) => b.gapPp - a.gapPp)
}

export const SOURCE_NOTE =
  'Sumber: Graduan_E_E_2018-2024_mismatch.xlsx — 228,680 rekod graduan, tahun kajian 2018–2024. Semua kadar dikira ke atas graduan yang bekerja dengan klasifikasi sah bagi kedua-dua dimensi (rekod Excluded dikeluarkan). TVET: politeknik, kolej komuniti, kolej vokasional dan ILKA; IPT: universiti awam dan IPTS. Kategori dengan kurang daripada 200 graduan dinilai (300 bagi senarai kursus, 50 bagi aliran tahunan) ditapis keluar. Klasifikasi ketidaksepadanan berasaskan jawapan responden dan tidak disahkan dengan rekod majikan.'

export type { MismatchFilters }
