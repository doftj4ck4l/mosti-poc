import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { jobs, occupationRows } from '@/lib/engine/masco'

interface MascoSelectProps {
  value: string
  onChange: (v: string) => void
  includeAggregate?: boolean
  className?: string
}

export function MascoSelect({
  value,
  onChange,
  includeAggregate = true,
  className,
}: MascoSelectProps) {
  const rows = occupationRows(2040)
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className ?? 'w-[320px]'}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {includeAggregate && <SelectItem value='AGG'>Sektor Agregat (10 MASCO)</SelectItem>}
        {rows.map((r) => (
          <SelectItem key={r.kod} value={r.kod}>
            {r.kod} · {jobs[r.kod].name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
