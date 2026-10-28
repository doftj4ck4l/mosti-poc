import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SupplyDemandContent } from '@/features/supply-demand/components/content'

export const Route = createFileRoute('/_authenticated/analytics/eande/supply-demand')({
  component: EandESupplyDemand,
})

function EandESupplyDemand() {
  const [filters, setFilters] = useState({ kod: 'AGG', from: 2015, to: 2040 })
  return (
    <SupplyDemandContent
      kod={filters.kod}
      from={filters.from}
      to={filters.to}
      onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
    />
  )
}
