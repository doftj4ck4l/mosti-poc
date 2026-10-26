import {
  CartesianGrid,
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
  DEMAND_COLOR,
  SUPPLY_COLOR,
  forecastStartYear,
  type ScenarioResult,
} from '@/lib/engine/masco'
import { fmt } from '@/lib/engine/format'

const config = {
  bs: { label: 'Supply Baseline', color: SUPPLY_COLOR },
  bd: { label: 'Demand Baseline', color: DEMAND_COLOR },
  ss: { label: 'Supply Scenario', color: '#7dd3fc' },
  sd: { label: 'Demand Scenario', color: '#fde68a' },
} satisfies ChartConfig

interface ScenarioChartProps {
  result: ScenarioResult
  endY: number
}

export function ScenarioChart({ result, endY }: ScenarioChartProps) {
  const data = result.ys.map((y, i) => ({
    year: String(y),
    bs: result.bs[i],
    bd: result.bd[i],
    ss: result.ss[i],
    sd: result.sd[i],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Baseline vs Scenario — Supply &amp; Demand</CardTitle>
        <CardDescription>
          Perbandingan trajectory model asas dengan scenario faktor makro terpilih (hingga {endY})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} style={{ height: 340 }} className='w-full'>
          <ComposedChart data={data} margin={{ left: 8, right: 12 }}>
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
                      <span>{config[name as keyof typeof config]?.label ?? name}</span>
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
            <Line
              type='monotone'
              dataKey='bs'
              stroke={SUPPLY_COLOR}
              strokeWidth={2}
              dot={false}
              strokeDasharray='1 0'
            />
            <Line
              type='monotone'
              dataKey='bd'
              stroke={DEMAND_COLOR}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type='monotone'
              dataKey='ss'
              stroke='#38bdf8'
              strokeWidth={2.2}
              dot={false}
              strokeDasharray='6 3'
            />
            <Line
              type='monotone'
              dataKey='sd'
              stroke='#f59e0b'
              strokeWidth={2.2}
              dot={false}
              strokeDasharray='6 3'
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
