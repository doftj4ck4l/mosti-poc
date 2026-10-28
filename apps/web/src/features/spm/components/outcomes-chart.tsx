import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { fmt1 } from '@/lib/engine/format'
import { subjectName, subjects, subjectOptions } from '../lib/spm'

const COLORS = {
  credit: '#287A5A',
  pass: '#A4681B',
  fail: '#B24A56',
}

export function OutcomesChart() {
  const data = useMemo(
    () =>
      subjectOptions()
        .slice(0, 12)
        .map((o) => {
          const s = subjects[o.code].series['2025']
          const credit = s?.credit_plus_pct ?? 0
          const fail = s?.fail ?? 0
          const pass = Math.max(0, 100 - credit - fail)
          return {
            label: subjectName(o.code),
            credit: Math.round(credit * 10) / 10,
            pass: Math.round(pass * 10) / 10,
            fail: Math.round(fail * 10) / 10,
            candidates: s?.candidates ?? 0,
          }
        }),
    []
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Komposisi Outcome Calon 2025</CardTitle>
        <CardDescription>
          Kepujian dan ke atas (A+–C), lulus (D/E) dan gagal (G) sebagai peratus calon yang
          menduduki · 12 mata pelajaran teratas mengikut bilangan calon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            credit: { label: 'Kepujian+', color: COLORS.credit },
            pass: { label: 'Lulus D/E', color: COLORS.pass },
            fail: { label: 'Gagal G', color: COLORS.fail },
          }}
          style={{ height: 420 }}
          className='w-full'
        >
          <BarChart data={data} layout='vertical' margin={{ left: 8, right: 24 }}>
            <CartesianGrid horizontal={false} strokeDasharray='3 3' />
            <XAxis type='number' domain={[0, 100]} unit='%' tickLine={false} axisLine={false} />
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
                  formatter={(v, name) => (
                    <div className='flex w-full items-center justify-between gap-2'>
                      <span>
                        {name === 'credit' ? 'Kepujian+' : name === 'pass' ? 'Lulus D/E' : 'Gagal'}
                      </span>
                      <span className='font-mono font-medium'>{fmt1(v as number)}%</span>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey='credit' stackId='o' fill={COLORS.credit} maxBarSize={20} />
            <Bar dataKey='pass' stackId='o' fill={COLORS.pass} maxBarSize={20} />
            <Bar dataKey='fail' stackId='o' fill={COLORS.fail} radius={[0, 3, 3, 0]} maxBarSize={20} />
          </BarChart>
        </ChartContainer>
        <p className='mt-2 text-xs text-muted-foreground'>
          Bilangan mengikut kategori gred ialah anggaran daripada peratusan dalam laporan ×
          bilangan calon menduduki. Peratusan laporan telah dibundarkan.
        </p>
      </CardContent>
    </Card>
  )
}
