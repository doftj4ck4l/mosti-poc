import { Outlet, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PrintButton, Provenance } from '@/components/provenance'

export const Route = createFileRoute('/_authenticated/analytics/eande')({
  component: EandELayout,
})

const TABS = [
  { value: 'supply-demand', label: 'Supply & Demand' },
  { value: 'mismatch', label: 'Graduate Mismatch' },
  { value: 'strength', label: 'Supply Strength' },
]

function EandELayout() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const current = TABS.find((t) => pathname.endsWith(`/${t.value}`))?.value ?? 'supply-demand'

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-2xl font-bold tracking-tight'>E&amp;E Talent Intelligence</h2>
              <Provenance
                source='DDA E&E · SKPG'
                owner='MASTIC · MOSTI · KPT'
                period='2015–2040'
                status='ingested'
              />
            </div>
            <p className='text-muted-foreground'>
              Dua analisis E&amp;E di bawah satu modul: permintaan &amp; penawaran serta padanan
              graduan–pekerjaan, dengan penilaian kekuatan bekalan.
            </p>
          </div>
          <PrintButton />
        </div>

        <Tabs
          value={current}
          onValueChange={(v) => void navigate({ to: `/analytics/eande/${v}` })}
        >
          <TabsList className='flex-wrap print:hidden'>
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Outlet />
      </Main>
    </>
  )
}
