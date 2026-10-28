import { useMemo } from 'react'
import {
  CartesianGrid,
  Cell,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { fmt, fmt1, fmt1Signed } from '@/lib/engine/format'
import { subjectName, subjects, subjectOptions } from '../lib/spm'

interface Point {
  label: string
  x: number
  y: number
  size: number
  gpmp: number
}

export function ParticipationScatter() {
  const points: Point[] = useMemo(
    () =>
      subjectOptions()
        .slice(0, 30)
        .map((o) => {
          const s = subjects[o.code].series
          const c24 = s['2024']?.candidates ?? 0
          const c25 = s['2025']?.candidates ?? 0
          const g24 = s['2024']?.gpmp
          const g25 = s['2025']?.gpmp
          if (!c24 || g24 === undefined || g25 === undefined) return null
          return {
            label: subjectName(o.code),
            x: ((c25 - c24) / c24) * 100,
            y: -(g25 - g24),
            size: c25,
            gpmp: g25,
          }
        })
        .filter((p): p is Point => p !== null),
    []
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Perubahan Prestasi × Perubahan Bilangan Calon</CardTitle>
        <CardDescription>
          Paksi menegak ditukar supaya nilai positif menunjukkan GPMP bertambah baik ·
          saiz bulatan = bilangan calon 2025 · 30 mata pelajaran teratas mengikut calon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            x: { label: 'Δ calon (%)', color: '#2C6E9B' },
            y: { label: 'Δ GPMP (terbalik)', color: '#287A5A' },
          }}
          style={{ height: 400 }}
          className='w-full'
        >
          <ScatterChart margin={{ left: 4, right: 20, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              type='number'
              dataKey='x'
              name='Δ calon (%)'
              unit='%'
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type='number'
              dataKey='y'
              name='Δ GPMP (terbalik)'
              tickLine={false}
              axisLine={false}
              width={54}
              tickFormatter={(v: number) => fmt1(v)}
            />
            <ZAxis type='number' dataKey='size' range={[30, 420]} />
            <ReferenceLine x={0} stroke='hsl(var(--border))' />
            <ReferenceLine y={0} stroke='hsl(var(--border))' />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(_, __, item) => {
                    const p = item?.payload as Point | undefined
                    if (!p) return null
                    return (
                      <div className='space-y-1'>
                        <p className='font-medium'>{p.label}</p>
                        <p className='text-xs'>
                          Δ calon: {fmt1Signed(p.x)}% · Δ GPMP (terbalik): {fmt1Signed(p.y)}
                        </p>
                        <p className='text-xs'>
                          Calon 2025: {fmt(p.size)} · GPMP 2025: {fmt1(p.gpmp)}
                        </p>
                      </div>
                    )
                  }}
                />
              }
            />
            <Scatter data={points} fill='#2C6E9B' fillOpacity={0.55}>
              {points.map((p) => (
                <Cell
                  key={p.label}
                  fill={p.y >= 0 ? '#287A5A' : '#B24A56'}
                  fillOpacity={0.55}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ChartContainer>
        <div className='mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2'>
          <p>Kiri atas: lebih sedikit calon, prestasi bertambah baik.</p>
          <p>Kanan bawah: lebih ramai calon, prestasi menurun.</p>
        </div>
      </CardContent>
    </Card>
  )
}
