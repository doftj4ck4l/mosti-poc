import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { fmt } from '@/lib/engine/format'
import { BODY_COLORS, fieldTotals, fieldGrowth, yearsFor, type Body } from '../lib/professional'

interface FieldBreakdownProps {
  body: Body
  field: string
  onSelect: (field: string) => void
}

export function FieldBreakdown({ body, field, onSelect }: FieldBreakdownProps) {
  const years = yearsFor(body)
  const latest = years[years.length - 1]
  const totals = fieldTotals(body, latest)
  const growth = new Map(fieldGrowth(body).map((g) => [g.field, g.growth]))
  const data = totals.map((t, i) => ({
    label: t.field,
    total: t.total,
    growth: growth.get(t.field) ?? 0,
    color: BODY_COLORS[i % BODY_COLORS.length],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Pecahan Mengikut Bidang ({latest})</CardTitle>
        <CardDescription>
          Klik bar untuk menapis trend tahunan mengikut bidang · nilai dalam kurungan ialah
          pertumbuhan tahunan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ total: { label: 'Pendaftaran', color: BODY_COLORS[0] } }}
          style={{ height: Math.max(260, data.length * 42) }}
          className='w-full'
        >
          <BarChart data={data} layout='vertical' margin={{ left: 8, right: 60 }}>
            <CartesianGrid horizontal={false} strokeDasharray='3 3' />
            <XAxis type='number' tickLine={false} axisLine={false} tickFormatter={(v: number) => fmt(v)} />
            <YAxis
              type='category'
              dataKey='label'
              width={190}
              tickLine={false}
              axisLine={false}
              tickFormatter={(s: string) => (s.length > 26 ? s.slice(0, 25) + '…' : s)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(v, _n, item) => {
                    const p = item?.payload as { growth?: number } | undefined
                    return (
                      <div className='flex w-full items-center justify-between gap-2'>
                        <span>Pendaftaran</span>
                        <span className='font-mono font-medium'>
                          {fmt(v as number)} ({p?.growth !== undefined ? `${p.growth.toFixed(1)}%` : '—'})
                        </span>
                      </div>
                    )
                  }}
                />
              }
            />
            <Bar
              dataKey='total'
              radius={3}
              maxBarSize={26}
              onClick={(d) => {
                const label = (d as unknown as { label?: string })?.label
                if (label) onSelect(label === field ? 'Semua' : label)
              }}
              cursor='pointer'
            >
              {data.map((d) => (
                <Cell
                  key={d.label}
                  fill={d.color}
                  fillOpacity={field === 'Semua' || field === d.label ? 1 : 0.35}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
