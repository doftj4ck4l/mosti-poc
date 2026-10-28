import { createFileRoute } from '@tanstack/react-router'
import { SupplyDemandContent } from '@/features/supply-demand/components/content'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/analytics/eande/')({
  component: EandEIndex,
})

function EandEIndex() {
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
