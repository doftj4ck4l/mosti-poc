import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { StatCard } from '@/components/stat-card'
import { MascoSelect } from '@/components/masco-select'
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  DEMAND_COLOR,
  SUPPLY_COLOR,
  forecastStartYear,
  indexOfYear,
  interventionRequirements,
  interventionSeries,
  jobKeys,
  jobSeries,
  occupationRows,
  classifyGap,
  gapStatus,
} from '@/lib/engine/masco'
import { fmt, fmt1 } from '@/lib/engine/format'
import { cn } from '@/lib/utils'

const HORIZONS = [2030, 2035, 2040] as const

const config = {
  bs: { label: 'Supply Baseline', color: SUPPLY_COLOR },
  bd: { label: 'Demand Baseline', color: DEMAND_COLOR },
  ss: { label: 'Supply Intervensi', color: '#34d399' },
  dd: { label: 'Demand Intervensi', color: '#f87171' },
} satisfies ChartConfig

export function Interventions() {
  const [kod, setKod] = useState('AGG')
  const [targetY, setTargetY] = useState<(typeof HORIZONS)[number]>(2030)
  const [du, setDu] = useState(0)
  const [sa, setSa] = useState(0)

  const isAgg = kod === 'AGG'

  const req = useMemo(() => {
    if (isAgg) {
      const i = indexOfYear(targetY)
      const s = jobKeys.reduce((a, k) => a + (jobSeries(k, 's')[i] ?? 0), 0)
      const d = jobKeys.reduce((a, k) => a + (jobSeries(k, 'd')[i] ?? 0), 0)
      const g = d - s
      const h = targetY - 2025
      const demandRate = (Math.pow(s / d, 1 / h) - 1) * 100
      const supplyRate = (Math.pow(d / s, 1 / h) - 1) * 100
      let lo = 0
      let hi = 0.8
      for (let z = 0; z < 80; z++) {
        const r = (lo + hi) / 2
        const f =
          g < 0
            ? d * Math.pow(1 + r, h) - s * Math.pow(1 - r, h)
            : s * Math.pow(1 + r, h) - d * Math.pow(1 - r, h)
        if (f > 0) hi = r
        else lo = r
      }
      const br = ((lo + hi) / 2) * 100
      return {
        s,
        d,
        g,
        demandRate,
        supplyRate,
        balancedDemand: g < 0 ? br : -br,
        balancedSupply: g < 0 ? -br : br,
      }
    }
    return interventionRequirements(kod, targetY)
  }, [kod, targetY, isAgg])

  const series = useMemo(() => interventionSeries(kod, targetY, du, sa), [kod, targetY, du, sa])

  const afterS = series.ss.at(-1) ?? 0
  const afterD = series.dd.at(-1) ?? 0
  const afterGap = afterD - afterS

  const applyMode = (mode: 'demand' | 'supply' | 'mix') => {
    if (mode === 'demand') {
      setDu(req.demandRate)
      setSa(0)
    } else if (mode === 'supply') {
      setDu(0)
      setSa(req.supplyRate)
    } else {
      setDu(req.balancedDemand)
      setSa(req.balancedSupply)
    }
    toast.info(`Mod ${mode === 'demand' ? 'Demand sahaja' : mode === 'supply' ? 'Supply sahaja' : 'Gabungan 50/50'} diterapkan`)
  }

  const chartData = series.ys.map((y, i) => ({
    year: String(y),
    bs: series.bs[i],
    bd: series.bd[i],
    ss: series.ss[i],
    dd: series.dd[i],
  }))

  const rows = occupationRows(targetY)

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Gap Closure / Intervention Simulator
            </h2>
            <p className='text-muted-foreground'>
              Kedudukan baseline dan kadar tambahan tahunan yang diperlukan untuk menghampiri
              keseimbangan Supply = Demand pada tahun sasaran · bukan cadangan dasar automatik
            </p>
          </div>
          <Button
            variant='ghost'
            onClick={() => {
              setDu(0)
              setSa(0)
            }}
          >
            Reset Intervensi
          </Button>
        </div>

        <div className='flex flex-wrap items-center gap-3'>
          <MascoSelect value={kod} onChange={setKod} />
          <div className='flex items-center gap-1 rounded-lg border p-1'>
            {HORIZONS.map((y) => (
              <Button
                key={y}
                size='sm'
                variant={targetY === y ? 'default' : 'ghost'}
                onClick={() => setTargetY(y)}
              >
                {y === 2030 ? '2030 · 5 tahun' : y === 2035 ? '2035 · 10 tahun' : '2040 · 15 tahun'}
              </Button>
            ))}
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            title={`Supply Baseline ${targetY}`}
            value={fmt(req.s)}
            sub='trajectory baseline model'
          />
          <StatCard
            title={`Demand Baseline ${targetY}`}
            value={fmt(req.d)}
            sub='trajectory baseline model'
          />
          <StatCard
            title={`Jurang Baseline ${targetY}`}
            value={fmt(req.g)}
            sub={classifyGap(req.g)}
            danger={req.g > 0}
            good={req.g < 0}
          />
          <StatCard
            title={`Selepas Intervensi ${targetY}`}
            value={fmt(afterGap)}
            sub={classifyGap(afterGap)}
            danger={afterGap > 0}
            good={afterGap < 0}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>1. Kedudukan Baseline &amp; Apa Yang Perlu Diubah?</CardTitle>
            <CardDescription>
              Tiga pilihan matematik untuk menghampiri Supply = Demand pada tahun {targetY}.
              Angka orang ditunjukkan bersama kadar tahunan supaya lebih mudah ditafsirkan.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-3 md:grid-cols-3'>
            <div className='rounded-lg border p-4'>
              <Badge variant='outline'>Guna Demand Sahaja</Badge>
              <p className='mt-2 text-2xl font-bold'>
                {req.demandRate > 0 ? '+' : ''}
                {fmt1(req.demandRate)}%
              </p>
              <p className='text-xs text-muted-foreground'>
                kadar tahunan demand untuk menuruni baseline hingga menyentuh supply ({fmt(req.s)})
                pada {targetY}
              </p>
              <Button size='sm' className='mt-3 w-full' variant='secondary' onClick={() => applyMode('demand')}>
                Terapkan
              </Button>
            </div>
            <div className='rounded-lg border p-4'>
              <Badge variant='outline'>Guna Supply Sahaja</Badge>
              <p className='mt-2 text-2xl font-bold'>
                {req.supplyRate > 0 ? '+' : ''}
                {fmt1(req.supplyRate)}%
              </p>
              <p className='text-xs text-muted-foreground'>
                kadar tahunan supply untuk mendaki baseline hingga menyentuh demand ({fmt(req.d)})
                pada {targetY}
              </p>
              <Button size='sm' className='mt-3 w-full' variant='secondary' onClick={() => applyMode('supply')}>
                Terapkan
              </Button>
            </div>
            <div className='rounded-lg border p-4'>
              <Badge variant='outline'>Guna Gabungan 50/50</Badge>
              <p className='mt-2 text-2xl font-bold'>
                {req.balancedDemand > 0 ? '+' : ''}
                {fmt1(req.balancedDemand)}% / {req.balancedSupply > 0 ? '+' : ''}
                {fmt1(req.balancedSupply)}%
              </p>
              <p className='text-xs text-muted-foreground'>
                demand {req.balancedDemand >= 0 ? 'naik' : 'turun'} &amp; supply{' '}
                {req.balancedSupply >= 0 ? 'naik' : 'turun'} pada kadar sama sehingga bertemu di
                tengah pada {targetY}
              </p>
              <Button size='sm' className='mt-3 w-full' variant='secondary' onClick={() => applyMode('mix')}>
                Terapkan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>2. Uji Intervensi Sendiri</CardTitle>
            <CardDescription>
              Contoh: Demand +3% bermaksud trajectory Demand baseline dinaikkan 3% secara kompaun
              setiap tahun dari {forecastStartYear}. Kadar pelarasan dikompaun dari {forecastStartYear}{' '}
              hingga tahun sasaran.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-6 md:grid-cols-2'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label className='text-sm font-medium'>Perubahan Demand berbanding baseline</Label>
                <span className='text-sm tabular-nums font-medium'>{fmt1(du)}%/tahun</span>
              </div>
              <Slider min={-15} max={25} step={0.5} value={[du]} onValueChange={([v]) => setDu(v)} />
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label className='text-sm font-medium'>Perubahan Supply berbanding baseline</Label>
                <span className='text-sm tabular-nums font-medium'>{fmt1(sa)}%/tahun</span>
              </div>
              <Slider min={-15} max={25} step={0.5} value={[sa]} onValueChange={([v]) => setSa(v)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>3. Baseline vs Trajectory Intervensi</CardTitle>
            <CardDescription>
              Fokus pada bagaimana jarak Supply–Demand berubah, bukan pada jumlah jurang tahunan
              terkumpul
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={config} style={{ height: 340 }} className='w-full'>
              <ComposedChart data={chartData} margin={{ left: 8, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray='3 3' />
                <XAxis dataKey='year' tickLine={false} axisLine={false} minTickGap={16} />
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
                <Line type='monotone' dataKey='bs' stroke={SUPPLY_COLOR} strokeWidth={1.8} dot={false} />
                <Line type='monotone' dataKey='bd' stroke={DEMAND_COLOR} strokeWidth={1.8} dot={false} />
                <Line
                  type='monotone'
                  dataKey='ss'
                  stroke='#10b981'
                  strokeWidth={2.2}
                  dot={false}
                  strokeDasharray='6 3'
                />
                <Line
                  type='monotone'
                  dataKey='dd'
                  stroke='#ef4444'
                  strokeWidth={2.2}
                  dot={false}
                  strokeDasharray='6 3'
                />
              </ComposedChart>
            </ChartContainer>
            <div className='mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4'>
              <div className='rounded-md border p-3'>
                <span className='text-xs text-muted-foreground'>Supply Baseline → Intervensi</span>
                <p className='font-medium tabular-nums'>
                  {fmt(series.bs.at(-1) ?? 0)} → {fmt(afterS)}
                </p>
              </div>
              <div className='rounded-md border p-3'>
                <span className='text-xs text-muted-foreground'>Demand Baseline → Intervensi</span>
                <p className='font-medium tabular-nums'>
                  {fmt(series.bd.at(-1) ?? 0)} → {fmt(afterD)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>
              Ringkasan Status {targetY} — Jurang Mengikut Pekerjaan
            </CardTitle>
            <CardDescription>
              Disusun mengikut GAP {targetY} · merah = defisit bekalan, hijau = lebihan bekalan ·
              klik baris untuk memilih pekerjaan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-2 md:grid-cols-2'>
              {rows.map((r) => (
                <button
                  key={r.kod}
                  onClick={() => setKod(r.kod)}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-3 text-left text-sm transition-colors hover:bg-muted/50',
                    kod === r.kod && 'border-primary bg-primary/5'
                  )}
                >
                  <div>
                    <span className='font-mono text-xs text-muted-foreground'>{r.kod}</span>{' '}
                    <span className='font-medium'>{r.name}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='tabular-nums'>{fmt(r.gap)}</span>
                    {r.status === 'deficit' ? (
                      <Badge variant='destructive' className='text-[10px]'>
                        defisit
                      </Badge>
                    ) : r.status === 'surplus' ? (
                      <Badge variant='secondary' className='text-[10px]'>
                        lebihan
                      </Badge>
                    ) : (
                      <Badge variant='outline' className='text-[10px]'>
                        seimbang
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <p className='mt-3 text-xs text-muted-foreground'>
              Status dikira sebagai {classifyGap(1)} apabila Demand {'>'} Supply (gap positif) dan{' '}
              {classifyGap(-1)} apabila Demand {'<'} Supply ({gapStatus(-1)}).
            </p>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
