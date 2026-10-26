import { createFileRoute } from '@tanstack/react-router'
import { SupplyDemand } from '@/features/supply-demand'

type SupplyDemandSearch = {
  kod?: string
  from?: number
  to?: number
}

const KODS = new Set([
  'AGG',
  '1223',
  '1321',
  '2141',
  '2151',
  '2152',
  '3113',
  '3114',
  '3122',
  '7412',
  '7421',
])

function validateSupplyDemandSearch(search: SupplyDemandSearch) {
  const from = typeof search.from === 'number' && search.from >= 2015 && search.from <= 2040 ? search.from : 2015
  const to = typeof search.to === 'number' && search.to >= 2015 && search.to <= 2040 ? search.to : 2040
  return {
    kod: KODS.has(search.kod ?? '') ? (search.kod as string) : 'AGG',
    from: Math.min(from, to),
    to: Math.max(from, to),
  }
}

export const Route = createFileRoute('/_authenticated/analytics/supply-demand/')({
  validateSearch: validateSupplyDemandSearch,
  component: SupplyDemand,
})
