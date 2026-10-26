import { useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { StatCard } from '@/components/stat-card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TriangleAlert } from 'lucide-react'
import {
  DEMAND_COLOR,
  SUPPLY_COLOR,
  arDecay,
  jobKeys,
  jobSeries,
  jobs,
  indexOfYear,
  macroCorr,
  macroKeys,
  macroShortNames,
  scenarioMeta,
} from '@/lib/engine/masco'
import { fmt1 } from '@/lib/engine/format'
import { cn } from '@/lib/utils'

const r2Config = {
  supply: { label: 'R² Supply', color: SUPPLY_COLOR },
  demand: { label: 'R² Demand', color: DEMAND_COLOR },
} satisfies ChartConfig

const ciConfig = {
  supply: { label: 'CI Supply 2040', color: SUPPLY_COLOR },
  demand: { label: 'CI Demand 2040', color: DEMAND_COLOR },
} satisfies ChartConfig

const STEPS = [
  {
    n: '01',
    title: 'Data Sejarah',
    desc: 'Supply, Demand dan enam indikator makro, 2015–2025.',
  },
  {
    n: '02',
    title: 'Indeks Makro PCA',
    desc: 'Enam faktor distandardkan dan digabungkan kepada PC1.',
  },
  {
    n: '03',
    title: 'SARIMAX(1,1,0)',
    desc: 'Regresi exogenous dengan komponen AR(1) pada siri terbeza.',
  },
  {
    n: '04',
    title: 'Ramalan & Scenario',
    desc: 'Baseline 2026–2040 dan sensitiviti what-if berasaskan exogenous.',
  },
]

export function ModelDiagnostics() {
  const [decayKod, setDecayKod] = useState(jobKeys[0])
  const i40 = indexOfYear(2040)

  const r2Rows = jobKeys.map((k) => ({
    kod: k,
    supply: jobs[k].r2_exog.SUPPLY,
    demand: jobs[k].r2_exog.DEMAND,
  }))

  const ciRows = jobKeys.map((k) => {
    const j = jobs[k]
    const sFc = jobSeries(k, 's')[i40] ?? 0
    const dFc = jobSeries(k, 'd')[i40] ?? 0
    const sLo = j.supply_lower[i40]
    const sHi = j.supply_upper[i40]
    const dLo = j.demand_lower[i40]
    const dHi = j.demand_upper[i40]
    return {
      kod: k,
      supply: sFc && sLo != null && sHi != null ? ((sHi - sLo) / sFc) * 100 : null,
      demand: dFc && dLo != null && dHi != null ? ((dHi - dLo) / dFc) * 100 : null,
    }
  })

  const decayRows = (arDecay[decayKod] ?? [])
    .map((v, h) => ({ h: h === 0 ? 0 : h, decay: v }))
    .slice(0, 16)

  const corrRows = macroKeys.map((k) => ({
    key: k,
    label: macroShortNames[k],
    supply: macroCorr[k]?.supply ?? 0,
    demand: macroCorr[k]?.demand ?? 0,
  }))

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Metodologi &amp; Validasi</h2>
          <p className='text-muted-foreground'>
            Aliran model memisahkan input sejarah, pemampatan faktor makro melalui PCA, model
            pekerjaan dan akhirnya ramalan/scenario
          </p>
        </div>

        <div className='grid gap-3 md:grid-cols-4'>
          {STEPS.map((s) => (
            <Card key={s.n}>
              <CardHeader className='pb-2'>
                <CardTitle className='font-mono text-xs text-muted-foreground'>
                  Langkah {s.n}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='font-semibold'>{s.title}</p>
                <p className='mt-1 text-xs text-muted-foreground'>{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <StatCard title='Panjang sejarah' value='11 tahun' sub='2015–2025 bagi setiap pekerjaan' />
          <StatCard title='Varians PC1 dijelaskan' value='49.1%' sub='enam faktor makro distandardkan' />
          <StatCard
            title='Horizon ramalan'
            value='15 tahun'
            sub='2026–2040'
            icon={<TriangleAlert className='text-amber-500' />}
            danger
          />
          <StatCard title='Pekerjaan dimodelkan' value={String(jobKeys.length)} sub='kod MASCO sektor E&E' />
        </div>

        <Alert className='border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950'>
          <TriangleAlert className='size-4 text-amber-600' />
          <AlertTitle>Horizon ramalan (15 tahun) lebih panjang daripada siri sejarah (11 tahun)</AlertTitle>
          <AlertDescription>
            Oleh itu, ketidakpastian jangka panjang perlu diberi penekanan dan backtesting
            tambahan disyorkan sebelum penggunaan dasar. R² exogenous dan lebar CI ialah
            diagnostik, bukan pengganti backtesting.
          </AlertDescription>
        </Alert>

        <div className='grid gap-4 xl:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>R² Exogenous — Supply &amp; Demand</CardTitle>
              <CardDescription>
                Kemampuan indeks makro menerangkan variasi sejarah. Ini bukan ukuran ketepatan
                forecast out-of-sample.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={r2Config} style={{ height: 300 }} className='w-full'>
                <BarChart data={r2Rows} margin={{ left: -14 }}>
                  <CartesianGrid vertical={false} strokeDasharray='3 3' />
                  <XAxis dataKey='kod' tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} domain={[0, 0.6]} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <div className='flex w-full items-center justify-between gap-2'>
                            <span>{name === 'supply' ? 'R² Supply' : 'R² Demand'}</span>
                            <span className='font-mono font-medium'>{fmt1((value as number) * 100)}%</span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey='supply' fill={SUPPLY_COLOR} radius={3} maxBarSize={26} />
                  <Bar dataKey='demand' fill={DEMAND_COLOR} radius={3} maxBarSize={26} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Ketidakpastian Forecast 2040</CardTitle>
              <CardDescription>
                Lebar selang keyakinan 2040 relatif kepada ramalan titik (%); semakin besar nilai,
                semakin besar ketidakpastian relatif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={ciConfig} style={{ height: 300 }} className='w-full'>
                <BarChart data={ciRows} margin={{ left: -14 }}>
                  <CartesianGrid vertical={false} strokeDasharray='3 3' />
                  <XAxis dataKey='kod' tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} unit='%' />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <div className='flex w-full items-center justify-between gap-2'>
                            <span>{name === 'supply' ? 'CI Supply' : 'CI Demand'}</span>
                            <span className='font-mono font-medium'>{fmt1(value as number)}%</span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey='supply' fill={SUPPLY_COLOR} radius={3} maxBarSize={26} />
                  <Bar dataKey='demand' fill={DEMAND_COLOR} radius={3} maxBarSize={26} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-4 xl:grid-cols-2'>
          <Card>
            <CardHeader>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div>
                  <CardTitle className='text-base'>Penyusutan Momentum Dalaman</CardTitle>
                  <CardDescription>Ilustrasi φ^h — kesan kejutan masa lalu semakin kecil apabila horizon bertambah</CardDescription>
                </div>
                <Select value={decayKod} onValueChange={setDecayKod}>
                  <SelectTrigger className='w-[280px]'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobKeys.map((k) => (
                      <SelectItem key={k} value={k}>
                        {k} · {jobs[k].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ decay: { label: 'φ^h (%)', color: SUPPLY_COLOR } }}
                style={{ height: 260 }}
                className='w-full'
              >
                <LineChart data={decayRows} margin={{ left: -14 }}>
                  <CartesianGrid vertical={false} strokeDasharray='3 3' />
                  <XAxis dataKey='h' tickLine={false} axisLine={false} unit=' thn' />
                  <YAxis tickLine={false} axisLine={false} unit='%' />
                  <ChartTooltip content={<ChartTooltipContent indicator='line' />} />
                  <ReferenceLine y={100} stroke='hsl(var(--border))' />
                  <Line type='monotone' dataKey='decay' stroke={SUPPLY_COLOR} strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Korelasi Faktor Makro dengan Supply &amp; Demand</CardTitle>
              <CardDescription>
                Pekali korelasi sejarah 2015–2025 · korelasi tidak semestinya menunjukkan
                hubungan sebab-akibat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faktor Makro</TableHead>
                    <TableHead className='text-right'>Supply</TableHead>
                    <TableHead className='text-right'>Demand</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {corrRows.map((r) => (
                    <TableRow key={r.key}>
                      <TableCell className='font-medium'>{r.label}</TableCell>
                      <TableCell
                        className={cn(
                          'text-right tabular-nums',
                          r.supply >= 0.5
                            ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                            : r.supply <= -0.5
                              ? 'font-semibold text-red-600 dark:text-red-400'
                              : ''
                        )}
                      >
                        {fmt1(r.supply)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-right tabular-nums',
                          r.demand >= 0.5
                            ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                            : r.demand <= -0.5
                              ? 'font-semibold text-red-600 dark:text-red-400'
                              : ''
                        )}
                      >
                        {fmt1(r.demand)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Nota Metodologi &amp; Had Model</CardTitle>
            <CardDescription>Sumber: dashboard POC v3 — 7 nota asas dikekalkan</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className='list-decimal space-y-2 pl-5 text-sm text-muted-foreground'>
              <li>
                <span className='font-medium text-foreground'>Data sejarah.</span> Model menggunakan
                11 tahun pemerhatian, 2015–2025, bagi setiap pekerjaan.
              </li>
              <li>
                <span className='font-medium text-foreground'>PCA.</span> Enam pemboleh ubah makro
                distandardkan dan PC1 menerangkan 49.1% varians faktor makro. Loading digunakan
                semula dalam scenario simulator.
              </li>
              <li>
                <span className='font-medium text-foreground'>Struktur model.</span>{' '}
                SUPPLY/DEMAND diregresikan atas Indeks Kawalan Komposit, dengan ralat AR(1) pada
                siri terbeza (d=1), setara SARIMAX(1,1,0).
              </li>
              <li>
                <span className='font-medium text-foreground'>Scenario.</span> Scenario mengubah
                input makro, mengira semula indeks PCA dan menggunakan pekali exogenous b untuk
                mengukur perubahan daripada baseline. Ia ialah sensitiviti model, bukan kesan
                kausal.
              </li>
              <li>
                <span className='font-medium text-foreground'>Intervensi.</span> Gap Closure
                Simulator menggunakan kadar tambahan kompaun ke atas trajectory baseline untuk
                menguji berapa perubahan Demand/Supply diperlukan bagi menghampiri keseimbangan
                pada tahun sasaran.
              </li>
              <li>
                <span className='font-medium text-foreground'>Validasi.</span> R² exogenous dan
                lebar CI ialah diagnostik, bukan pengganti backtesting. Untuk penggunaan dasar
                berisiko tinggi, disyorkan rolling-origin / walk-forward validation dengan MAE,
                RMSE dan MAPE sebelum model dijadikan asas keputusan.
              </li>
              <li>
                <span className='font-medium text-foreground'>Kegunaan.</span> Dashboard sesuai
                sebagai alat sokongan perancangan scenario, keutamaan data dan pengesanan jurang;
                intervensi sebenar perlu ditriangulasi dengan data kekosongan jawatan, gaji,
                sektor, negeri, kemahiran dan mobiliti pekerja.
              </li>
            </ol>
            <div className='mt-4 flex flex-wrap gap-2'>
              <Badge variant='outline'>PCA variance: {fmt1(scenarioMeta.pca_variance * 100)}%</Badge>
              <Badge variant='outline'>SARIMAX(1,1,0) + exog</Badge>
              <Badge variant='outline'>6 faktor makro</Badge>
              <Badge variant='outline'>10 kod MASCO</Badge>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
