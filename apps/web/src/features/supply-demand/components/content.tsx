import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StatCard } from '@/components/stat-card'
import { MascoSelect } from '@/components/masco-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TrendingUp } from 'lucide-react'
import {
  DEMAND_COLOR,
  SUPPLY_COLOR,
  aggSeries,
  cagr,
  classifyGap,
  firstCrossover,
  indexOfYear,
  jobSeries,
  years,
} from '@/lib/engine/masco'
import { fmt, fmt1, pct } from '@/lib/engine/format'
import { SupplyDemandChart, GapChart, buildRows } from './supply-demand-chart'
import { TrendTable } from './trend-table'

function seriesFor(kod: string, type: 's' | 'd'): (number | null)[] {
  return kod === 'AGG' ? aggSeries(type) : jobSeries(kod, type)
}

interface SupplyDemandContentProps {
  kod: string
  from: number
  to: number
  onChange: (patch: Partial<{ kod: string; from: number; to: number }>) => void
}

export function SupplyDemandContent({ kod, from, to, onChange }: SupplyDemandContentProps) {
  const summary = useMemo(() => {
    const s = seriesFor(kod, 's')
    const d = seriesFor(kod, 'd')
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
  }, [kod])

  const crossover = useMemo(() => {
    const s = seriesFor(kod, 's')
    const d = seriesFor(kod, 'd')
    return firstCrossover(s, d, years, indexOfYear(2025))
  }, [kod])

  const isAgg = kod === 'AGG'

  return (
    <div className='flex flex-col gap-4'>
      <div className='space-y-1'>
        <h3 className='text-xl font-bold tracking-tight'>
          Papan Pemuka Supply &amp; Demand MASCO
        </h3>
        <p className='text-sm text-muted-foreground'>
          Analisis Pasaran Tenaga Kerja · Kod MASCO · 2015–2040 · Sejarah 2015–2025, Ramalan
          2026–2040
        </p>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <MascoSelect value={kod} onChange={(v) => onChange({ kod: v })} />
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>Dari</span>
          <Select value={String(from)} onValueChange={(v) => onChange({ from: Number(v) })}>
            <SelectTrigger className='w-[110px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>Hingga</span>
          <Select value={String(to)} onValueChange={(v) => onChange({ to: Number(v) })}>
            <SelectTrigger className='w-[110px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
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
                MASCO {kod}
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 xl:grid-cols-2'>
        <SupplyDemandChart kod={kod} from={from} to={to} />
        <GapChart kod={kod} from={from} to={to} />
      </div>

      <TrendTable kod={kod} from={from} to={to} />

      <p className='text-xs text-muted-foreground'>
        Nota: nilai ramalan perlu dibaca bersama ketidakpastian model dan bukan dianggap sebagai
        angka deterministik. Sumber: Analisis MASTIC — model SARIMAX(1,1,0) dengan indeks makro
        PCA. {buildRows(kod, from, to).length} tahun dipaparkan.
      </p>
    </div>
  )
}
