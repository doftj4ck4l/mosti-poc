import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataCaveats, PrintButton, Provenance } from '@/components/provenance'
import { ArrowRight, BookOpenCheck, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DEFICIT_LINKS,
  FORESIGHT_CITATIONS,
  FORESIGHT_FIELDS,
  FORESIGHT_SIGNALS,
  FORESIGHT_THEMES,
} from '@/features/foresight/data/foresight'
import { fmt } from '@/lib/engine/format'
import { occupationRows } from '@/lib/engine/masco'

const THEME_EVIDENCE = [
  { module: 'i-360 · Kajian Impak', to: '/analytics/impak', tone: 'linked' },
  { module: 'Prestasi SPM', to: '/analytics/spm', tone: 'data' },
  { module: 'E&E · Mismatch', to: '/analytics/eande/mismatch', tone: 'data' },
  { module: 'BEM · MBOT', to: '/analytics/professional', tone: 'partial' },
  { module: 'Gap Closure', to: '/simulator/interventions', tone: 'data' },
] as const

const TONE: Record<string, string> = {
  data: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  linked: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
  partial: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
}

const CLUSTER_LABELS: Record<string, string> = {
  digital: 'Digital',
  green: 'Kelestarian',
  engineering: 'Kejuruteraan',
  science: 'Sains',
  management: 'Pengurusan',
  health: 'Kesihatan',
  agri: 'Agri-makanan',
}

export function Foresight() {
  const deficitRows = occupationRows(2040).filter((r) => r.gap > 0)

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-2xl font-bold tracking-tight'>Foresight Kemahiran</h2>
              <Badge variant='outline'>STI Foresight 2025–2040</Badge>
              <Badge variant='secondary'>10 bidang · 5 tema</Badge>
            </div>
            <p className='text-muted-foreground'>
              Hala tuju keupayaan yang perlu dibangunkan menuju 2040 — dan di mana bukti
              kuantitatif (SPM, SKPG, DDA, BEM/MBOT) boleh mengesahkan jurang sebenar.
            </p>
          </div>
          <PrintButton />
        </div>

        <Provenance
          source='STI Foresight Report 2025–2040: Future of STEM Talent in Malaysia'
          owner='MOSTI · MIGHT · MASTIC'
          period='2025–2040'
          status='document'
        />

        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-5'>
          {FORESIGHT_THEMES.map((th) => (
            <Card key={th.no}>
              <CardHeader className='pb-2'>
                <CardTitle className='flex items-center gap-2 text-sm'>
                  <span className='font-mono text-xs text-muted-foreground'>
                    {String(th.no).padStart(2, '0')}
                  </span>
                  {th.ms}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-[11px] italic leading-snug text-muted-foreground'>
                  {th.question}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Matriks Bidang × Tema: Modul Bukti</CardTitle>
            <CardDescription>
              10 bidang kemahiran STEM × 5 tema pembangunan bakat · sel menunjukkan modul bukti
              yang berkaitan (pemetaan kerangka, bukan statistik)
            </CardDescription>
          </CardHeader>
          <CardContent className='overflow-x-auto'>
            <div className='min-w-[860px]'>
              <div
                className='grid items-stretch gap-1 text-[11px]'
                style={{ gridTemplateColumns: `minmax(240px,1.4fr) repeat(5, minmax(110px,1fr))` }}
              >
                <div className='px-2 py-1 font-medium text-muted-foreground'>Bidang kemahiran</div>
                {FORESIGHT_THEMES.map((th) => (
                  <div key={th.no} className='px-1 py-1 text-center font-medium text-muted-foreground'>
                    {th.ms}
                  </div>
                ))}
                {FORESIGHT_FIELDS.map((f) => (
                  <FieldRow key={f.ms} field={f.ms} cluster={f.cluster} />
                ))}
              </div>
            </div>
            <p className='mt-3 text-xs text-muted-foreground'>
              Setiap tema disokong oleh modul bukti berbeza: Tarikan → i-360/Kajian Impak ·
              Persediaan → Prestasi SPM · Penempatan → E&E Mismatch · Pertumbuhan → BEM/MBOT ·
              Kepimpinan → Gap Closure.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Foresight → E&amp;E: Pautan Interpretasi</CardTitle>
            <CardDescription>
              Pemetaan bidang kemahiran kepada 5 pekerjaan defisit 2040 — interpretasi analitik,
              bukan pemetaan rasmi
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
            {DEFICIT_LINKS.map((l) => {
              const row = deficitRows.find((r) => r.kod === l.kod)
              return (
                <div key={l.kod} className='rounded-lg border p-3'>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='text-sm font-semibold'>
                      <span className='font-mono text-xs text-muted-foreground'>{l.kod}</span>{' '}
                      {l.occupation}
                    </p>
                    <Badge variant='destructive' className='text-[10px]'>
                      {row ? fmt(row.gap) : '—'}
                    </Badge>
                  </div>
                  <div className='mt-2 flex flex-wrap gap-1'>
                    {l.fields.map((f) => (
                      <span
                        key={f}
                        className='rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground'
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <p className='mt-2 text-[11px] leading-snug text-muted-foreground'>
                    {l.rationale}
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className='grid gap-4 xl:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <Lightbulb className='size-4 text-muted-foreground' /> Isyarat DDA untuk Foresight
              </CardTitle>
              <CardDescription>Signal kuantitatif yang menyokong hala tuju foresight</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {FORESIGHT_SIGNALS.map((s) => (
                <div key={s.title} className='rounded-md border p-3'>
                  <p className='text-sm font-medium leading-tight'>{s.title}</p>
                  <p className='text-xs text-muted-foreground'>{s.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <BookOpenCheck className='size-4 text-muted-foreground' /> Rujukan
              </CardTitle>
              <CardDescription>Dokumen sumber yang diindeks dalam katalog</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {FORESIGHT_CITATIONS.map((c) => (
                <div key={c.title} className='rounded-md border p-3'>
                  <p className='text-sm font-medium leading-tight'>{c.title}</p>
                  <p className='text-xs text-muted-foreground'>
                    {c.owner} · {c.period}
                  </p>
                </div>
              ))}
              <Button asChild variant='outline' size='sm' className='mt-1'>
                <Link to='/data-sources'>
                  Lihat katalog sumber <ArrowRight className='size-4' />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <DataCaveats
          can={[
            'Menunjukkan hala tuju keupayaan dan tema pembangunan bakat 2025–2040.',
            'Menghubungkan bidang foresight kepada pekerjaan defisit dan modul bukti yang berkaitan.',
          ]}
          cannot={[
            'Memberi unjuran kuantitatif permintaan mengikut bidang kemahiran (belum ada dataset).',
            'Menggantikan pemetaan kemahiran rasmi atau penilaian kurikulum.',
            'Membuktikan hubungan sebab-akibat antara program dan aspirasi.',
          ]}
        />
      </Main>
    </>
  )
}

function FieldRow({ field, cluster }: { field: string; cluster: string }) {
  return (
    <>
      <div className='flex items-center justify-between gap-2 rounded-sm border px-2 py-1.5'>
        <span className='text-xs font-medium'>{field}</span>
        <span className='rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground'>
          {CLUSTER_LABELS[cluster] ?? cluster}
        </span>
      </div>
      {THEME_EVIDENCE.map((e) => (
        <Link
          key={e.module}
          to={e.to}
          className={cn(
            'flex items-center justify-center rounded-sm border px-1 py-1.5 text-center text-[9px] font-medium transition-opacity hover:opacity-80',
            TONE[e.tone]
          )}
        >
          {e.module}
        </Link>
      ))}
    </>
  )
}
