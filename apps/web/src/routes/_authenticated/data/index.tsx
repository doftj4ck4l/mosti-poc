import { createFileRoute } from '@tanstack/react-router'
import { DataExplorer } from '@/features/data-explorer'

type DataSearch = {
  scope?: string
  grp?: string
  measure?: string
}

const SCOPES = new Set(['overall', 'manufacturing'])
const GRPS = new Set(['all', 'tvet', 'ipt'])
const MEASURES = new Set(['vp', 'hp', 'dp', 'ap'])

function validateDataSearch(search: DataSearch) {
  return {
    scope: SCOPES.has(search.scope ?? '') ? (search.scope as string) : 'overall',
    grp: GRPS.has(search.grp ?? '') ? (search.grp as string) : 'all',
    measure: MEASURES.has(search.measure ?? '') ? (search.measure as string) : 'ap',
  }
}

export const Route = createFileRoute('/_authenticated/data/')({
  validateSearch: validateDataSearch,
  component: DataExplorer,
})
