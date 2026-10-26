import { getRouteApi } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Database } from 'lucide-react'
import { CutsExplorer } from './components/cuts-table'
import { MacroExplorer } from './components/macro-table'

const routeApi = getRouteApi('/_authenticated/data/')

export function DataExplorer() {
  const search = routeApi.useSearch()

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4'>
        <div className='flex items-center gap-2'>
          <Database className='size-6 text-muted-foreground' />
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Data Explorer</h2>
            <p className='text-muted-foreground'>
              Penerokaan data di sebalik dashboard — potongan ketidaksepadanan dan siri makro
            </p>
          </div>
        </div>

        <Tabs defaultValue='cuts' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='cuts'>Potongan Ketidaksepadanan</TabsTrigger>
            <TabsTrigger value='macro'>Siri Makro &amp; Indeks</TabsTrigger>
          </TabsList>
          <TabsContent value='cuts'>
            <CutsExplorer key={`${search.scope}-${search.grp}-${search.measure}`} />
          </TabsContent>
          <TabsContent value='macro'>
            <MacroExplorer />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
