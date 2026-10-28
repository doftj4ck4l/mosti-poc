import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { nationalSeries, localityValues } from '../lib/spm'
import { fmt, fmt1, fmt2 } from '@/lib/engine/format'

const ACCENT = '#0B2E63'
const GREEN = '#287A5A'

function baseConfig(color: string, label: string) {
  return { value: { label, color } }
}

export function NationalCharts() {
  const gpk = nationalSeries('average')
  const cert = nationalSeries('cert')
  const reg = nationalSeries('registered')
  const gap = nationalSeries('gap')

  return (
    <div className='grid gap-4 xl:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Trend Gred Purata Kebangsaan (GPK/GPN)</CardTitle>
          <CardDescription>
            Nilai lebih rendah menunjukkan pencapaian yang lebih baik · 2021 ditanda sebagai
            perubahan konteks (KSSM + pandemik)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={baseConfig(ACCENT, 'GPK')} style={{ height: 260 }} className='w-full'>
            <LineChart data={gpk} margin={{ left: -18, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis dataKey='year' tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[4.2, 5]}
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
              <ReferenceLine x={2021} stroke='hsl(var(--muted-foreground))' strokeDasharray='5 4' />
              <Line
                type='monotone'
                dataKey='value'
                stroke={ACCENT}
                strokeWidth={2.2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Trend Kadar Layak Dianugerahkan Sijil</CardTitle>
          <CardDescription>
            Peratus calon yang layak dianugerahkan sijil SPM · meningkat kepada 94.29% pada 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={baseConfig(GREEN, 'Layak sijil (%)')} style={{ height: 260 }} className='w-full'>
            <LineChart data={cert} margin={{ left: -10, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis dataKey='year' tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[84, 96]}
                unit='%'
                width={46}
                tickFormatter={(v: number) => fmt2(v)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => (
                      <span className='font-mono font-medium'>{fmt1(v as number)}%</span>
                    )}
                  />
                }
              />
              <ReferenceLine x={2021} stroke='hsl(var(--muted-foreground))' strokeDasharray='5 4' />
              <Line
                type='monotone'
                dataKey='value'
                stroke={GREEN}
                strokeWidth={2.2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Trend Calon Berdaftar</CardTitle>
          <CardDescription>
            Pendaftaran menurun sehingga 2023 sebelum kembali meningkat pada 2024 dan 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={baseConfig('#2C6E9B', 'Calon berdaftar')} style={{ height: 260 }} className='w-full'>
            <BarChart data={reg} margin={{ left: 8, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis dataKey='year' tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={62}
                domain={[380000, 430000]}
                tickFormatter={(v: number) => fmt(v)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v) => (
                      <span className='font-mono font-medium'>{fmt(v as number)}</span>
                    )}
                  />
                }
              />
              <Bar dataKey='value' fill='#2C6E9B' radius={4} maxBarSize={34} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Jurang Bandar–Luar Bandar</CardTitle>
          <CardDescription>
            Perbezaan GPK antara calon bandar dan luar bandar · mengecil kepada 0.41 pada 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={baseConfig('#A4681B', 'Jurang GPK')} style={{ height: 260 }} className='w-full'>
            <LineChart data={gap} margin={{ left: -18, right: 12 }}>
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
          <div className='mt-3 grid grid-cols-2 gap-2 text-xs'>
            <div className='rounded-md border p-2'>
              <p className='text-muted-foreground'>Bandar 2024 → 2025</p>
              <p className='font-medium tabular-nums'>
                {fmt2(localityValues[2024].bandar)} → {fmt2(localityValues[2025].bandar)}
              </p>
            </div>
            <div className='rounded-md border p-2'>
              <p className='text-muted-foreground'>Luar bandar 2024 → 2025</p>
              <p className='font-medium tabular-nums'>
                {fmt2(localityValues[2024].luarBandar)} → {fmt2(localityValues[2025].luarBandar)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
