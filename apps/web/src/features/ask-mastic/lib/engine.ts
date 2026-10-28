import { t, type Lang } from '@/lib/i18n'
import {
  classifyGap,
  indexOfYear,
  interventionRequirements,
  jobKeys,
  jobSeries,
  jobs,
  macroCorr,
  macroKeys,
  macroShortNames,
  occupationRows,
  scenarioAggregate,
  scenarioDefs,
  zeroChanges,
} from '@/lib/engine/masco'
import {
  DIM_LABELS,
  getDataset,
} from '@/lib/engine/mismatch'
import {
  coreFacts,
  delta,
  localityValues,
  subjectName,
  subjectOptions,
  subjects,
} from '@/features/spm/lib/spm'
import { fieldGrowth, fieldTotals, totalFor, yearsFor } from '@/features/professional/lib/professional'
import {
  FORESIGHT_FIELDS,
  FORESIGHT_THEMES,
} from '@/features/foresight/data/foresight'
import { catalogModules } from '@/features/data-catalog/data/catalog'
import { fmt, fmt1, fmt1Signed, fmt2, fmt2Signed } from '@/lib/engine/format'

export interface AskAnswer {
  intent: string
  text: string
  bullets?: string[]
  table?: { headers: string[]; rows: string[][] }
  citation: { source: string; owner: string; period: string }
  link?: { label: string; to: string }
  suggestions?: string[]
}

const SPM_CITE = {
  source: 'Laporan Analisis Keputusan SPM 2018–2025',
  owner: 'Lembaga Peperiksaan, KPM',
  period: '2018–2025',
}
const SKPG_CITE = {
  source: 'Sistem Kajian Pengesanan Graduan (SKPG)',
  owner: 'KPT · Analisis MASTIC',
  period: '2018–2024',
}
const DDA_CITE = {
  source: 'DDA Sektor E&E · Supply & Demand MASCO',
  owner: 'MASTIC · MOSTI',
  period: '2015–2040',
}
const PRO_CITE = {
  source: 'Data Pendaftaran Profesional (ilustratif)',
  owner: 'BEM · MBOT',
  period: '2020–2025',
}
const CATALOG_CITE = {
  source: 'Katalog Sumber Data',
  owner: 'MASTIC',
  period: 'Semasa',
}

const SUBJECT_ALIASES: Record<string, string> = {
  matematik: '1449',
  'matematik tambahan': '3472',
  fizik: '4531',
  physics: '4531',
  kimia: '4541',
  chemistry: '4541',
  biologi: '4551',
  biology: '4551',
  sejarah: '1249',
  history: '1249',
  'bahasa melayu': '1103',
  'bahasa inggeris': '1119',
  english: '1119',
  'sains': '1511',
  'sains komputer': '3770',
}

const OCC_ALIASES: Record<string, string> = {
  'jurutera elektrik': '2151',
  'electrical engineer': '2151',
  'jurutera elektronik': '2152',
  'electronic engineer': '2152',
  'jurutera perindustrian': '2141',
  'jurutera pengeluaran': '2141',
  'industrial engineer': '2141',
  'juruteknik elektrik': '3113',
  'electrical technician': '3113',
  'juruteknik elektronik': '3114',
  'electronics technician': '3114',
  'penyelia pembuatan': '3122',
  'manufacturing supervisor': '3122',
  'pengurus r&d': '1223',
  'pengurus pembuatan': '1321',
  'mekanik elektrik': '7412',
  'mekanik elektronik': '7421',
  'electronics mechanic': '7421',
}

const DEFAULT_SUGGESTIONS = [
  'Subjek mana bertambah baik dalam 3 tahun?',
  'Pekerjaan mana defisit pada 2040?',
  'Berapa jurang TVET vs IPT?',
  'Apa pemacu permintaan bakat?',
  'Berapa kadar diperlukan untuk seimbang 2040?',
]

export function defaultSuggestions(): string[] {
  return DEFAULT_SUGGESTIONS
}

function normalize(q: string): string {
  return q.toLowerCase().replace(/[’']/g, '').replace(/\s+/g, ' ').trim()
}

function findSubject(q: string): string | null {
  const n = normalize(q)
  for (const [alias, code] of Object.entries(SUBJECT_ALIASES)) {
    if (n.includes(alias)) return code
  }
  for (const [code, s] of Object.entries(subjects)) {
    if (n.includes(s.name.toLowerCase())) return code
  }
  const m = n.match(/\b(\d{4})\b/)
  if (m && subjects[m[1]]) return m[1]
  return null
}

function findOccupation(q: string): string | null {
  const n = normalize(q)
  for (const [alias, code] of Object.entries(OCC_ALIASES)) {
    if (n.includes(alias)) return code
  }
  for (const code of jobKeys) {
    if (n.includes(jobs[code].name.toLowerCase())) return code
  }
  const m = n.match(/\b(\d{4})\b/)
  if (m && jobs[m[1]]) return m[1]
  return null
}

function subjectAnswer(code: string, lang: Lang): AskAnswer {
  const s = subjects[code].series['2025']
  const d1 = delta(code, 'gpmp', 2024, 2025)
  const d3 = delta(code, 'gpmp', 2022, 2025)
  const name = subjectName(code)
  const improved = d3 !== null && d3 < 0
  return {
    intent: 'subject',
    text: t(
      `GPMP ${name} (${code}) pada 2025 ialah ${fmt2(s?.gpmp)}. Perubahan ${fmt2Signed(d1)} berbanding 2024 dan ${fmt2Signed(d3)} berbanding 2022 — ${improved ? 'bertambah baik (GPMP lebih rendah)' : d3 === 0 ? 'tidak berubah' : 'meningkat (GPMP lebih tinggi)'}.`,
      `GPMP for ${name} (${code}) in 2025 is ${fmt2(s?.gpmp)}. Change of ${fmt2Signed(d1)} vs 2024 and ${fmt2Signed(d3)} vs 2022 — ${improved ? 'improving (lower GPMP)' : d3 === 0 ? 'unchanged' : 'worsening (higher GPMP)'}.`,
      lang
    ),
    bullets: [
      t(
        `Calon menduduki 2025: ${fmt(s?.candidates)}`,
        `Candidates sitting in 2025: ${fmt(s?.candidates)}`,
        lang
      ),
      t(
        `Kepujian+ ${fmt1(s?.credit_plus_pct)}% · Gagal ${fmt1(s?.fail)}% · Lulus ${fmt1(s?.passrate)}%`,
        `Credit+ ${fmt1(s?.credit_plus_pct)}% · Fail ${fmt1(s?.fail)}% · Pass ${fmt1(s?.passrate)}%`,
        lang
      ),
    ],
    citation: SPM_CITE,
    link: { label: t('Buka Prestasi SPM', 'Open SPM Performance', lang), to: '/analytics/spm' },
  }
}

function topImprovers(lang: Lang): AskAnswer {
  const rows = subjectOptions()
    .map((o) => ({
      ...o,
      gpmp: subjects[o.code].series['2025']?.gpmp ?? null,
      d3: delta(o.code, 'gpmp', 2022, 2025),
      d1: delta(o.code, 'gpmp', 2024, 2025),
    }))
    .filter((r) => r.d3 !== null && r.candidates2025 >= 1000)
    .sort((a, b) => (a.d3 ?? 0) - (b.d3 ?? 0))
    .slice(0, 6)
  return {
    intent: 'spm_improvers',
    text: t(
      'Enam mata pelajaran dengan penambahbaikan GPMP terbesar 2022→2025 (calon ≥1,000). Nilai negatif bermaksud GPMP lebih rendah = pencapaian lebih baik.',
      'Six subjects with the largest GPMP improvement 2022→2025 (≥1,000 candidates). Negative means lower GPMP = better performance.',
      lang
    ),
    table: {
      headers: [
        t('Mata pelajaran', 'Subject', lang),
        'GPMP 2025',
        'Δ 3 tahun',
        t('Calon 2025', 'Candidates 2025', lang),
      ],
      rows: rows.map((r) => [r.name, fmt2(r.gpmp), fmt2Signed(r.d3), fmt(r.candidates2025)]),
    },
    citation: SPM_CITE,
    link: { label: t('Buka Prestasi SPM', 'Open SPM Performance', lang), to: '/analytics/spm' },
  }
}

function spmNational(lang: Lang): AskAnswer {
  const c = coreFacts['2025']
  const p = coreFacts['2024']
  return {
    intent: 'spm_national',
    text: t(
      `Prestasi SPM 2025: GPK ${fmt2(c.average)} (${fmt2Signed(c.average - p.average)} berbanding 2024), ${fmt2(c.cert)}% layak dianugerahkan sijil, ${fmt(c.registered)} calon berdaftar, dan jurang bandar–luar bandar ${fmt2(c.gap)}.`,
      `SPM 2025: GPK ${fmt2(c.average)} (${fmt2Signed(c.average - p.average)} vs 2024), ${fmt2(c.cert)}% eligible for certificate, ${fmt(c.registered)} registered candidates, urban–rural gap ${fmt2(c.gap)}.`,
      lang
    ),
    bullets: [
      t('2021 ialah perubahan konteks (KSSM + pandemik).', '2021 marks a context change (KSSM + pandemic).', lang),
      t(
        `Jurang mengecil daripada ${fmt2(localityValues[2024].gap)} (2024) kepada ${fmt2(localityValues[2025].gap)} (2025).`,
        `Gap narrowed from ${fmt2(localityValues[2024].gap)} (2024) to ${fmt2(localityValues[2025].gap)} (2025).`,
        lang
      ),
    ],
    citation: SPM_CITE,
    link: { label: t('Buka Prestasi SPM', 'Open SPM Performance', lang), to: '/analytics/spm' },
  }
}

function mismatchAnswer(lang: Lang, q: string): AskAnswer {
  const scope = /pembuatan|manufactur/.test(normalize(q)) ? 'manufacturing' : 'overall'
  const all = getDataset(scope, 'all')
  const tvet = getDataset(scope, 'tvet')
  const ipt = getDataset(scope, 'ipt')
  return {
    intent: 'mismatch',
    text: t(
      `Dalam skop ${scope === 'overall' ? 'semua sektor' : 'pembuatan (proksi E&E)'}, ${fmt1(all.ap)}% daripada ${fmt(all.n)} graduan dinilai mengalami sekurang-kurangnya satu bentuk ketidaksepadanan (menegak ${fmt1(all.vp)}%, mendatar ${fmt1(all.hp)}%).`,
      `In the ${scope === 'overall' ? 'all sectors' : 'manufacturing (E&E proxy)'} scope, ${fmt1(all.ap)}% of ${fmt(all.n)} assessed graduates experience at least one form of mismatch (vertical ${fmt1(all.vp)}%, horizontal ${fmt1(all.hp)}%).`,
      lang
    ),
    bullets: [
      t(
        `TVET: ${fmt1(tvet.ap)}% (n=${fmt(tvet.n)}) vs IPT: ${fmt1(ipt.ap)}% (n=${fmt(ipt.n)}).`,
        `TVET: ${fmt1(tvet.ap)}% (n=${fmt(tvet.n)}) vs IPT: ${fmt1(ipt.ap)}% (n=${fmt(ipt.n)}).`,
        lang
      ),
      t(
        `Terlebih kelayakan: TVET ${fmt(tvet.over)} vs IPT ${fmt(ipt.over)}; kurang kelayakan: TVET ${fmt(tvet.under)} vs IPT ${fmt(ipt.under)}.`,
        `Overqualified: TVET ${fmt(tvet.over)} vs IPT ${fmt(ipt.over)}; underqualified: TVET ${fmt(tvet.under)} vs IPT ${fmt(ipt.under)}.`,
        lang
      ),
      t(
        'Klasifikasi berasaskan jawapan responden, bukan rekod majikan.',
        'Classification is respondent-reported, not employer-verified.',
        lang
      ),
    ],
    citation: SKPG_CITE,
    link: { label: t('Buka E&E Mismatch', 'Open E&E Mismatch', lang), to: '/analytics/eande/mismatch' },
  }
}

function dimensionAnswer(lang: Lang, dimKey: 'negeri' | 'kursus' | 'income' | 'institusi'): AskAnswer {
  const ds = getDataset('overall', 'all')
  const key = dimKey === 'kursus' ? 'top_kursus' : dimKey === 'negeri' ? 'by_negeri' : dimKey === 'income' ? 'by_income' : 'by_institusi'
  const items = ds[key] as unknown as { label: string; n: number; ap: number; vp: number; hp: number }[]
  const rows = [...items].sort((a, b) => b.ap - a.ap).slice(0, 6)
  return {
    intent: `dim_${dimKey}`,
    text: t(
      `Enam kategori ${DIM_LABELS[dimKey]} dengan kadar ketidaksepadanan tertinggi (mana-mana jenis).`,
      `Top six ${DIM_LABELS[dimKey]} categories by any-mismatch rate.`,
      lang
    ),
    table: {
      headers: [t('Kategori', 'Category', lang), 'n', 'Menegak %', 'Mendatar %', t('Mana-mana %', 'Any %', lang)],
      rows: rows.map((r) => [r.label, fmt(r.n), fmt1(r.vp), fmt1(r.hp), fmt1(r.ap)]),
    },
    citation: SKPG_CITE,
    link: { label: t('Buka E&E Mismatch', 'Open E&E Mismatch', lang), to: '/analytics/eande/mismatch' },
  }
}

function occupationAnswer(code: string, lang: Lang): AskAnswer {
  const i40 = indexOfYear(2040)
  const s = jobSeries(code, 's')[i40] ?? 0
  const d = jobSeries(code, 'd')[i40] ?? 0
  const gap = d - s
  return {
    intent: 'occupation',
    text: t(
      `${jobs[code].name} (${code}) pada 2040: supply ${fmt(s)}, demand ${fmt(d)}, jurang ${fmt(gap)} — ${classifyGap(gap)}.`,
      `${jobs[code].name} (${code}) in 2040: supply ${fmt(s)}, demand ${fmt(d)}, gap ${fmt(gap)} — ${classifyGap(gap)}.`,
      lang
    ),
    bullets: [
      t(
        `R² exog demand: ${fmt1(jobs[code].r2_exog.DEMAND * 100)}% · CI 2040 relatif: ${
          (() => {
            const lo = jobs[code].demand_lower[i40]
            const hi = jobs[code].demand_upper[i40]
            return d && lo != null && hi != null ? fmt1(((hi - lo) / d) * 100) + '%' : '—'
          })()
        }`,
        `Demand R² exog: ${fmt1(jobs[code].r2_exog.DEMAND * 100)}% · relative 2040 CI: ${
          (() => {
            const lo = jobs[code].demand_lower[i40]
            const hi = jobs[code].demand_upper[i40]
            return d && lo != null && hi != null ? fmt1(((hi - lo) / d) * 100) + '%' : '—'
          })()
        }`,
        lang
      ),
    ],
    citation: DDA_CITE,
    link: { label: t('Buka Supply & Demand', 'Open Supply & Demand', lang), to: '/analytics/eande/supply-demand' },
  }
}

function deficitAnswer(lang: Lang): AskAnswer {
  const rows = occupationRows(2040)
  const deficit = rows.filter((r) => r.gap > 0)
  const surplus = rows.filter((r) => r.gap < 0)
  return {
    intent: 'deficit',
    text: t(
      `Pada 2040, ${deficit.length} pekerjaan berpotensi defisit dan ${surplus.length} berpotensi lebihan. Defisit tertumpu pada pekerjaan profesional berkemahiran tinggi; lebihan pada pekerjaan teknikal peringkat diploma/TVET.`,
      `By 2040, ${deficit.length} occupations are potential deficits and ${surplus.length} potential surpluses. Deficits concentrate in high-skilled professional roles; surpluses in diploma/TVET-level technical roles.`,
      lang
    ),
    table: {
      headers: [t('Kod', 'Code', lang), t('Pekerjaan', 'Occupation', lang), 'Supply 2040', 'Demand 2040', t('Jurang', 'Gap', lang)],
      rows: [...deficit, ...surplus].map((r) => [r.kod, r.name, fmt(r.supply), fmt(r.demand), fmt(r.gap)]),
    },
    citation: DDA_CITE,
    link: { label: t('Buka E&E Supply & Demand', 'Open E&E Supply & Demand', lang), to: '/analytics/eande/supply-demand' },
  }
}

function driversAnswer(lang: Lang): AskAnswer {
  const rows = macroKeys
    .map((k) => ({ k, label: macroShortNames[k], ...macroCorr[k] }))
    .sort((a, b) => b.demand - a.demand)
  return {
    intent: 'drivers',
    text: t(
      'Pertumbuhan teknologi (r = 0.671) dan aktiviti ekonomi (0.607) memberi isyarat lebih kuat berbanding nilai pelaburan (0.301). Korelasi menunjukkan pergerakan bersama, bukan sebab-akibat.',
      'Technology growth (r = 0.671) and economic activity (0.607) give stronger signals than investment value (0.301). Correlation is co-movement, not causation.',
      lang
    ),
    table: {
      headers: [t('Faktor', 'Factor', lang), t('Korelasi demand', 'Demand correlation', lang), t('Korelasi supply', 'Supply correlation', lang)],
      rows: rows.map((r) => [r.label, fmt1(r.demand), fmt1(r.supply)]),
    },
    citation: DDA_CITE,
    link: { label: t('Buka Metodologi', 'Open Methodology', lang), to: '/model' },
  }
}

function scenarioAnswer(lang: Lang, q: string): AskAnswer {
  const n = normalize(q)
  const changes = zeroChanges()
  const which = /pelaburan|investment/.test(n)
    ? 0
    : /teknologi|technology/.test(n)
      ? 5
      : /inflasi|inflation/.test(n)
        ? 4
        : 1
  changes[macroKeys[which]] = which === 0 ? 5 : which === 5 ? 5 : 2
  const r = scenarioAggregate(2040, changes)
  const bS = r.bs.at(-1) ?? 0
  const sS = r.ss.at(-1) ?? 0
  const bD = r.bd.at(-1) ?? 0
  const sD = r.sd.at(-1) ?? 0
  const factor = macroShortNames[macroKeys[which]]
  const chg = changes[macroKeys[which]]
  return {
    intent: 'scenario',
    text: t(
      `Senario indikatif: ${factor} ${chg >= 0 ? '+' : ''}${fmt1(chg)} ${scenarioDefs[macroKeys[which]].unit} menjelang 2040 mengubah supply agregat ${fmt1Signed(sS - bS)} dan demand agregat ${fmt1Signed(sD - bD)} berbanding baseline. Ini what-if, bukan anggaran kausal.`,
      `Indicative scenario: ${factor} ${chg >= 0 ? '+' : ''}${fmt1(chg)} ${scenarioDefs[macroKeys[which]].unit} by 2040 changes aggregate supply by ${fmt1Signed(sS - bS)} and aggregate demand by ${fmt1Signed(sD - bD)} vs baseline. This is what-if, not a causal estimate.`,
      lang
    ),
    bullets: [
      t(
        `Jurang baseline 2040: ${fmt(bD - bS)} → selepas senario: ${fmt(sD - sS)}.`,
        `Baseline 2040 gap: ${fmt(bD - bS)} → after scenario: ${fmt(sD - sS)}.`,
        lang
      ),
    ],
    citation: DDA_CITE,
    link: { label: t('Buka Scenario Simulator', 'Open Scenario Simulator', lang), to: '/simulator/scenario' },
  }
}

function gapClosureAnswer(lang: Lang): AskAnswer {
  const req = interventionRequirements('AGG', 2040)
  return {
    intent: 'gap_closure',
    text: t(
      `Untuk menghampiri keseimbangan agregat pada 2040, demand perlu berubah ${fmt1Signed(req.demandRate)}% setahun (demand sahaja) atau supply ${fmt1Signed(req.supplyRate)}% setahun (supply sahaja). Gabungan 50/50: demand ${fmt1Signed(req.balancedDemand)}%, supply ${fmt1Signed(req.balancedSupply)}% setahun.`,
      `To approach aggregate balance by 2040, demand would need to change ${fmt1Signed(req.demandRate)}%/yr (demand only) or supply ${fmt1Signed(req.supplyRate)}%/yr (supply only). 50/50 mix: demand ${fmt1Signed(req.balancedDemand)}%, supply ${fmt1Signed(req.balancedSupply)}%/yr.`,
      lang
    ),
    bullets: [
      t(
        `Baseline 2040: supply ${fmt(req.s)}, demand ${fmt(req.d)}, jurang ${fmt(req.g)}.`,
        `Baseline 2040: supply ${fmt(req.s)}, demand ${fmt(req.d)}, gap ${fmt(req.g)}.`,
        lang
      ),
      t(
        'Kadar dikompaun dari 2026; ini ujian matematik, bukan cadangan dasar automatik.',
        'Rates compound from 2026; this is a mathematical test, not an automatic policy recommendation.',
        lang
      ),
    ],
    citation: DDA_CITE,
    link: { label: t('Buka Gap Closure', 'Open Gap Closure', lang), to: '/simulator/interventions' },
  }
}

function professionalAnswer(lang: Lang): AskAnswer {
  const bemYears = yearsFor('BEM')
  const latest = bemYears[bemYears.length - 1]
  const prev = bemYears[bemYears.length - 2]
  const bem = totalFor('BEM', latest)
  const bemPrev = totalFor('BEM', prev)
  const mbot = totalFor('MBOT', latest)
  const fastest = fieldGrowth('BEM')[0]
  const largest = fieldTotals('BEM', latest)[0]
  return {
    intent: 'professional',
    text: t(
      `Pendaftaran profesional 2025 (ilustratif): BEM ${fmt(bem)} (${fmt1Signed(((bem - bemPrev) / bemPrev) * 100)}% vs ${prev}) dan MBOT ${fmt(mbot)}. Bidang terbesar BEM: ${largest?.field} (${fmt(largest?.total)}); pertumbuhan tertinggi: ${fastest?.field} (${fmt1Signed(fastest?.growth)}%).`,
      `Professional registrations 2025 (illustrative): BEM ${fmt(bem)} (${fmt1Signed(((bem - bemPrev) / bemPrev) * 100)}% vs ${prev}) and MBOT ${fmt(mbot)}. Largest BEM field: ${largest?.field} (${fmt(largest?.total)}); fastest growth: ${fastest?.field} (${fmt1Signed(fastest?.growth)}%).`,
      lang
    ),
    bullets: [
      t('Angka ilustratif sehingga dataset rasmi dimuatkan.', 'Figures are illustrative until the official dataset is loaded.', lang),
    ],
    citation: PRO_CITE,
    link: { label: t('Buka Bakat Profesional', 'Open Professional Talent', lang), to: '/analytics/professional' },
  }
}

function foresightAnswer(lang: Lang): AskAnswer {
  return {
    intent: 'foresight',
    text: t(
      'STI Foresight 2025–2040 mengenal pasti 10 bidang kemahiran STEM dan 5 tema pembangunan bakat. Ia menentukan hala tuju; DDA dan data agensi menentukan lokasi dan skala jurang.',
      'STI Foresight 2025–2040 identifies 10 STEM skill fields and 5 talent development themes. It sets direction; DDA and agency data locate and size the gaps.',
      lang
    ),
    bullets: [
      t('Bidang: ' + FORESIGHT_FIELDS.map((f) => f.ms).join(' · '), 'Fields: ' + FORESIGHT_FIELDS.map((f) => f.en).join(' · '), lang),
      t('Tema: ' + FORESIGHT_THEMES.map((th) => th.ms).join(' · '), 'Themes: ' + FORESIGHT_THEMES.map((th) => th.en).join(' · '), lang),
    ],
    citation: {
      source: 'STI Foresight Report 2025–2040',
      owner: 'MOSTI · MIGHT · MASTIC',
      period: '2025–2040',
    },
    link: { label: t('Buka Foresight Kemahiran', 'Open Skills Foresight', lang), to: '/foresight' },
  }
}

function catalogAnswer(lang: Lang): AskAnswer {
  return {
    intent: 'catalog',
    text: t(
      'Platform ini menghubungkan sumber daripada pelbagai agensi. Status: data dalam platform, pautan luaran, dokumen diindeks atau dirancang.',
      'The platform connects sources from multiple agencies. Status: data in platform, external link, indexed document or planned.',
      lang
    ),
    table: {
      headers: [t('Modul', 'Module', lang), t('Pemilik', 'Owner', lang), t('Status', 'Status', lang)],
      rows: catalogModules.map((m) => [
        m.module,
        m.owner,
        m.status === 'ingested'
          ? t('Data', 'Data', lang)
          : m.status === 'linked'
            ? t('Pautan', 'Linked', lang)
            : m.status === 'document'
              ? t('Dokumen', 'Document', lang)
              : t('Dirancang', 'Planned', lang),
      ]),
    },
    citation: CATALOG_CITE,
    link: { label: t('Buka Sumber Data', 'Open Data Sources', lang), to: '/data-sources' },
  }
}

function aiTalentAnswer(lang: Lang): AskAnswer {
  return {
    intent: 'ai_talent',
    text: t(
      'Cadangan lanjutan: 30,000 graduan AI disasar 2025–2030 (KPT) berbanding anggaran ±100 syarikat startup AI. Permintaan sebenar perlu diukur merentas semua industri (kekosongan, sektor, kemahiran) melalui taskforce MASTIC–PERKESO.',
      'Proposed next step: 30,000 AI graduates targeted 2025–2030 (KPT) versus an estimated ±100 AI startups. Real demand must be measured across all industries (vacancies, sectors, skills) via the MASTIC–PERKESO taskforce.',
      lang
    ),
    bullets: [
      t('Tiga dimensi: berapa banyak permintaan, sektor mana, kemahiran apa.', 'Three dimensions: how much demand, which sectors, which skills.', lang),
      t('Belum ada dataset permintaan AI dalam platform ini.', 'No AI demand dataset exists in this platform yet.', lang),
    ],
    citation: {
      source: 'Kertas Pertimbangan JK Teknikal Bakat STI Negara',
      owner: 'MASTIC · MOSTI',
      period: 'Oktober 2026',
    },
    link: { label: t('Buka Foresight', 'Open Foresight', lang), to: '/foresight' },
  }
}

export function answerQuestion(q: string, lang: Lang): AskAnswer {
  const n = normalize(q)

  const subject = findSubject(q)
  const occupation = findOccupation(q)

  if (/\b(hi|hello|hai|salam|help|bantuan|apa yang boleh)\b/.test(n)) {
    return {
      intent: 'help',
      text: t(
        'Saya menjawab daripada data berstruktur platform: Prestasi SPM, SKPG (ketidaksepadanan), DDA E&E (supply/demand, senario, gap closure), BEM/MBOT, Foresight dan katalog sumber. Cuba salah satu soalan contoh.',
        'I answer from the platform structured data: SPM Performance, SKPG (mismatch), E&E DDA (supply/demand, scenarios, gap closure), BEM/MBOT, Foresight and the source catalog. Try one of the suggested questions.',
        lang
      ),
      citation: CATALOG_CITE,
      suggestions: DEFAULT_SUGGESTIONS,
    }
  }

  if (/subjek|mata pelajaran|subject/.test(n) && /(baik|improve|meningkat|turun|berubah)/.test(n)) {
    return topImprovers(lang)
  }
  if (subject) return subjectAnswer(subject, lang)
  if (/bandar|luar bandar|lokaliti|locality|urban|rural/.test(n)) {
    const c = coreFacts['2025']
    return {
      intent: 'locality',
      text: t(
        `Jurang bandar–luar bandar 2025 ialah ${fmt2(c.gap)}: bandar ${fmt2(localityValues[2025].bandar)} vs luar bandar ${fmt2(localityValues[2025].luarBandar)}.`,
        `The 2025 urban–rural gap is ${fmt2(c.gap)}: urban ${fmt2(localityValues[2025].bandar)} vs rural ${fmt2(localityValues[2025].luarBandar)}.`,
        lang
      ),
      bullets: [
        t(
          `2024: bandar ${fmt2(localityValues[2024].bandar)} · luar bandar ${fmt2(localityValues[2024].luarBandar)} · jurang ${fmt2(localityValues[2024].gap)}.`,
          `2024: urban ${fmt2(localityValues[2024].bandar)} · rural ${fmt2(localityValues[2024].luarBandar)} · gap ${fmt2(localityValues[2024].gap)}.`,
          lang
        ),
      ],
      citation: SPM_CITE,
      link: { label: t('Buka Prestasi SPM', 'Open SPM Performance', lang), to: '/analytics/spm' },
    }
  }
  if (/defisit|lebihan|kekurangan|surplus|2040|pekerjaan|occupation/.test(n)) {
    if (occupation) return occupationAnswer(occupation, lang)
    return deficitAnswer(lang)
  }
  if (/mismatch|ketidaksepadanan|tvet|ipt|graduan/.test(n)) {
    if (/negeri|state/.test(n)) return dimensionAnswer(lang, 'negeri')
    if (/kursus|course/.test(n)) return dimensionAnswer(lang, 'kursus')
    if (/pendapatan|income|gaji|salary/.test(n)) return dimensionAnswer(lang, 'income')
    if (/institusi|institution/.test(n)) return dimensionAnswer(lang, 'institusi')
    return mismatchAnswer(lang, q)
  }
  if (/pemacu|drivers|korelasi|correlation|pelaburan|investment/.test(n) && !/senario|scenario/.test(n)) {
    return driversAnswer(lang)
  }
  if (/senario|scenario|what-if|simulasi/.test(n)) return scenarioAnswer(lang, q)
  if (/seimbang|balance|gap closure|berapa.*(perlu|diperlukan)|intervensi/.test(n)) return gapClosureAnswer(lang)
  if (/foresight|kemahiran masa hadapan|future skill/.test(n)) return foresightAnswer(lang)
  if (/bem|mbot|profesional|professional|jurutera|technologist/.test(n)) return professionalAnswer(lang)
  if (/ai|kecerdasan buatan|artificial intelligence/.test(n)) return aiTalentAnswer(lang)
  if (/sumber|source|katalog|catalog|pemilik|owner/.test(n)) return catalogAnswer(lang)
  if (/spm|gpk|gred purata|pensijilan|sijil|certificate|calon/.test(n)) return spmNational(lang)

  return {
    intent: 'fallback',
    text: t(
      'Saya tidak menemui padanan yang jelas dalam data berstruktur platform. Cuba soalan tentang subjek SPM, pekerjaan MASCO, ketidaksepadanan TVET/IPT, pemacu permintaan, senario atau gap closure.',
      'I could not find a clear match in the platform structured data. Try questions about SPM subjects, MASCO occupations, TVET/IPT mismatch, demand drivers, scenarios or gap closure.',
      lang
    ),
    citation: CATALOG_CITE,
    suggestions: DEFAULT_SUGGESTIONS,
  }
}
