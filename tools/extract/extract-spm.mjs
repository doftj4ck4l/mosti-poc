import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SRC = '/Users/wasabisnorter/Downloads/MOSTI POC/TalentIntelligence.html'
const html = readFileSync(SRC, 'utf8')
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1])
const main = scripts[3]

const subjects = JSON.parse(scripts[0].trim())

function grab(re, label) {
  const m = main.match(re)
  if (!m) throw new Error(`could not extract ${label}`)
  return m[1]
}

const evalLiteral = (source, params = {}) => {
  const names = Object.keys(params)
  const fn = new Function(...names, `return (${source})`)
  return fn(...names.map((n) => params[n]))
}

const coreFacts = evalLiteral(
  grab(/const SPM_CORE_FACTS=(\{[\s\S]*?\n\});/, 'SPM_CORE_FACTS'),
)
const keyLabels = evalLiteral(
  grab(/const SPM_KEY_LABELS=(\{[\s\S]*?\});/, 'SPM_KEY_LABELS'),
)
const groups = evalLiteral(
  grab(/const SPM_GROUPS=(\{[\s\S]*?\});/, 'SPM_GROUPS'),
  { SPM_SUBJECTS: subjects },
)
const docs = evalLiteral(
  grab(/const PRELOADED_SOURCE_DOCS=(\[[\s\S]*?\]);/, 'PRELOADED_SOURCE_DOCS'),
)

const blob = { subjects, coreFacts, keyLabels, groups }
const outDir = join(ROOT, 'apps/web/src/features/spm/data')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'spm-blob.json'), JSON.stringify(blob))
console.log('wrote spm-blob.json')

const catalogDir = join(ROOT, 'apps/web/src/features/data-catalog/data')
mkdirSync(catalogDir, { recursive: true })
writeFileSync(
  join(catalogDir, 'documents.json'),
  JSON.stringify(
    docs.map(({ id, module, type, title, period, access, indexed, fileName, preloaded }) => ({
      id,
      module,
      type,
      title,
      period,
      access,
      indexed,
      fileName,
      preloaded,
    })),
  ),
)
console.log('wrote documents.json')

const years = Object.keys(coreFacts)
const last = coreFacts[2025]
const golden = {
  subjects: Object.keys(subjects).length,
  years: years.length,
  gpk_2025: last.average,
  cert_2025: last.cert,
  registered_2025: last.registered,
  gap_2025: last.gap,
  docs: docs.length,
}
console.log(JSON.stringify(golden, null, 2))

const assert = (name, actual, expected) => {
  const ok = actual === expected
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${actual} vs ${expected}`)
  if (!ok) process.exitCode = 1
}
assert('subjects', golden.subjects, 95)
assert('years', golden.years, 8)
assert('GPK 2025', golden.gpk_2025, 4.42)
assert('cert 2025', golden.cert_2025, 94.29)
assert('registered 2025', golden.registered_2025, 413299)
assert('gap 2025', golden.gap_2025, 0.41)
assert('documents', golden.docs, 15)
