import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  MENDATAR_COLOR,
  MENEGAK_COLOR,
} from '@/lib/chart-colors'
import type { MismatchCategory, MismatchMeasure } from '@/lib/engine/mismatch-types'
import { fmt1 } from '@/lib/engine/format'

interface CutBarChartProps {
  title: string
  description?: string
  categories: MismatchCategory[]
  measure: MismatchMeasure
  horizontal?: boolean
  height?: number
}

const config = {
  vp: { label: 'Menegak %', color: MENEGAK_COLOR },
  hp: { label: 'Mendatar %', color: MENDATAR_COLOR },
} satisfies ChartConfig

export function CutBarChart({
  title,
  description,
  categories,
  measure,
  horizontal,
  height = 300,
}: CutBarChartProps) {
  const [showAll, setShowAll] = useState(false)
  const rows = showAll ? categories : categories.slice(0, horizontal ? 8 : 12)
  const data = rows.map((c) => ({
    label: c.label,
    vp: c.vp,
    hp: c.hp,
    n: c.n,
    measureValue: c[measure],
  }))

  const trunc = (s: string) => (s.length > 22 ? s.slice(0, 21) + '…' : s)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} style={{ height }} className='w-full'>
          <BarChart
            data={data}
            layout={horizontal ? 'vertical' : 'horizontal'}
            margin={{ left: 8, right: 28, top: 8 }}
          >
            <CartesianGrid vertical={horizontal} horizontal={!horizontal} strokeDasharray='3 3' />
            {horizontal ? (
              <>
                <XAxis type='number' tickLine={false} axisLine={false} unit='%' />
                <YAxis
                  type='category'
                  dataKey='label'
                  width={150}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={trunc}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey='label'
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-30}
                  textAnchor='end'
                  height={70}
                  tickFormatter={trunc}
                />
                <YAxis tickLine={false} axisLine={false} unit='%' width={40} />
              </>
            )}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className='flex w-full items-center justify-between gap-2'>
                      <span className='flex items-center gap-1.5'>
                        {name === 'vp' ? 'Menegak' : 'Mendatar'}
                      </span>
                      <span className='font-mono font-medium'>{fmt1(value as number)}%</span>
                    </div>
                  )}
                  indicator='dot'
                />
              }
            />
            <Bar dataKey='vp' fill={MENEGAK_COLOR} radius={3} maxBarSize={26}>
              <LabelList
                dataKey='vp'
                position={horizontal ? 'right' : 'top'}
                formatter={(v) => fmt1(Number(v))}
                className='fill-muted-foreground'
                fontSize={10}
              />
            </Bar>
            <Bar dataKey='hp' fill={MENDATAR_COLOR} radius={3} maxBarSize={26}>
              <LabelList
                dataKey='hp'
                position={horizontal ? 'right' : 'top'}
                formatter={(v) => fmt1(Number(v))}
                className='fill-muted-foreground'
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
        {categories.length > (horizontal ? 8 : 12) && (
          <div className='mt-2 flex items-center justify-between text-xs text-muted-foreground'>
            <span>
              Menunjukkan {rows.length} daripada {categories.length} kategori
            </span>
            <button
              onClick={() => setShowAll((s) => !s)}
              className='font-medium text-primary underline-offset-4 hover:underline'
            >
              {showAll ? 'Tunjuk kurang' : 'Tunjuk semua'}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
