import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SRC = '/Users/wasabisnorter/Downloads/MOSTI POC/TalentIntelligence.html'
const html = readFileSync(SRC, 'utf8')
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1])
const main = scripts[4]

const start = main.indexOf('const DATA=')
const end = main.indexOf('};', main.indexOf('rows:', start)) + 2
const literal = main.slice(start + 'const DATA='.length, end).replace(/;\s*$/, '')

const DATA = new Function(`return (${literal})`)()

const clean = {
  BEM: { types: DATA.BEM.types, fields: DATA.BEM.fields, rows: DATA.BEM.rows },
  MBOT: { types: DATA.MBOT.types, fields: DATA.MBOT.fields, rows: DATA.MBOT.rows },
}

const outDir = join(ROOT, 'apps/web/src/features/professional/data')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'bem-mbot.json'), JSON.stringify(clean))
console.log('wrote bem-mbot.json')

const totals = (body) => {
  const t = {}
  for (const [y, , , c] of clean[body].rows) t[y] = (t[y] ?? 0) + c
  return t
}
const bem = totals('BEM')
const mbot = totals('MBOT')
const golden = {
  bemRows: clean.BEM.rows.length,
  mbotRows: clean.MBOT.rows.length,
  bem2025: bem[2025],
  mbot2025: mbot[2025],
  years: Object.keys(bem).length,
}
console.log(JSON.stringify(golden, null, 2))

const assert = (name, actual, expected) => {
  const ok = actual === expected
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${actual} vs ${expected}`)
  if (!ok) process.exitCode = 1
}
assert('BEM rows', golden.bemRows, 72)
assert('MBOT rows', golden.mbotRows, 72)
assert('years', golden.years, 6)
assert('BEM 2025 total', golden.bem2025, 101800)
assert('MBOT 2025 total', golden.mbot2025, 64420)
