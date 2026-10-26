import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
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
import { ACCENT_COLOR } from '@/lib/chart-colors'
import type { MismatchCategory, MismatchMeasure } from '@/lib/engine/mismatch-types'

interface TrendChartProps {
  categories: MismatchCategory[]
  measure: MismatchMeasure
}

const config = {
  ap: { label: 'Mana-mana %', color: ACCENT_COLOR },
  vp: { label: 'Menegak %', color: '#8b5cf6' },
  hp: { label: 'Mendatar %', color: '#eab308' },
  dp: { label: 'Kedua-dua %', color: '#f97316' },
} satisfies ChartConfig

export function TrendChart({ categories, measure }: TrendChartProps) {
  const data = categories.map((c) => ({
    label: c.label,
    ap: c.ap,
    vp: c.vp,
    hp: c.hp,
    dp: c.dp,
    n: c.n,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Aliran Kadar Ketidaksepadanan Mengikut Tahun</CardTitle>
        <CardDescription>
          Kadar bagi kohort graduan setiap tahun kajian, 2018–2024 · Bar ungu = Menegak, kuning =
          Mendatar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} style={{ height: 300 }} className='w-full'>
          <ComposedChart data={data} margin={{ left: -10, right: 12, top: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis dataKey='label' tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} unit='%' width={52} domain={[0, 100]} />
            <ChartTooltip content={<ChartTooltipContent indicator='line' />} />
            <Area
              type='monotone'
              dataKey={measure}
              stroke='none'
              fill={ACCENT_COLOR}
              fillOpacity={0.12}
            />
            <Line
              type='monotone'
              dataKey='ap'
              stroke={ACCENT_COLOR}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type='monotone'
              dataKey='vp'
              stroke='#8b5cf6'
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type='monotone'
              dataKey='hp'
              stroke='#eab308'
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
