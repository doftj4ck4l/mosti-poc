import { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
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
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { fmt1, fmt2 } from '@/lib/engine/format'
import { METRICS, type SubjectYear, seriesFor, subjectName, subjectOptions } from '../lib/spm'

const METRIC_KEYS: (keyof SubjectYear)[] = ['gpmp', 'candidates', 'credit_plus_pct', 'fail', 'passrate']

export function SubjectProfile() {
  const options = useMemo(() => subjectOptions(), [])
  const [code, setCode] = useState('1449')
  const [metric, setMetric] = useState<keyof SubjectYear>('gpmp')
  const [period, setPeriod] = useState<'kssm' | 'full'>('kssm')

  const series = useMemo(() => {
    const all = seriesFor(code, metric)
    return period === 'kssm' ? all.filter((d) => d.year >= 2021) : all
  }, [code, metric, period])

  const meta = METRICS[metric as string] ?? { label: String(metric), unit: '', lowerBetter: false }

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div>
            <CardTitle className='text-base'>Profil Mata Pelajaran</CardTitle>
            <CardDescription>
              {meta.lowerBetter ? 'Nilai lebih rendah = lebih baik · ' : ''}
              Trend {meta.label} bagi mata pelajaran terpilih
            </CardDescription>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Select value={code} onValueChange={setCode}>
              <SelectTrigger className='w-[260px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.code} value={o.code}>
                    {o.code} · {subjectName(o.code)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={metric as string} onValueChange={(v) => setMetric(v as keyof SubjectYear)}>
              <SelectTrigger className='w-[170px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METRIC_KEYS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {METRICS[k as string]?.label ?? k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='flex items-center gap-1 rounded-lg border p-1'>
              <Button
                size='sm'
                variant={period === 'kssm' ? 'default' : 'ghost'}
                onClick={() => setPeriod('kssm')}
              >
                2021–2025
              </Button>
              <Button
                size='sm'
                variant={period === 'full' ? 'default' : 'ghost'}
                onClick={() => setPeriod('full')}
              >
                2018–2025
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ value: { label: meta.label, color: '#0B2E63' } }}
          style={{ height: 300 }}
          className='w-full'
        >
          <LineChart data={series} margin={{ left: -14, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis dataKey='year' tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={62}
              unit={meta.unit}
              domain={
                metric === 'gpmp'
                  ? ['dataMin - 0.3', 'dataMax + 0.3']
                  : ['auto', 'auto']
              }
              tickFormatter={(v: number) =>
                metric === 'candidates' ? v.toLocaleString('en-US') : metric === 'gpmp' ? fmt2(v) : fmt1(v)
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(v) => (
                    <span className='font-mono font-medium'>
                      {metric === 'candidates'
                        ? Number(v).toLocaleString('en-US')
                        : `${metric === 'gpmp' ? fmt2(v as number) : fmt1(v as number)}${meta.unit}`}
                    </span>
                  )}
                />
              }
            />
            <Line
              type='monotone'
              dataKey='value'
              stroke='#0B2E63'
              strokeWidth={2.2}
              dot={{ r: 3 }}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
