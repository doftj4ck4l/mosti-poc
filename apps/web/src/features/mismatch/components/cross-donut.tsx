import { Cell, Pie, PieChart } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { DUAL_COLOR, MATCHED_COLOR, MENDATAR_COLOR, MENEGAK_COLOR } from '@/lib/chart-colors'
import type { MismatchSummary } from '@/lib/engine/mismatch-types'
import { fmt } from '@/lib/engine/format'

const config = {
  none: { label: 'Sepadan' },
  onlyv: { label: 'Menegak sahaja' },
  onlyh: { label: 'Mendatar sahaja' },
  dual: { label: 'Kedua-dua' },
} satisfies ChartConfig

const COLORS = [MATCHED_COLOR, MENEGAK_COLOR, MENDATAR_COLOR, DUAL_COLOR]

interface CrossDonutProps {
  dataset: MismatchSummary
  title: string
  description?: string
}

export function CrossDonut({ dataset, title, description }: CrossDonutProps) {
  const cells = [
    { name: 'Sepadan', key: 'none', value: dataset.none },
    { name: 'Menegak sahaja', key: 'onlyv', value: dataset.onlyv },
    { name: 'Mendatar sahaja', key: 'onlyh', value: dataset.onlyh },
    { name: 'Kedua-dua', key: 'dual', value: dataset.dual },
  ]
  const data = cells.map((c, i) => ({ key: c.key, label: c.name, value: c.value, fill: COLORS[i] }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} style={{ height: 280 }} className='w-full'>
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(_, _name, item) => {
                    const payload = item?.payload as { value?: number; label?: string }
                    const total = cells.reduce((a, c) => a + c.value, 0) || 1
                    return (
                      <div className='flex w-full items-center justify-between gap-2'>
                        <span>{payload.label}</span>
                        <span className='font-mono font-medium'>
                          {fmt(payload.value)} ({((payload.value ?? 0) / total * 100).toFixed(1)}%)
                        </span>
                      </div>
                    )
                  }}
                />
              }
            />
            <Pie
              data={data}
              dataKey='value'
              nameKey='label'
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {data.map((entry, i) => (
                <Cell key={entry.key} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className='mt-2 grid grid-cols-2 gap-1 text-xs'>
          {cells.map((c, i) => (
            <div key={c.key} className='flex items-center gap-2'>
              <span
                className='inline-block size-2.5 rounded-sm'
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className='text-muted-foreground'>{c.name}:</span>
              <span className='font-medium'>{fmt(c.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
