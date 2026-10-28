import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Provenance } from '@/components/provenance'
import type {
  MismatchGroup,
  MismatchMeasure,
  MismatchScope,
} from '@/lib/engine/mismatch-types'
import { MismatchContent } from './components/content'

const routeApi = getRouteApi('/_authenticated/analytics/mismatch/')

export function GraduateMismatch() {
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
        <Provenance
          source='Sistem Kajian Pengesanan Graduan (SKPG)'
          owner='KPT · Analisis MASTIC'
          period='2018–2024'
        />
        <MismatchContent
          scope={search.scope as MismatchScope}
          grp={search.grp as MismatchGroup}
          measure={search.measure as MismatchMeasure}
          onChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }) })}
        />
      </Main>
    </>
  )
}
