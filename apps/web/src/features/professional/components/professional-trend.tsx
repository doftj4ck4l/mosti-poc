import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { fmt } from '@/lib/engine/format'
import {
  BODY_COLORS,
  byTypeByYear,
  typesFor,
  type Body,
} from '../lib/professional'

interface StackedTrendProps {
  body: Body
  field: string
}

export function ProfessionalTrend({ body, field }: StackedTrendProps) {
  const types = typesFor(body)
  const data = byTypeByYear(body, field)
  const config = Object.fromEntries(
    types.map((t, i) => [t, { label: t, color: BODY_COLORS[i % BODY_COLORS.length] }])
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>
          Trend Tahunan Pendaftaran Mengikut Jenis
        </CardTitle>
        <CardDescription>
          {field === 'Semua' ? 'Semua bidang' : `Bidang: ${field}`} · data ilustratif prototaip
          2020–2025
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} style={{ height: 340 }} className='w-full'>
          <BarChart data={data} margin={{ left: 8, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis dataKey='year' tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={64}
              tickFormatter={(v: number) => fmt(v)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(v, name) => (
                    <div className='flex w-full items-center justify-between gap-2'>
                      <span>{name}</span>
                      <span className='font-mono font-medium'>{fmt(v as number)}</span>
                    </div>
                  )}
                />
              }
            />
            <Legend />
            {types.map((t, i) => (
              <Bar
                key={t}
                dataKey={t}
                stackId='reg'
                fill={BODY_COLORS[i % BODY_COLORS.length]}
                maxBarSize={48}
                radius={i === types.length - 1 ? [4, 4, 0, 0] : undefined}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
