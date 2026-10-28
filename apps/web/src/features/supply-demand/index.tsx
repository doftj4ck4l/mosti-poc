import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PrintButton, Provenance } from '@/components/provenance'
import { SupplyDemandContent } from './components/content'

const routeApi = getRouteApi('/_authenticated/analytics/supply-demand/')

export function SupplyDemand() {
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <Provenance
            source='DDA Sektor E&E · Supply & Demand MASCO'
            owner='MASTIC · MOSTI'
            period='2015–2040'
            className='flex-1'
          />
          <PrintButton />
        </div>
        <SupplyDemandContent
          kod={search.kod}
          from={search.from}
          to={search.to}
          onChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }) })}
        />
      </Main>
    </>
  )
}
