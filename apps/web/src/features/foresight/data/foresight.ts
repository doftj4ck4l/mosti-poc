export const FORESIGHT_FIELDS = [
  {
    ms: 'Kecerdasan Buatan & Teknologi Data',
    en: 'Artificial Intelligence & Data Technologies',
    cluster: 'digital',
  },
  {
    ms: 'Sistem Pintar & Transformasi Digital',
    en: 'Smart Systems & Digital Transformation',
    cluster: 'digital',
  },
  {
    ms: 'Keselamatan Digital & Pertahanan Siber',
    en: 'Digital Security & Cyber Defence',
    cluster: 'digital',
  },
  {
    ms: 'Alam Sekitar & Kelestarian',
    en: 'Environmental & Sustainability',
    cluster: 'green',
  },
  {
    ms: 'Tenaga & Infrastruktur Kejuruteraan',
    en: 'Energy & Engineering Infrastructure',
    cluster: 'engineering',
  },
  {
    ms: 'Sains Pengiraan & Fizikal',
    en: 'Computational & Physical Sciences',
    cluster: 'science',
  },
  {
    ms: 'Perancangan Strategik & Pengurusan Risiko',
    en: 'Strategic Planning & Risk Management',
    cluster: 'management',
  },
  {
    ms: 'Sains Kesihatan & Bioperubatan',
    en: 'Healthcare & Biomedical Sciences',
    cluster: 'health',
  },
  {
    ms: 'Sains Bahan & Pembuatan Termaju',
    en: 'Materials Science & Advanced Manufacturing',
    cluster: 'engineering',
  },
  {
    ms: 'Keselamatan Makanan & Sistem Pertanian',
    en: 'Food Security & Agricultural Systems',
    cluster: 'agri',
  },
] as const

export const FORESIGHT_THEMES = [
  {
    no: 1,
    ms: 'Tarikan & Motivasi',
    en: 'Attraction & Motivation',
    question: 'Adakah murid tahu bidang ini wujud dan mahu menyertainya?',
  },
  {
    no: 2,
    ms: 'Persediaan',
    en: 'Preparation',
    question: 'Adakah mereka mampu dari segi kompetensi asas?',
  },
  {
    no: 3,
    ms: 'Penempatan',
    en: 'Placement',
    question: 'Adakah bidang dan tahap pekerjaan sepadan?',
  },
  {
    no: 4,
    ms: 'Pertumbuhan & Retensi',
    en: 'Growth & Retention',
    question: 'Adakah bakat kekal dan berkembang dalam sistem?',
  },
  {
    no: 5,
    ms: 'Kepimpinan',
    en: 'Leadership',
    question: 'Adakah laluan kepimpinan STI tersedia?',
  },
] as const

export interface DeficitOccupationLink {
  kod: string
  occupation: string
  fields: string[]
  rationale: string
}

export const DEFICIT_LINKS: DeficitOccupationLink[] = [
  {
    kod: '2151',
    occupation: 'Jurutera Elektrik',
    fields: ['Tenaga & Infrastruktur Kejuruteraan', 'Sistem Pintar & Transformasi Digital'],
    rationale:
      'Defisit +18,518 menjelang 2040; keperluan grid, elektrifikasi dan sistem tenaga pintar.',
  },
  {
    kod: '2152',
    occupation: 'Jurutera Elektronik',
    fields: ['Sistem Pintar & Transformasi Digital', 'Sains Bahan & Pembuatan Termaju'],
    rationale:
      'Defisit +5,564; semikonduktor, elektronik termaju dan pembuatan bernilai tinggi.',
  },
  {
    kod: '1223',
    occupation: 'Pengurus R&D',
    fields: ['Kecerdasan Buatan & Teknologi Data', 'Perancangan Strategik & Pengurusan Risiko'],
    rationale: 'Defisit +3,416; R&D berasaskan data dan pengurusan inovasi.',
  },
  {
    kod: '1321',
    occupation: 'Pengurus Pembuatan',
    fields: ['Sains Bahan & Pembuatan Termaju', 'Perancangan Strategik & Pengurusan Risiko'],
    rationale: 'Defisit +2,573; pembuatan pintar dan pengurusan rantaian bekalan.',
  },
  {
    kod: '7421',
    occupation: 'Mekanik Elektronik & Perkhidmatan',
    fields: ['Tenaga & Infrastruktur Kejuruteraan', 'Sistem Pintar & Transformasi Digital'],
    rationale: 'Defisit +24,077; penyelenggaraan peralatan elektronik dan automasi.',
  },
]

export const FORESIGHT_SIGNALS = [
  {
    title: 'Lebihan agregat ≠ tiada kekurangan bakat',
    detail:
      '5 pekerjaan berpotensi defisit (profesional berkemahiran tinggi) dan 5 berpotensi lebihan (teknikal diploma/TVET) pada 2040.',
  },
  {
    title: '50.6% graduan E&E mengalami ketidaksepadanan',
    detail:
      '49.4% sepadan · 13.7% tahap sahaja · 19.3% bidang sahaja · 17.6% kedua-duanya (SKPG 2018–2024).',
  },
  {
    title: 'Pelaburan tidak semestinya menjamin permintaan bakat',
    detail:
      'r = 0.671 pertumbuhan teknologi · 0.607 aktiviti ekonomi · 0.301 nilai pelaburan. Korelasi bukan sebab-akibat.',
  },
  {
    title: 'Analisis lanjutan: bakat AI',
    detail:
      '30,000 graduan AI disasar 2025–2030 (KPT) berbanding ±100 syarikat startup AI; permintaan perlu diukur merentas semua industri.',
  },
]

export const FORESIGHT_CITATIONS = [
  {
    title: 'STI Foresight Report 2025–2040: Future of STEM Talent in Malaysia, A Delphi Approach',
    owner: 'MOSTI · MIGHT · MASTIC',
    period: '2025–2040',
  },
  {
    title: 'Kertas Pertimbangan JK Teknikal Bakat STI Negara — Daripada Foresight kepada Tindakan',
    owner: 'MASTIC · MOSTI',
    period: 'Oktober 2026',
  },
]

export const IMPAK = {
  respondents: 16471,
  aspirationScore: 81.0,
  topCorrelation: { label: 'Program Evaluation', r: 0.79 },
  source: 'Kajian Impak Program STEM (MASTIC)',
  period: 'Kajian Impak',
  notes: [
    'Korelasi menunjukkan perkaitan, bukan bukti bahawa program menyebabkan perubahan aspirasi.',
    'Dapatan ini perlu dibaca dalam skop Kajian Impak sahaja.',
  ],
}

export const I360 = {
  questions: [
    {
      q: 'Capaian',
      detail:
        'Siapa dan berapa ramai yang dicapai? Gunakan penyertaan dan kategori penglibatan untuk melihat skala capaian program.',
    },
    {
      q: 'Pelaksanaan Program',
      detail:
        'Apa dan agensi mana? Jejak program utama, kategori program, agensi peneraju dan kaedah pelaksanaan.',
    },
    {
      q: 'Geografi',
      detail:
        'Di mana peserta dicapai? Lihat negeri/lokasi dan kawasan Parlimen untuk memahami taburan pelaksanaan.',
    },
  ],
  note: 'i-360 menerangkan capaian dan pelaksanaan program. Ia belum menunjukkan outcome pendidikan atau kerjaya peserta melainkan terdapat pautan data yang disahkan pada peringkat individu.',
  source: 'i-360 Tracker STI360',
}
