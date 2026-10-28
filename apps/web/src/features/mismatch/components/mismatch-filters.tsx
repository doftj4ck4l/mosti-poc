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

interface MismatchFiltersProps {
  scope: MismatchScope
  grp: MismatchGroup
  measure: MismatchMeasure
  onChange: (patch: Partial<{ scope: MismatchScope; grp: MismatchGroup; measure: MismatchMeasure }>) => void
}

export function MismatchFilters({ scope, grp, measure, onChange }: MismatchFiltersProps) {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-muted-foreground'>Skop</span>
        <Select value={scope} onValueChange={(v) => onChange({ scope: v as MismatchScope })}>
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
        <Select value={grp} onValueChange={(v) => onChange({ grp: v as MismatchGroup })}>
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
        <Select value={measure} onValueChange={(v) => onChange({ measure: v as MismatchMeasure })}>
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
        onClick={() => onChange({ scope: 'overall', grp: 'all', measure: 'ap' })}
      >
        Reset
      </Button>
    </div>
  )
}
