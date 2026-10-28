export type SourceStatus = 'ingested' | 'linked' | 'planned' | 'document'

export interface CatalogModule {
  id: string
  module: string
  owner: string
  period: string
  status: SourceStatus
  coverage: string
  limitations: string
}

export const STATUS_LABELS: Record<SourceStatus, string> = {
  ingested: 'Data dalam platform',
  linked: 'Pautan luaran',
  planned: 'Dirancang',
  document: 'Dokumen diindeks',
}

export const catalogModules: CatalogModule[] = [
  {
    id: 'i360',
    module: 'Capaian Program STEM (i-360)',
    owner: 'STI360 · KPM',
    period: 'Semasa',
    status: 'linked',
    coverage: 'Penyertaan dan liputan program, pelaksanaan, agensi peneraju, geografi',
    limitations:
      'Belum menunjukkan outcome pendidikan atau kerjaya peserta melainkan terdapat pautan data disahkan pada peringkat individu.',
  },
  {
    id: 'impak',
    module: 'Minat & Aspirasi STEM (Kajian Impak)',
    owner: 'MASTIC',
    period: 'Kajian Impak Program STEM',
    status: 'linked',
    coverage:
      '16,471 responden · minat, pengetahuan, sikap, aspirasi kerjaya (skor aspirasi 81.0%)',
    limitations:
      'Korelasi (cth. r = 0.79 program evaluation) menunjukkan perkaitan, bukan bukti sebab-akibat.',
  },
  {
    id: 'spm',
    module: 'Prestasi SPM',
    owner: 'Lembaga Peperiksaan, KPM',
    period: '2018–2025',
    status: 'ingested',
    coverage:
      '95 mata pelajaran · GPMP, calon menduduki, kepujian/gagal · agregat nasional GPK, pensijilan, lokaliti',
    limitations:
      'Bilangan outcome ialah anggaran daripada peratusan dibundarkan; “calon menduduki” bukan enrolmen; 2021 perubahan konteks KSSM.',
  },
  {
    id: 'skpg',
    module: 'Graduan & Pasaran Kerja (SKPG)',
    owner: 'KPT',
    period: '2018–2024',
    status: 'ingested',
    coverage:
      '228,680 rekod graduan E&E dan berkaitan (NEC) · 149,384 asas analisis · ketidaksepadanan menegak/mendatar',
    limitations:
      'Klasifikasi berasaskan jawapan responden dan tidak disahkan dengan rekod majikan. Dashboard penuh SKPG ialah pautan luaran.',
  },
  {
    id: 'bem-mbot',
    module: 'Bakat Profesional (BEM · MBOT)',
    owner: 'BEM · MBOT',
    period: '2020–2024 (prototaip)',
    status: 'planned',
    coverage: 'Trend pendaftaran mengikut jenis (Graduate/Professional Engineer, Technologist) dan bidang',
    limitations:
      'Angka sedia ada adalah ilustratif sehingga dataset rasmi BEM/MBOT dimuatkan.',
  },
  {
    id: 'dda',
    module: 'Permintaan & Penawaran Bakat E&E (DDA)',
    owner: 'MASTIC · MOSTI',
    period: '2015–2040',
    status: 'ingested',
    coverage:
      '10 kod MASCO · sejarah 2015–2025, ramalan 2026–2040 · 6 faktor makro (PCA) · senario & gap closure',
    limitations:
      'Horizon 15 tahun lebih panjang daripada sejarah 11 tahun; R² exog rendah bagi kebanyakan pekerjaan; senario ialah what-if, bukan kausal.',
  },
  {
    id: 'foresight',
    module: 'Foresight Kemahiran',
    owner: 'MOSTI · MIGHT · MASTIC',
    period: '2025–2040',
    status: 'document',
    coverage:
      '10 bidang kemahiran STEM · 5 tema pembangunan bakat · laporan Delphi (STI Foresight Report)',
    limitations:
      'Dokumen diindeks untuk rujukan; tiada dataset padanan kemahiran berstruktur dalam POC ini.',
  },
  {
    id: 'catalog',
    module: 'Sumber Data & Metadata',
    owner: 'MASTIC',
    period: 'Semasa',
    status: 'ingested',
    coverage: 'Katalog dokumen, definisi indikator, provenance dan had data',
    limitations:
      'Belum ada pautan pada peringkat rekod individu merentas sistem agensi.',
  },
]

export const agencies = [
  { agency: 'MOSTI · MASTIC', role: 'Peneraju bersama, analitik dan urus setia' },
  { agency: 'KPT', role: 'Peneraju bersama, data penawaran dan program' },
  { agency: 'KESUMA · PERKESO', role: 'MYFutureJobs dan kerjasama analitik' },
  { agency: 'KPM', role: 'Aliran STEM, pencapaian dan pembudayaan' },
  { agency: 'KESUMA · TalentCorp · ILMIA', role: 'MyCOL, pasaran buruh dan latihan semula' },
  { agency: 'DOSM', role: 'Survei Tenaga Buruh, MASCO dan MSIC' },
  { agency: 'MITI · MIDA', role: 'Pelaburan dan pekerjaan mahir' },
]

export interface IndicatorDef {
  code: string
  label: string
  definition: string
  source: string
}

export const indicators: IndicatorDef[] = [
  {
    code: 'vp',
    label: 'Ketidaksepadanan menegak',
    definition: 'Tahap kemahiran pekerjaan tidak selaras dengan tahap kelayakan graduan (%)',
    source: 'SKPG 2018–2024',
  },
  {
    code: 'hp',
    label: 'Ketidaksepadanan mendatar',
    definition: 'Bidang pekerjaan tidak selaras dengan bidang pengajian graduan (%)',
    source: 'SKPG 2018–2024',
  },
  {
    code: 'dp',
    label: 'Kedua-dua (menegak × mendatar)',
    definition: 'Graduan tidak sepadan dari segi bidang dan tahap secara serentak (%)',
    source: 'SKPG 2018–2024',
  },
  {
    code: 'ap',
    label: 'Mana-mana ketidaksepadanan',
    definition: 'Sekurang-kurangnya satu bentuk ketidaksepadanan (menegak atau mendatar) (%)',
    source: 'SKPG 2018–2024',
  },
  {
    code: 'gap',
    label: 'Jurang supply–demand',
    definition: 'Demand − Supply; positif = defisit bekalan, negatif = lebihan bekalan',
    source: 'DDA E&E',
  },
  {
    code: 'ds',
    label: 'Nisbah D/S',
    definition: 'Demand ÷ Supply bagi tahun dan pekerjaan terpilih',
    source: 'DDA E&E',
  },
  {
    code: 'gpmp',
    label: 'GPMP / GPK',
    definition: 'Gred purata mata pelajaran / kebangsaan; lebih rendah = pencapaian lebih baik',
    source: 'Laporan SPM 2018–2025',
  },
  {
    code: 'r2',
    label: 'R² exogenous',
    definition:
      'Bahagian varians sejarah yang diterangkan oleh indeks makro sahaja; bukan ketepatan out-of-sample',
    source: 'DDA E&E',
  },
  {
    code: 'ci',
    label: 'Selang keyakinan ~80%',
    definition: 'Lebar ketidakpastian ramalan pada tahun tertentu, relatif kepada ramalan titik',
    source: 'DDA E&E',
  },
  {
    code: 'scenario',
    label: 'Δ senario',
    definition:
      'Perubahan supply/demand hasil perubahan faktor makro melalui indeks PCA dan pekali exogenous; what-if, bukan kausal',
    source: 'DDA E&E',
  },
]
