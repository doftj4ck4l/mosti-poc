import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SupplyStrength } from '@/features/supply-strength'
import type { MismatchGroup, MismatchScope } from '@/lib/engine/mismatch-types'

export const Route = createFileRoute('/_authenticated/analytics/eande/strength')({
  component: EandEStrength,
})

function EandEStrength() {
  const [filters, setFilters] = useState<{ scope: MismatchScope; grp: MismatchGroup }>({
    scope: 'overall',
    grp: 'all',
  })
  return (
    <SupplyStrength
      scope={filters.scope}
      grp={filters.grp}
      onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
    />
  )
}
