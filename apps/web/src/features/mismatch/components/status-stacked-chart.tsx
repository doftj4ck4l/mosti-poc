import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { MATCHED_COLOR, UNMATCHED_COLOR } from '@/lib/chart-colors'
import type { MismatchMeasure, MismatchSummary } from '@/lib/engine/mismatch-types'
import {
  DIM_LABELS,
  getCut,
  matchedOf,
  unmatchedOf,
  type MismatchDim,
} from '@/lib/engine/mismatch'
import { fmt, fmt1 } from '@/lib/engine/format'

interface StatusStackedChartProps {
  dataset: MismatchSummary
  measure: MismatchMeasure
}

const config = {
  matched: { label: 'Sepadan', color: MATCHED_COLOR },
  unmatched: { label: 'Tidak Sepadan', color: UNMATCHED_COLOR },
} satisfies ChartConfig

const FACETS: MismatchDim[] = [
  'peringkat',
  'institusi',
  'sektor_ekonomi',
  'sektor_pekerjaan',
  'kumpulan',
  'income',
  'gpa',
  'jawatan',
  'nec',
  'negeri',
  'kursus',
]

export function StatusStackedChart({ dataset, measure }: StatusStackedChartProps) {
  const [facet, setFacet] = useState<MismatchDim>('peringkat')
  const categories = getCut(dataset, facet)
  const data = categories.map((c) => {
    const un = unmatchedOf(c, measure)
    const m = matchedOf(c, measure)
    const tot = un + m || 1
    return {
      label: c.label,
      matched: (m / tot) * 100,
      unmatched: (un / tot) * 100,
      n: c.n,
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div>
            <CardTitle className='text-base'>Sepadan vs Tidak Sepadan mengikut Medan</CardTitle>
            <CardDescription>
              Setiap bar mewakili 100% graduan dinilai · Hijau = sepadan, merah = tidak sepadan
              (ukuran: {measure === 'ap' ? 'mana-mana' : measure === 'vp' ? 'menegak' : measure === 'hp' ? 'mendatar' : 'kedua-dua'})
            </CardDescription>
          </div>
          <Select value={facet} onValueChange={(v) => setFacet(v as MismatchDim)}>
            <SelectTrigger className='w-[240px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FACETS.map((f) => (
                <SelectItem key={f} value={f}>
                  {DIM_LABELS[f]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} style={{ height: Math.max(220, categories.length * 34) }} className='w-full'>
          <BarChart data={data} layout='vertical' margin={{ left: 8, right: 16 }}>
            <CartesianGrid horizontal={false} strokeDasharray='3 3' />
            <XAxis type='number' domain={[0, 100]} tickLine={false} axisLine={false} unit='%' />
            <YAxis
              type='category'
              dataKey='label'
              width={170}
              tickLine={false}
              axisLine={false}
              tickFormatter={(s: string) => (s.length > 24 ? s.slice(0, 23) + '…' : s)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => (
                    <div className='flex w-full items-center justify-between gap-2'>
                      <span>{name === 'matched' ? 'Sepadan' : 'Tidak Sepadan'}</span>
                      <span className='font-mono font-medium'>
                        {fmt1(value as number)}% · n={fmt((item?.payload as { n?: number })?.n ?? 0)}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey='matched' stackId='s' fill={MATCHED_COLOR} maxBarSize={22} />
            <Bar dataKey='unmatched' stackId='s' fill={UNMATCHED_COLOR} radius={[0, 3, 3, 0]} maxBarSize={22} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
