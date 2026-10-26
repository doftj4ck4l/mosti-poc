import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  CI_COLOR,
  DEMAND_COLOR,
  GAP_COLOR,
  SUPPLY_COLOR,
  forecastStartYear,
  indexOfYear,
  jobCi,
  jobCiUpper,
  jobSeries,
  jobs,
  years,
} from '@/lib/engine/masco'
import { fmt } from '@/lib/engine/format'

const config = {
  s: { label: 'Supply', color: SUPPLY_COLOR },
  d: { label: 'Demand', color: DEMAND_COLOR },
  gap: { label: 'Jurang (Demand − Supply)', color: GAP_COLOR },
} satisfies ChartConfig

export interface SeriesRow {
  year: string
  yearNum: number
  s: number
  d: number
  loS: number | null
  bandS: number | null
  loD: number | null
  bandD: number | null
  gap: number
}

function sumOrNull(values: (number | null)[]): number | null {
  let total: number | null = null
  for (const v of values) {
    if (v !== null && v !== undefined) {
      total = (total ?? 0) + v
    }
  }
  return total
}

export function buildRows(kod: string, from: number, to: number): SeriesRow[] {
  const isAgg = kod === 'AGG'
  const keys = isAgg ? Object.keys(jobs) : [kod]
  return years
    .filter((y) => y >= from && y <= to)
    .map((y) => {
      const i = indexOfYear(y)
      const s = keys.reduce((a, k) => a + (jobSeries(k, 's')[i] ?? 0), 0)
      const d = keys.reduce((a, k) => a + (jobSeries(k, 'd')[i] ?? 0), 0)
      const loS = sumOrNull(keys.map((k) => jobCi(k, 's')[i] ?? null))
      const hiS = sumOrNull(keys.map((k) => jobCiUpper(k, 's')[i] ?? null))
      const loD = sumOrNull(keys.map((k) => jobCi(k, 'd')[i] ?? null))
      const hiD = sumOrNull(keys.map((k) => jobCiUpper(k, 'd')[i] ?? null))
      return {
        year: String(y),
        yearNum: y,
        s,
        d,
        loS,
        bandS: loS !== null && hiS !== null ? hiS - loS : null,
        loD,
        bandD: loD !== null && hiD !== null ? hiD - loD : null,
        gap: d - s,
      }
    })
}

interface SeriesChartProps {
  kod: string
  from: number
  to: number
}

export function SupplyDemandChart({ kod, from, to }: SeriesChartProps) {
  const rows = buildRows(kod, from, to)
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Trend Supply vs Demand</CardTitle>
        <CardDescription>
          Garis pekat = data sebenar / ramalan pusat · Kawasan lorek = selang keyakinan ~80% ·
          Garis putus = permulaan ramalan {forecastStartYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} style={{ height: 380 }} className='w-full'>
          <ComposedChart data={rows} margin={{ left: 8, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis dataKey='year' tickLine={false} axisLine={false} minTickGap={18} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={64}
              tickFormatter={(v: number) => fmt(v)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className='flex w-full items-center justify-between gap-2'>
                      <span className='flex items-center gap-1.5'>
                        <span
                          className='size-2.5 rounded-sm'
                          style={{
                            backgroundColor:
                              name === 's' ? SUPPLY_COLOR : name === 'd' ? DEMAND_COLOR : CI_COLOR,
                          }}
                        />
                        {name === 's' ? 'Supply' : name === 'd' ? 'Demand' : name}
                      </span>
                      <span className='font-mono font-medium'>{fmt(value as number)}</span>
                    </div>
                  )}
                />
              }
            />
            <Area
              dataKey='loS'
              stackId='cis'
              stroke='none'
              fill='transparent'
              connectNulls={false}
              isAnimationActive={false}
            />
            <Area
              dataKey='bandS'
              stackId='cis'
              stroke='none'
              fill={CI_COLOR}
              fillOpacity={0.22}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Area
              dataKey='loD'
              stackId='cid'
              stroke='none'
              fill='transparent'
              connectNulls={false}
              isAnimationActive={false}
            />
            <Area
              dataKey='bandD'
              stackId='cid'
              stroke='none'
              fill={DEMAND_COLOR}
              fillOpacity={0.12}
              connectNulls={false}
              isAnimationActive={false}
            />
            <ReferenceLine
              x={String(forecastStartYear)}
              stroke='hsl(var(--muted-foreground))'
              strokeDasharray='6 4'
              strokeWidth={1.4}
            />
            <Line
              type='monotone'
              dataKey='s'
              stroke={SUPPLY_COLOR}
              strokeWidth={2.2}
              dot={false}
              connectNulls
            />
            <Line
              type='monotone'
              dataKey='d'
              stroke={DEMAND_COLOR}
              strokeWidth={2.2}
              dot={false}
              connectNulls
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function GapChart({ kod, from, to }: SeriesChartProps) {
  const rows = buildRows(kod, from, to)
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Jurang Tahunan (Demand − Supply)</CardTitle>
        <CardDescription>
          Positif = defisit bekalan (merah) · Negatif = lebihan bekalan (hijau)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} style={{ height: 280 }} className='w-full'>
          <BarChart data={rows} margin={{ left: 8, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis dataKey='year' tickLine={false} axisLine={false} minTickGap={18} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={64}
              tickFormatter={(v: number) => fmt(v)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <div className='flex w-full items-center justify-between gap-2'>
                      <span>Jurang</span>
                      <span className='font-mono font-medium'>{fmt(value as number)}</span>
                    </div>
                  )}
                />
              }
            />
            <ReferenceLine
              x={String(forecastStartYear)}
              stroke='hsl(var(--muted-foreground))'
              strokeDasharray='6 4'
            />
            <ReferenceLine y={0} stroke='hsl(var(--border))' />
            <Bar dataKey='gap' radius={2} maxBarSize={22}>
              {rows.map((r) => (
                <Cell
                  key={r.year}
                  fill={r.gap > 0 ? '#dc2626' : r.gap < 0 ? '#16a34a' : GAP_COLOR}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
