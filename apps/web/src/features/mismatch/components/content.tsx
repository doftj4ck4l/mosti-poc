import { useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import {
  DIM_LABELS,
  MEASURE_LABELS,
  SOURCE_NOTE,
  getCut,
  getDataset,
  type MismatchDim,
} from '@/lib/engine/mismatch'
import type {
  MismatchGroup,
  MismatchMeasure,
  MismatchScope,
} from '@/lib/engine/mismatch-types'
import { MismatchFilters } from './mismatch-filters'
import { MismatchExtraKpis, MismatchKpis } from './mismatch-kpis'
import { CutBarChart } from './cut-bar-chart'
import { TrendChart } from './trend-chart'
import { CrossDonut } from './cross-donut'
import { StatusStackedChart } from './status-stacked-chart'
import { TopCoursesTable } from './top-courses-table'
import { GapMatrixTable } from './gap-matrix-table'

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

interface MismatchContentProps {
  scope: MismatchScope
  grp: MismatchGroup
  measure: MismatchMeasure
  onChange: (patch: Partial<{ scope: MismatchScope; grp: MismatchGroup; measure: MismatchMeasure }>) => void
}

export function MismatchContent({ scope, grp, measure, onChange }: MismatchContentProps) {
  const ds = useMemo(() => getDataset(scope, grp), [scope, grp])

  return (
    <div className='flex flex-col gap-4'>
      <div className='space-y-2'>
        <h3 className='text-xl font-bold tracking-tight'>
          Papan Pemuka Ketidaksepadanan Graduan
        </h3>
        <p className='text-sm text-muted-foreground'>
          Kemahiran &amp; Bidang Pekerjaan · Kajian Pengesanan Graduan · Bidang E&amp;E dan
          Berkaitan (NEC) · 2018–2024
        </p>
      </div>

      <MismatchFilters
        scope={scope}
        grp={grp}
        measure={measure}
        onChange={onChange}
      />

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
    </div>
  )
}
