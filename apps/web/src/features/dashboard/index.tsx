import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  ChartLine,
  Database,
  GraduationCap,
  Lightbulb,
  ScanSearch,
  Target,
  Users,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/stat-card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { getDataset } from '@/lib/engine/mismatch'
import { aggSeries, indexOfYear, occupationRows } from '@/lib/engine/masco'
import { coreFacts } from '@/features/spm/lib/spm'
import { fmt, fmt1, fmt2, fmt2Signed } from '@/lib/engine/format'
import { cn } from '@/lib/utils'

const STAGES = [
  {
    key: 'foresight',
    title: 'Foresight',
    desc: 'Hala tuju masa hadapan',
    detail: 'STI Foresight 2025–2040 · 10 bidang kemahiran · 5 tema bakat',
    icon: Lightbulb,
    to: '/data-sources' as const,
  },
  {
    key: 'evidence',
    title: 'Evidence',
    desc: 'Lokasi dan bentuk jurang',
    detail: 'SPM · SKPG · i-360 · Kajian Impak · BEM/MBOT',
    icon: ScanSearch,
    to: '/analytics/spm' as const,
  },
  {
    key: 'diagnosis',
    title: 'Diagnosis',
    desc: 'Bukti dihubungkan',
    detail: 'Ketidaksepadanan graduan · jurang supply–demand',
    icon: ChartLine,
    to: '/analytics/mismatch' as const,
  },
  {
    key: 'decision',
    title: 'Decision',
    desc: 'Simulasi & pilihan dasar',
    detail: 'Senario makro · gap closure · intervensi',
    icon: Target,
    to: '/simulator/scenario' as const,
  },
  {
    key: 'action',
    title: 'Action',
    desc: 'Tindakan bersama',
    detail: 'Kertas MPN Bil. 2/2026 · 7 agensi · Nov 2026',
    icon: BadgeCheck,
    to: '/data-sources' as const,
  },
]

const CHAIN = [
  {
    title: 'Kesedaran STI',
    question: 'Adakah murid tahu bidang ini wujud?',
    module: 'Capaian Program STEM (i-360)',
    status: 'Pautan luaran',
    tone: 'linked' as const,
  },
  {
    title: 'Minat',
    question: 'Adakah mereka mahu menyertainya?',
    module: 'Minat & Aspirasi STEM (Kajian Impak)',
    status: 'Pautan luaran',
    tone: 'linked' as const,
  },
  {
    title: 'Kompetensi Asas',
    question: 'Adakah mereka mampu?',
    module: 'Prestasi SPM',
    status: 'Data dalam platform',
    tone: 'data' as const,
    to: '/analytics/spm' as const,
  },
  {
    title: 'Aspirasi Kerjaya',
    question: 'Adakah mereka nampak masa depan?',
    module: 'Minat & Aspirasi · Foresight',
    status: 'Pautan / dokumen',
    tone: 'linked' as const,
  },
  {
    title: 'Graduan',
    question: 'Adakah bidang & tahap sepadan?',
    module: 'Graduan & Pasaran Kerja (SKPG)',
    status: 'Data dalam platform',
    tone: 'data' as const,
    to: '/analytics/mismatch' as const,
  },
  {
    title: 'Profesional',
    question: 'Adakah bekalan menepati permintaan?',
    module: 'BEM/MBOT · Supply & Demand E&E',
    status: 'Sebahagian data',
    tone: 'partial' as const,
    to: '/analytics/supply-demand' as const,
  },
]

const MODULES = [
  {
    n: '01',
    title: 'Capaian Program STEM',
    detail: 'Penyertaan & liputan program · i-360',
    status: 'Pautan luaran',
    tone: 'linked' as const,
    to: '/data-sources' as const,
    icon: Users,
  },
  {
    n: '02',
    title: 'Minat & Aspirasi STEM',
    detail: 'Kajian Impak · 16,471 responden',
    status: 'Pautan luaran',
    tone: 'linked' as const,
    to: '/data-sources' as const,
    icon: Lightbulb,
  },
  {
    n: '03',
    title: 'Prestasi SPM',
    detail: '95 mata pelajaran · 2018–2025',
    status: 'Data',
    tone: 'data' as const,
    to: '/analytics/spm' as const,
    icon: GraduationCap,
  },
  {
    n: '04',
    title: 'Graduan & Pasaran Kerja',
    detail: 'SKPG · 228,680 rekod · 2018–2024',
    status: 'Data',
    tone: 'data' as const,
    to: '/analytics/mismatch' as const,
    icon: Users,
  },
  {
    n: '05',
    title: 'Bakat Profesional',
    detail: 'BEM · MBOT · pendaftaran',
    status: 'Dirancang',
    tone: 'planned' as const,
    to: '/data-sources' as const,
    icon: BadgeCheck,
  },
  {
    n: '06',
    title: 'Permintaan & Penawaran E&E',
    detail: 'DDA · 10 MASCO · 2015–2040',
    status: 'Data',
    tone: 'data' as const,
    to: '/analytics/supply-demand' as const,
    icon: ChartLine,
  },
  {
    n: '07',
    title: 'Foresight Kemahiran',
    detail: 'STI Foresight 2025–2040',
    status: 'Dokumen',
    tone: 'document' as const,
    to: '/data-sources' as const,
    icon: BookOpenCheck,
  },
  {
    n: '08',
    title: 'Sumber Data',
    detail: 'Katalog · metadata · provenance',
    status: 'Data',
    tone: 'data' as const,
    to: '/data-sources' as const,
    icon: Database,
  },
]

const TONE_STYLES: Record<string, string> = {
  data: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  linked: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
  planned: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300',
  partial: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
  document: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
}

export function Dashboard() {
  const ds = getDataset('overall', 'all')
  const s40 = aggSeries('s')[indexOfYear(2040)] ?? 0
  const d40 = aggSeries('d')[indexOfYear(2040)] ?? 0
  const gap = d40 - s40
  const rows = occupationRows(2040)
  const deficit = rows.filter((r) => r.gap > 0)
  const surplus = rows.filter((r) => r.gap < 0)
  const spm = coreFacts['2025']
  const spmPrev = coreFacts['2024']

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-5'>
        <div className='space-y-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='text-2xl font-bold tracking-tight'>MASTIC Intelligence</h1>
            <Badge variant='outline'>Observatori Data &amp; Analitik Bakat STEM</Badge>
          </div>
          <p className='text-muted-foreground'>
            Daripada intervensi STEM kepada keperluan bakat masa hadapan — menghubungkan data dan
            analitik sepanjang rantaian bakat STEM untuk perancangan dan tindakan yang lebih
            bersasar.
          </p>
          <div className='flex flex-wrap gap-2 text-xs'>
            <Badge variant='secondary'>Fasa: konsolidasi analitik</Badge>
            <Badge variant='secondary'>Prototaip sokongan keputusan</Badge>
            <Badge variant='outline'>
              Dataset belum dihubungkan pada peringkat rekod individu
            </Badge>
          </div>
        </div>

        <div className='grid gap-3 md:grid-cols-5'>
          {STAGES.map((s, i) => (
            <Link
              key={s.key}
              to={s.to}
              className='group relative rounded-lg border p-4 transition-colors hover:bg-muted/50'
            >
              <div className='flex items-center justify-between'>
                <s.icon className='size-5 text-muted-foreground' />
                <span className='font-mono text-[10px] text-muted-foreground'>0{i + 1}</span>
              </div>
              <p className='mt-2 font-semibold'>{s.title}</p>
              <p className='text-xs text-muted-foreground'>{s.desc}</p>
              <p className='mt-2 text-[11px] leading-snug text-muted-foreground'>{s.detail}</p>
              <ArrowRight className='absolute bottom-3 right-3 size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100' />
            </Link>
          ))}
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            title='GPK SPM 2025'
            value={fmt2(spm.average)}
            sub={`${fmt2Signed(spm.average - spmPrev.average)} berbanding 2024 · lebih rendah = lebih baik`}
            good={spm.average < spmPrev.average}
            icon={<GraduationCap />}
          />
          <StatCard
            title='Ketidaksepadanan Graduan E&E'
            value={`${fmt1(ds.ap)}%`}
            sub={`Menegak ${fmt1(ds.vp)}% · Mendatar ${fmt1(ds.hp)}% · ${fmt(ds.n)} dinilai`}
            danger
            icon={<Users />}
          />
          <StatCard
            title='Jurang Bakat E&E 2040'
            value={fmt(gap)}
            sub={`${deficit.length} berpotensi defisit · ${surplus.length} berpotensi lebihan`}
            good={gap < 0}
            icon={<ChartLine />}
          />
          <StatCard
            title='Calon SPM 2025'
            value={fmt(spm.registered)}
            sub={`Pensijilan ${fmt1(spm.cert)}% · jurang bandar–luar bandar ${fmt2(spm.gap)}`}
            icon={<Users />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Rantaian Bakat STEM Negara</CardTitle>
            <CardDescription>
              Cabaran bakat STEM bermula sebelum graduasi — kegagalan pada peringkat awal muncul
              semula sebagai ketidaksepadanan pada peringkat graduan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3 md:grid-cols-3 xl:grid-cols-6'>
              {CHAIN.map((c, i) => {
                const inner = (
                  <>
                    <div className='flex items-center justify-between'>
                      <span className='font-mono text-[10px] text-muted-foreground'>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.5 text-[9px] font-medium',
                          TONE_STYLES[c.tone]
                        )}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className='mt-2 text-sm font-semibold leading-tight'>{c.title}</p>
                    <p className='mt-1 text-[11px] italic leading-snug text-muted-foreground'>
                      {c.question}
                    </p>
                    <p className='mt-2 text-[11px] leading-snug'>{c.module}</p>
                  </>
                )
                return c.to ? (
                  <Link
                    key={c.title}
                    to={c.to}
                    className='rounded-lg border p-3 transition-colors hover:bg-muted/50'
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={c.title} className='rounded-lg border p-3'>
                    {inner}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div>
          <div className='mb-3 flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-lg font-semibold tracking-tight'>Modul Analitik</h2>
              <p className='text-sm text-muted-foreground'>
                Lapan modul merentas rantaian bakat — status menunjukkan kesediaan data
              </p>
            </div>
            <Button asChild size='sm' variant='outline'>
              <Link to='/data-sources'>
                Katalog sumber <ArrowRight className='size-4' />
              </Link>
            </Button>
          </div>
          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
            {MODULES.map((m) => (
              <Link
                key={m.n}
                to={m.to}
                className='group rounded-lg border p-4 transition-colors hover:bg-muted/50'
              >
                <div className='flex items-center justify-between'>
                  <m.icon className='size-5 text-muted-foreground' />
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-medium',
                      TONE_STYLES[m.tone]
                    )}
                  >
                    {m.status}
                  </span>
                </div>
                <p className='mt-3 text-sm font-semibold'>
                  <span className='font-mono text-xs text-muted-foreground'>{m.n}</span>{' '}
                  {m.title}
                </p>
                <p className='text-xs text-muted-foreground'>{m.detail}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className='grid gap-4 lg:grid-cols-2'>
          <Card>
            <CardHeader className='flex-row items-center justify-between space-y-0'>
              <div>
                <CardTitle className='text-base'>Isyarat Utama E&amp;E 2040</CardTitle>
                <CardDescription>
                  Lebihan agregat tidak bermaksud tiada kekurangan bakat
                </CardDescription>
              </div>
              <Button asChild size='sm' variant='outline'>
                <Link to='/simulator/interventions'>
                  Intervensi <ArrowRight className='size-4' />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className='space-y-2'>
              {rows.slice(0, 5).map((r) => (
                <div key={r.kod} className='flex items-center justify-between gap-2 text-xs'>
                  <span className='truncate'>
                    <span className='font-mono text-muted-foreground'>{r.kod}</span> {r.name}
                  </span>
                  <span
                    className={cn(
                      'tabular-nums',
                      r.gap > 0
                        ? 'font-semibold text-red-600 dark:text-red-400'
                        : 'font-semibold text-emerald-600 dark:text-emerald-400'
                    )}
                  >
                    {fmt(r.gap)}
                  </span>
                </div>
              ))}
              <p className='pt-1 text-[11px] text-muted-foreground'>
                Defisit tertumpu pada pekerjaan profesional berkemahiran tinggi; lebihan pada
                pekerjaan teknikal peringkat diploma dan TVET.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Dapatan Utama DDA E&amp;E</CardTitle>
              <CardDescription>Signal untuk intervensi, bukan keputusan automatik</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              {[
                ['50.6% graduan E&E mengalami ketidaksepadanan', 'SKPG 2018–2024 · 149,384 graduan dinilai'],
                ['~62,000 lebihan penawaran menjelang 2040', '5 pekerjaan defisit · 5 lebihan'],
                ['Pelaburan ≠ permintaan bakat', 'r = 0.301 pelaburan vs 0.671 pertumbuhan teknologi'],
                ['Setiap jenis jurang perlukan respons berbeza', 'Perancangan bakat · penjajaran pendidikan–pekerjaan · tadbir urus data'],
              ].map(([t, d]) => (
                <div key={t} className='rounded-md border p-3'>
                  <p className='font-medium leading-tight'>{t}</p>
                  <p className='text-xs text-muted-foreground'>{d}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
