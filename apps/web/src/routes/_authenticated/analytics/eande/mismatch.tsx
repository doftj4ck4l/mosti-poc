import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { MismatchContent } from '@/features/mismatch/components/content'
import type { MismatchGroup, MismatchMeasure, MismatchScope } from '@/lib/engine/mismatch-types'

export const Route = createFileRoute('/_authenticated/analytics/eande/mismatch')({
  component: EandEMismatch,
})

function EandEMismatch() {
  const [filters, setFilters] = useState<{
    scope: MismatchScope
    grp: MismatchGroup
    measure: MismatchMeasure
  }>({ scope: 'overall', grp: 'all', measure: 'ap' })
  return (
    <MismatchContent
      scope={filters.scope}
      grp={filters.grp}
      measure={filters.measure}
      onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
    />
  )
}
