export const fmt = (n: number | null | undefined) =>
  n === null || n === undefined || !Number.isFinite(n)
    ? '—'
    : Math.round(n).toLocaleString('en-US')

export const fmt1 = (n: number | null | undefined) =>
  n === null || n === undefined || !Number.isFinite(n)
    ? '—'
    : (Math.round(n * 10) / 10).toLocaleString('en-US')

export const pct = (n: number | null | undefined) =>
  n === null || n === undefined || !Number.isFinite(n) ? '—' : (n >= 0 ? '+' : '') + fmt1(n) + '%'

export const pp = (n: number | null | undefined) =>
  n === null || n === undefined || !Number.isFinite(n) ? '—' : (n >= 0 ? '+' : '') + fmt1(n) + ' pp'

export const fmt1Signed = (n: number | null | undefined) =>
  n === null || n === undefined || !Number.isFinite(n)
    ? '—'
    : (n >= 0 ? '+' : '') + (Math.round(n * 10) / 10).toLocaleString('en-US')

export const fmtSigned = (n: number | null | undefined) =>
  n === null || n === undefined || !Number.isFinite(n)
    ? '—'
    : (n >= 0 ? '+' : '') + Math.round(n).toLocaleString('en-US')
