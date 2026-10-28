import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { fmt2 } from '@/lib/engine/format'
import { localityValues, nationalSeries } from '../lib/spm'

const bandarRural = [
  { label: '2024', bandar: localityValues[2024].bandar, luar: localityValues[2024].luarBandar },
  { label: '2025', bandar: localityValues[2025].bandar, luar: localityValues[2025].luarBandar },
]

export function LocalityPanel() {
  return (
    <div className='grid gap-4 xl:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>GPK Bandar vs Luar Bandar</CardTitle>
          <CardDescription>
            Kedua-dua lokaliti mencatat GPK lebih rendah pada 2025 · perubahan luar bandar lebih
            besar, menyebabkan jurang mengecil kepada 0.41
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              bandar: { label: 'Bandar', color: '#2C6E9B' },
              luar: { label: 'Luar bandar', color: '#A4681B' },
            }}
            style={{ height: 280 }}
            className='w-full'
          >
            <BarChart data={bandarRural} margin={{ left: -6, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis dataKey='label' tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[4.2, 5.05]}
                width={46}
                tickFormatter={(v: number) => fmt2(v)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v, name) => (
                      <div className='flex w-full items-center justify-between gap-2'>
                        <span>{name === 'bandar' ? 'Bandar' : 'Luar bandar'}</span>
                        <span className='font-mono font-medium'>{fmt2(v as number)}</span>
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey='bandar' fill='#2C6E9B' radius={3} maxBarSize={48} />
              <Bar dataKey='luar' fill='#A4681B' radius={3} maxBarSize={48} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Trend Jurang Bandar–Luar Bandar</CardTitle>
          <CardDescription>
            Perbezaan gred purata antara calon bandar dan luar bandar, 2021–2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ value: { label: 'Jurang GPK', color: '#A4681B' } }}
            style={{ height: 280 }}
            className='w-full'
          >
            <LineChart data={nationalSeries('gap')} margin={{ left: -18, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis dataKey='year' tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0.35, 0.5]}
                tickFormatter={(v: number) => fmt2(v)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => (
                      <span className='font-mono font-medium'>{fmt2(v as number)}</span>
                    )}
                  />
                }
              />
              <Line
                type='monotone'
                dataKey='value'
                stroke='#A4681B'
                strokeWidth={2.2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
