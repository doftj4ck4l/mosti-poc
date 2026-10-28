import blob from '@/features/professional/data/bem-mbot.json'

export type Body = 'BEM' | 'MBOT'
export type Row = [number, string, string, number]

interface BodyData {
  types: string[]
  fields: string[]
  rows: Row[]
}

const data = blob as unknown as Record<Body, BodyData>

export const BODIES: Body[] = ['BEM', 'MBOT']
export const BODY_LABELS: Record<Body, string> = {
  BEM: 'BEM · Lembaga Jurutera Malaysia',
  MBOT: 'MBOT · Lembaga Teknologis Malaysia',
}

export function yearsFor(body: Body): number[] {
  return [...new Set(data[body].rows.map((r) => r[0]))].sort((a, b) => a - b)
}

export function typesFor(body: Body): string[] {
  return data[body].types.filter((t) => t !== 'Semua')
}

export function fieldsFor(body: Body): string[] {
  return data[body].fields.filter((f) => f !== 'Semua')
}

export function rowsFor(body: Body, field = 'Semua', type = 'Semua'): Row[] {
  return data[body].rows.filter(
    (r) => (field === 'Semua' || r[2] === field) && (type === 'Semua' || r[1] === type)
  )
}

export function totalFor(body: Body, year: number, field = 'Semua'): number {
  return rowsFor(body, field)
    .filter((r) => r[0] === year)
    .reduce((a, r) => a + r[3], 0)
}

export function totalsByYear(body: Body, field = 'Semua'): { year: number; total: number }[] {
  return yearsFor(body).map((y) => ({ year: y, total: totalFor(body, y, field) }))
}

export function byTypeByYear(
  body: Body,
  field = 'Semua'
): { year: number; [type: string]: number }[] {
  const types = typesFor(body)
  return yearsFor(body).map((y) => {
    const row: { year: number; [type: string]: number } = { year: y }
    types.forEach((t) => {
      row[t] = rowsFor(body, field, t)
        .filter((r) => r[0] === y)
        .reduce((a, r) => a + r[3], 0)
    })
    return row
  })
}

export function fieldTotals(body: Body, year: number): { field: string; total: number }[] {
  return fieldsFor(body)
    .map((f) => ({ field: f, total: totalFor(body, year, f) }))
    .sort((a, b) => b.total - a.total)
}

export function fieldGrowth(body: Body): { field: string; growth: number; from: number; to: number }[] {
  const years = yearsFor(body)
  const from = years[years.length - 2]
  const to = years[years.length - 1]
  return fieldsFor(body)
    .map((f) => {
      const a = totalFor(body, from, f)
      const b = totalFor(body, to, f)
      return { field: f, growth: a ? ((b - a) / a) * 100 : 0, from: a, to: b }
    })
    .sort((x, y) => y.growth - x.growth)
}

export const BODY_COLORS = ['#0B2E63', '#287A5A', '#A4681B', '#7A3E7C', '#2C6E9B', '#B24A56']
