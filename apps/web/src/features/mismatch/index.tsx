import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Info } from 'lucide-react'
import { DIM_LABELS, MEASURE_LABELS, type MismatchDim, SOURCE_NOTE, getCut, getDataset } from '@/lib/engine/mismatch'
import type {
  MismatchGroup,
  MismatchMeasure,
  MismatchScope,
} from '@/lib/engine/mismatch-types'
import { MismatchFilters } from './components/mismatch-filters'
import { MismatchExtraKpis, MismatchKpis } from './components/mismatch-kpis'
import { CutBarChart } from './components/cut-bar-chart'
import { TrendChart } from './components/trend-chart'
import { CrossDonut } from './components/cross-donut'
import { StatusStackedChart } from './components/status-stacked-chart'
import { TopCoursesTable } from './components/top-courses-table'
import { GapMatrixTable } from './components/gap-matrix-table'

const routeApi = getRouteApi('/_authenticated/analytics/mismatch/')

const CUTS: MismatchDim[] = [
  'peringkat',
  'institusi',
  'sektor_ekonomi',
  'sektor_pekerjaan',
  'kumpulan',
  'income',
  'gpa',
  'jawatan',
  'nec',
  'negeri',
]

export function GraduateMismatch() {
  const search = routeApi.useSearch()
  const scope = search.scope as MismatchScope
  const grp = search.grp as MismatchGroup
  const measure = search.measure as MismatchMeasure
  const ds = useMemo(() => getDataset(scope, grp), [scope, grp])

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Papan Pemuka Ketidaksepadanan Graduan
          </h2>
          <p className='text-muted-foreground'>
            Kemahiran &amp; Bidang Pekerjaan · Kajian Pengesanan Graduan · Bidang E&amp;E dan
            Berkaitan (NEC) · 2018–2024
          </p>
        </div>

        <MismatchFilters />

        <MismatchKpis ds={ds} />
        <MismatchExtraKpis ds={ds} />

        <Tabs defaultValue='ringkasan' className='space-y-4'>
          <TabsList className='flex-wrap'>
            <TabsTrigger value='ringkasan'>Ringkasan</TabsTrigger>
            <TabsTrigger value='potongan'>Potongan Terperinci</TabsTrigger>
            <TabsTrigger value='kursus'>Kursus &amp; Jurang</TabsTrigger>
            <TabsTrigger value='silang'>Silang &amp; Status</TabsTrigger>
          </TabsList>

          <TabsContent value='ringkasan' className='grid gap-4 xl:grid-cols-2'>
            <TrendChart categories={ds.by_tahun} measure={measure} />
            <CrossDonut
              dataset={ds}
              title='Silang Menegak × Mendatar'
              description={`Pecahan graduan mengikut gabungan status kedua-dua jenis ketidaksepadanan · ${MEASURE_LABELS[measure]} · asas ${ds.n.toLocaleString('en-US')} graduan`}
            />
            <Alert className='xl:col-span-2'>
              <Info className='size-4' />
              <AlertTitle>Nota metodologi</AlertTitle>
              <AlertDescription className='text-xs leading-relaxed'>
                {SOURCE_NOTE}
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value='potongan' className='grid gap-4 xl:grid-cols-2'>
            {CUTS.map((dim) => (
              <CutBarChart
                key={dim}
                title={`Mengikut ${DIM_LABELS[dim]}`}
                description='Bar ungu = Menegak % · Bar kuning = Mendatar %'
                categories={getCut(ds, dim)}
                measure={measure}
                horizontal
              />
            ))}
          </TabsContent>

          <TabsContent value='kursus' className='grid gap-4'>
            <TopCoursesTable courses={ds.top_kursus} />
            <GapMatrixTable scope={scope} measure={measure} />
          </TabsContent>

          <TabsContent value='silang' className='grid gap-4 xl:grid-cols-2'>
            <CrossDonut
              dataset={ds}
              title='Pecahan Status Keseluruhan'
              description='Sepadan vs tidak sepadan (sebarang jenis) bagi skop & kumpulan terpilih'
            />
            <StatusStackedChart dataset={ds} measure={measure} />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
