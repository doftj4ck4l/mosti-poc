import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SpmKpis } from './components/spm-kpis'
import { NationalCharts } from './components/national-charts'
import { SubjectProfile } from './components/subject-profile'
import { GpmpHeatmap } from './components/gpmp-heatmap'
import { SubjectTable } from './components/subject-table'
import { OutcomesChart } from './components/outcomes-chart'
import { ParticipationScatter } from './components/participation-scatter'
import { LocalityPanel } from './components/locality-panel'
import { SpmMethodology } from './components/spm-methodology'

export function SpmIntelligence() {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4'>
        <div className='space-y-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <h2 className='text-2xl font-bold tracking-tight'>Prestasi SPM</h2>
            <Badge variant='outline'>Lembaga Peperiksaan · KPM</Badge>
            <Badge variant='secondary'>95 mata pelajaran · 2018–2025</Badge>
          </div>
          <p className='text-muted-foreground'>
            Pemantauan prestasi nasional, trend mata pelajaran, outcome calon, penyertaan
            peperiksaan dan jurang lokaliti — hujung hulu rantaian bakat STEM.
          </p>
        </div>

        <SpmKpis />

        <Tabs defaultValue='nasional' className='space-y-4'>
          <TabsList className='flex-wrap'>
            <TabsTrigger value='nasional'>Ringkasan Nasional</TabsTrigger>
            <TabsTrigger value='subjek'>Mata Pelajaran</TabsTrigger>
            <TabsTrigger value='outcome'>Outcome Calon</TabsTrigger>
            <TabsTrigger value='penyertaan'>Penyertaan</TabsTrigger>
            <TabsTrigger value='lokaliti'>Bandar–Luar Bandar</TabsTrigger>
          </TabsList>

          <TabsContent value='nasional' className='space-y-4'>
            <NationalCharts />
            <SpmMethodology />
          </TabsContent>

          <TabsContent value='subjek' className='space-y-4'>
            <SubjectProfile />
            <GpmpHeatmap />
            <SubjectTable />
          </TabsContent>

          <TabsContent value='outcome' className='space-y-4'>
            <OutcomesChart />
            <SpmMethodology />
          </TabsContent>

          <TabsContent value='penyertaan' className='space-y-4'>
            <ParticipationScatter />
          </TabsContent>

          <TabsContent value='lokaliti' className='space-y-4'>
            <LocalityPanel />
            <SpmMethodology />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
