import { useCallback } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  GROUP_LABELS,
  MEASURE_LABELS,
  SCOPE_LABELS,
} from '@/lib/engine/mismatch'
import type {
  MismatchGroup,
  MismatchMeasure,
  MismatchScope,
} from '@/lib/engine/mismatch-types'

const routeApi = getRouteApi('/_authenticated/analytics/mismatch/')

export function MismatchFilters() {
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const update = useCallback(
    (patch: Partial<{ scope: MismatchScope; grp: MismatchGroup; measure: MismatchMeasure }>) => {
      void navigate({ search: (prev) => ({ ...prev, ...patch }) })
    },
    [navigate]
  )

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-muted-foreground'>Skop</span>
        <Select value={search.scope} onValueChange={(v) => update({ scope: v as MismatchScope })}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SCOPE_LABELS) as MismatchScope[]).map((k) => (
              <SelectItem key={k} value={k}>
                {SCOPE_LABELS[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-muted-foreground'>Kumpulan</span>
        <Select value={search.grp} onValueChange={(v) => update({ grp: v as MismatchGroup })}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(GROUP_LABELS) as MismatchGroup[]).map((k) => (
              <SelectItem key={k} value={k}>
                {GROUP_LABELS[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-muted-foreground'>Ukuran</span>
        <Select
          value={search.measure}
          onValueChange={(v) => update({ measure: v as MismatchMeasure })}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(MEASURE_LABELS) as MismatchMeasure[]).map((k) => (
              <SelectItem key={k} value={k}>
                {MEASURE_LABELS[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => update({ scope: 'overall', grp: 'all', measure: 'ap' })}
      >
        Reset
      </Button>
    </div>
  )
}
