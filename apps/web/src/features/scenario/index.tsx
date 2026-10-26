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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { StatCard } from '@/components/stat-card'
import { MascoSelect } from '@/components/masco-select'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Info, Save } from 'lucide-react'
import {
  scenarioAggregate,
  scenarioForJob,
  jobs,
  indexOfYear,
  controlIndex,
  calcScenarioIndex,
  zeroChanges,
  type ScenarioChanges,
} from '@/lib/engine/masco'
import { fmt, fmt1, fmtSigned, fmt1Signed } from '@/lib/engine/format'
import { MacroSliders } from './components/macro-sliders'
import { ScenarioChart } from './components/scenario-chart'
import { ImpactTable } from './components/impact-table'
import { cn } from '@/lib/utils'

const HORIZONS = [2030, 2035, 2040] as const

export function Scenario() {
  const [kod, setKod] = useState('AGG')
  const [endY, setEndY] = useState<(typeof HORIZONS)[number]>(2030)
  const [changes, setChanges] = useState<ScenarioChanges>(zeroChanges())

  const isAgg = kod === 'AGG'
  const endIdx = indexOfYear(endY)

  const result = useMemo(
    () => (isAgg ? scenarioAggregate(endY, changes) : scenarioForJob(kod, endY, changes)),
    [kod, endY, changes, isAgg]
  )

  const baselineIndex = controlIndex[endIdx] ?? 0
  const scenarioIndex = calcScenarioIndex(endIdx, changes)
  const idxDelta = scenarioIndex - baselineIndex

  const bS = result.bs.at(-1) ?? 0
  const sS = result.ss.at(-1) ?? 0
  const bD = result.bd.at(-1) ?? 0
  const sD = result.sd.at(-1) ?? 0
  const bGap = bD - bS
  const sGap = sD - sS
  const gapImprove = Math.abs(bGap) - Math.abs(sGap)

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
            <h2 className='text-2xl font-bold tracking-tight'>Scenario Simulator</h2>
            <p className='text-muted-foreground'>
              Scenario berasaskan model · perubahan faktor makro mengubah Indeks Kawalan Komposit
              (PCA), kemudian kesan indikatif diterapkan menggunakan pekali exogenous model
            </p>
          </div>
          <Button
            variant='outline'
            onClick={() =>
              toast.success('Scenario disimpan ke log audit (mock — backend menyusul)', {
                description: `Horizon ${endY} · ${isAgg ? 'Sektor agregat' : 'MASCO ' + kod}`,
              })
            }
          >
            <Save className='size-4' /> Simpan Scenario
          </Button>
        </div>

        <Alert variant='destructive' className='border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100 [&>svg]:text-amber-600'>
          <Info className='size-4' />
          <AlertTitle>Scenario = what-if, bukan kausal</AlertTitle>
          <AlertDescription>
            Simulator mengubah input model untuk menguji implikasi, bukan membuktikan
            sebab-akibat. Apabila R² exog rendah, indeks makro menerangkan hanya sebahagian
            kecil variasi sejarah — baca sebagai sensitiviti model.
          </AlertDescription>
        </Alert>

        <div className='flex flex-wrap items-center gap-3'>
          <MascoSelect value={kod} onChange={setKod} />
          <div className='flex items-center gap-1 rounded-lg border p-1'>
            {HORIZONS.map((y) => (
              <Button
                key={y}
                size='sm'
                variant={endY === y ? 'default' : 'ghost'}
                onClick={() => setEndY(y)}
              >
                {y - 2025} tahun · {y}
              </Button>
            ))}
          </div>
          <Button size='sm' variant='ghost' onClick={() => setChanges(zeroChanges())}>
            Reset Scenario
          </Button>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            title={`Δ Supply pada ${endY}`}
            value={fmtSigned(sS - bS)}
            sub={`Baseline ${fmt(bS)} → Scenario ${fmt(sS)}`}
            good={sS - bS > 0.5}
            danger={sS - bS < -0.5}
          />
          <StatCard
            title={`Δ Demand pada ${endY}`}
            value={fmtSigned(sD - bD)}
            sub={`Baseline ${fmt(bD)} → Scenario ${fmt(sD)}`}
            good={sD - bD < -0.5 && bGap > 0}
            danger={sD - bD > 0.5 && bGap > 0}
          />
          <StatCard
            title={`Jurang Baseline ${endY}`}
            value={fmt(bGap)}
            sub={bGap > 0 ? 'defisit bekalan' : bGap < 0 ? 'lebihan bekalan' : 'seimbang'}
            danger={bGap > 0}
          />
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Jurang Selepas Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{fmt(sGap)}</div>
              <p
                className={cn(
                  'text-xs',
                  gapImprove > 0.5
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : gapImprove < -0.5
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-muted-foreground'
                )}
              >
                {Math.abs(gapImprove) < 0.5
                  ? 'Tiada perubahan ketara'
                  : gapImprove > 0
                    ? `Jurang mengecil sebanyak ${fmt(Math.abs(gapImprove))}`
                    : `Jurang melebar sebanyak ${fmt(Math.abs(gapImprove))}`}
              </p>
              <p className='mt-1 text-xs text-muted-foreground'>
                Indeks PCA: {fmt1(baselineIndex)} → {fmt1(scenarioIndex)} ({fmt1Signed(idxDelta)})
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>1. Ubah Andaian Faktor Makro</CardTitle>
            <CardDescription>
              Gerakkan slider dan lihat nilai faktor Baseline → Scenario pada tahun sasaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MacroSliders changes={changes} onChange={setChanges} endY={endY} />
          </CardContent>
        </Card>

        <ScenarioChart result={result} endY={endY} />

        <ImpactTable
          changes={changes}
          endY={endY}
          selectedKod={isAgg ? null : kod}
          onSelect={setKod}
        />

        <p className='text-xs text-muted-foreground'>
          Nota metodologi: {Object.values(jobs).length} pekerjaan · pekali exogenous b
          diterapkan pada Δ indeks PCA setiap tahun · scenario indikatif, bukan anggaran
          sebab-akibat.
        </p>
      </Main>
    </>
  )
}
