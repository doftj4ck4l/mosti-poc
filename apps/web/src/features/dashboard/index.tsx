import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  Percent,
  Target,
  TrendingDown,
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
import {
  aggSeries,
  classifyGap,
  indexOfYear,
  occupationRows,
} from '@/lib/engine/masco'
import { fmt, fmt1 } from '@/lib/engine/format'
import { SupplyDemandChart } from '@/features/supply-demand/components/supply-demand-chart'
import { cn } from '@/lib/utils'

export function Dashboard() {
  const ds = getDataset('overall', 'all')
  const s40 = aggSeries('s')[indexOfYear(2040)] ?? 0
  const d40 = aggSeries('d')[indexOfYear(2040)] ?? 0
  const gap = d40 - s40
  const rows = occupationRows(2040)
  const deficit = rows.filter((r) => r.gap > 0)
  const surplus = rows.filter((r) => r.gap < 0)
  const maxAbsGap = Math.max(...rows.map((r) => Math.abs(r.gap)), 1)

  const instTop = ds.by_institusi.slice(0, 4)
  const incomeTop = ds.by_income.slice(0, 4)
  const levelTop = ds.by_peringkat.slice(0, 4)

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      {/* ===== Main ===== */}
      <Main className='flex flex-1 flex-col gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            MASTIC Intelligence — Ringkasan Eksekutif
          </h1>
          <p className='text-muted-foreground'>
            Sektor E&amp;E dan berkaitan · SKPG 2018–2024 + unjuran MASCO 2015–2040 · Analisis
            MASTIC
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            title='Ketidaksepadanan Graduan'
            value={`${fmt1(ds.ap)}%`}
            sub={`Menegak ${fmt1(ds.vp)}% · Mendatar ${fmt1(ds.hp)}% · ${fmt(ds.n)} graduan dinilai`}
            icon={<Percent />}
            danger
          />
          <StatCard
            title='Supply Agregat 2040'
            value={fmt(s40)}
            sub='ramalan agregat 10 kod MASCO'
          />
          <StatCard
            title='Demand Agregat 2040'
            value={fmt(d40)}
            sub='ramalan agregat 10 kod MASCO'
          />
          <StatCard
            title='Jurang Bersih 2040'
            value={fmt(gap)}
            sub={classifyGap(gap)}
            good={gap < 0}
            danger={gap > 0}
            icon={<TrendingDown />}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <Card className='col-span-1 lg:col-span-4'>
            <CardHeader className='flex-row items-center justify-between space-y-0'>
              <div>
                <CardTitle>Unjuran Agregat Supply vs Demand</CardTitle>
                <CardDescription>2015–2040 · garis putus = permulaan ramalan 2026</CardDescription>
              </div>
              <Button asChild size='sm' variant='outline'>
                <Link to='/analytics/supply-demand' search={{ kod: 'AGG', from: 2015, to: 2040 }}>
                  Terokai <ArrowRight className='size-4' />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <SupplyDemandChart kod='AGG' from={2015} to={2040} />
            </CardContent>
          </Card>

          <Card className='col-span-1 lg:col-span-3'>
            <CardHeader className='flex-row items-center justify-between space-y-0'>
              <div>
                <CardTitle>Jurang Mengikut Pekerjaan 2040</CardTitle>
                <CardDescription>
                  {deficit.length} berpotensi defisit · {surplus.length} berpotensi lebihan
                </CardDescription>
              </div>
              <Button asChild size='sm' variant='outline'>
                <Link to='/simulator/interventions'>
                  Intervensi <ArrowRight className='size-4' />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className='space-y-2'>
              {rows.map((r) => (
                <div key={r.kod} className='space-y-1'>
                  <div className='flex items-center justify-between gap-2 text-xs'>
                    <span className='truncate font-medium'>
                      <span className='font-mono text-muted-foreground'>{r.kod}</span>{' '}
                      {r.name}
                    </span>
                    <span
                      className={cn(
                        'tabular-nums',
                        r.gap > 0 && 'font-semibold text-red-600 dark:text-red-400',
                        r.gap < 0 && 'font-semibold text-emerald-600 dark:text-emerald-400'
                      )}
                    >
                      {fmt(r.gap)}
                    </span>
                  </div>
                  <div className='flex h-2 overflow-hidden rounded-full bg-muted'>
                    <div
                      className={cn(
                        'h-full rounded-full',
                        r.gap > 0 ? 'bg-red-500' : 'bg-emerald-500'
                      )}
                      style={{ width: `${(Math.abs(r.gap) / maxAbsGap) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-4 lg:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <Users className='size-4 text-muted-foreground' /> Ketidaksepadanan Mengikut
                Institusi
              </CardTitle>
              <CardDescription>TVET vs IPT — jurang terbesar dalam sistem</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              {ds.by_institusi.slice(0, 6).map((c) => (
                <div key={c.label} className='flex items-center justify-between'>
                  <span className='truncate'>{c.label}</span>
                  <span className='font-medium tabular-nums'>{fmt1(c.ap)}%</span>
                </div>
              ))}
              <Button asChild size='sm' variant='ghost' className='mt-2 w-full'>
                <Link to='/analytics/mismatch' search={{ scope: 'overall', grp: 'all', measure: 'ap' }}>Lihat analisis penuh</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <CircleAlert className='size-4 text-muted-foreground' /> Isyarat Utama E&amp;E
              </CardTitle>
              <CardDescription>Dapatan analisis sektor daripada DDA</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3 text-sm'>
              <div className='rounded-md border p-3'>
                <p className='font-medium'>50.6% graduan mengalami ketidaksepadanan</p>
                <p className='text-xs text-muted-foreground'>
                  SKPG 2018–2024 · sekurang-kurangnya satu bentuk ketidaksepadanan
                </p>
              </div>
              <div className='rounded-md border p-3'>
                <p className='font-medium'>~62,000 lebihan penawaran menjelang 2040</p>
                <p className='text-xs text-muted-foreground'>
                  5 pekerjaan berpotensi defisit, 5 berpotensi lebihan
                </p>
              </div>
              <div className='rounded-md border p-3'>
                <p className='font-medium'>Jurutera Elektrik defisit +18,518</p>
                <p className='text-xs text-muted-foreground'>
                  manakala Juruteknik &amp; Penyelia Pembuatan lebihan ~77,000
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <Target className='size-4 text-muted-foreground' /> KPI Sasaran R&amp;D (TeD)
              </CardTitle>
              <CardDescription>Sasaran penyelidikan yang boleh diukur</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              {[
                ['Ketepatan ramalan +15% vs SARIMAX', 'ujian out-of-sample'],
                ['Pemadanan kemahiran ≥85%', 'pengesahan pakar domain'],
                ['≥3 senario dasar', 'enjin simulasi'],
                ['2 sektor perintis', 'E&E dan kejuruteraan'],
                ['≥1 hasil IP', 'Workforce Intelligence as a Service'],
              ].map(([t, d]) => (
                <div key={t} className='flex items-start gap-2'>
                  <BadgeCheck className='mt-0.5 size-4 text-emerald-600 dark:text-emerald-400' />
                  <div>
                    <p className='font-medium leading-tight'>{t}</p>
                    <p className='text-xs text-muted-foreground'>{d}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-4 lg:grid-cols-3'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Pendapatan Bulanan Terendah</CardTitle>
            </CardHeader>
            <CardContent className='space-y-1.5 text-sm'>
              {incomeTop.map((c) => (
                <div key={c.label} className='flex items-center justify-between'>
                  <span>{c.label}</span>
                  <span className='font-medium tabular-nums text-red-600 dark:text-red-400'>
                    {fmt1(c.ap)}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Peringkat Pengajian Tertinggi</CardTitle>
            </CardHeader>
            <CardContent className='space-y-1.5 text-sm'>
              {levelTop.map((c) => (
                <div key={c.label} className='flex items-center justify-between'>
                  <span>{c.label}</span>
                  <span className='font-medium tabular-nums'>{fmt1(c.ap)}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Kategori Institusi (Semua)</CardTitle>
            </CardHeader>
            <CardContent className='space-y-1.5 text-sm'>
              {instTop.map((c) => (
                <div key={c.label} className='flex items-center justify-between'>
                  <span className='truncate'>{c.label}</span>
                  <Badge variant='outline' className='tabular-nums'>
                    {fmt1(c.ap)}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
