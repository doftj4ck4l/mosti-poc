import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'
import { MascoSelect } from '@/components/masco-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Download, TrendingUp } from 'lucide-react'
import {
  DEMAND_COLOR,
  SUPPLY_COLOR,
  aggSeries,
  cagr,
  classifyGap,
  firstCrossover,
  indexOfYear,
  jobSeries,
} from '@/lib/engine/masco'
import { fmt, fmt1, pct } from '@/lib/engine/format'
import { SupplyDemandChart, GapChart, buildRows } from './components/supply-demand-chart'
import { TrendTable } from './components/trend-table'

const routeApi = getRouteApi('/_authenticated/analytics/supply-demand/')

function seriesFor(kod: string, type: 's' | 'd'): (number | null)[] {
  return kod === 'AGG' ? aggSeries(type) : jobSeries(kod, type)
}

export function SupplyDemand() {
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const summary = useMemo(() => {
    const s = seriesFor(search.kod, 's')
    const d = seriesFor(search.kod, 'd')
    const i40 = indexOfYear(2040)
    const i25 = indexOfYear(2025)
    const s40 = s[i40] ?? 0
    const d40 = d[i40] ?? 0
    const gap = d40 - s40
    return {
      s40,
      d40,
      gap,
      status: classifyGap(gap),
      ratio: s40 ? d40 / s40 : null,
      cagrS: cagr(s[i25] ?? 0, s40, 15),
      cagrD: cagr(d[i25] ?? 0, d40, 15),
    }
  }, [search.kod])

  const crossover = useMemo(() => {
    const s = seriesFor(search.kod, 's')
    const d = seriesFor(search.kod, 'd')
    const ys = Array.from({ length: 26 }, (_, i) => 2015 + i)
    return firstCrossover(s, d, ys, indexOfYear(2025))
  }, [search.kod])

  const isAgg = search.kod === 'AGG'

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
            <h2 className='text-2xl font-bold tracking-tight'>
              Papan Pemuka Supply &amp; Demand MASCO
            </h2>
            <p className='text-muted-foreground'>
              Analisis Pasaran Tenaga Kerja · Kod MASCO · 2015–2040 · Sejarah 2015–2025, Ramalan
              2026–2040
            </p>
          </div>
          <Button variant='outline' onClick={() => window.print()} className='print:hidden'>
            <Download className='size-4' /> Cetak / Simpan PDF
          </Button>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <MascoSelect
            value={search.kod}
            onChange={(v) => void navigate({ search: (prev) => ({ ...prev, kod: v }) })}
          />
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>Dari</span>
            <Select
              value={String(search.from)}
              onValueChange={(v) =>
                void navigate({ search: (prev) => ({ ...prev, from: Number(v) }) })
              }
            >
              <SelectTrigger className='w-[110px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 26 }, (_, i) => 2015 + i).map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>Hingga</span>
            <Select
              value={String(search.to)}
              onValueChange={(v) =>
                void navigate({ search: (prev) => ({ ...prev, to: Number(v) }) })
              }
            >
              <SelectTrigger className='w-[110px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 26 }, (_, i) => 2015 + i).map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            title='Supply 2040'
            value={fmt(summary.s40)}
            sub={`CAGR 2025–2040: ${pct(summary.cagrS)}`}
            icon={
              <span
                className='inline-block size-3 rounded-sm'
                style={{ backgroundColor: SUPPLY_COLOR }}
              />
            }
          />
          <StatCard
            title='Demand 2040'
            value={fmt(summary.d40)}
            sub={`CAGR 2025–2040: ${pct(summary.cagrD)}`}
            icon={
              <span
                className='inline-block size-3 rounded-sm'
                style={{ backgroundColor: DEMAND_COLOR }}
              />
            }
          />
          <StatCard
            title='Jurang Bersih 2040'
            value={fmt(summary.gap)}
            sub={summary.status}
            danger={summary.gap > 0}
            good={summary.gap < 0}
            icon={<TrendingUp />}
          />
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Nisbah D/S &amp; Persilangan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{summary.ratio ? fmt1(summary.ratio) : '—'}</div>
              <p className='text-xs text-muted-foreground'>
                {crossover
                  ? `Titik persilangan selepas ${crossover}`
                  : 'Tiada persilangan dalam tempoh ramalan'}
              </p>
              {!isAgg && (
                <Badge variant='outline' className='mt-2'>
                  MASCO {search.kod}
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-4 xl:grid-cols-2'>
          <SupplyDemandChart kod={search.kod} from={search.from} to={search.to} />
          <GapChart kod={search.kod} from={search.from} to={search.to} />
        </div>

        <TrendTable kod={search.kod} from={search.from} to={search.to} />

        <p className='text-xs text-muted-foreground'>
          Nota: nilai ramalan perlu dibaca bersama ketidakpastian model dan bukan dianggap sebagai
          angka deterministik. Sumber: Analisis MASTIC — model SARIMAX(1,1,0) dengan indeks makro
          PCA. {buildRows(search.kod, search.from, search.to).length} tahun dipaparkan.
        </p>
      </Main>
    </>
  )
}
