import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { type ScenarioChanges, jobKeys, scenarioForJob } from '@/lib/engine/masco'
import { fmt, fmtSigned } from '@/lib/engine/format'

interface ImpactTableProps {
  changes: ScenarioChanges
  endY: number
  selectedKod: string | null
  onSelect: (kod: string) => void
}

export function ImpactTable({ changes, endY, selectedKod, onSelect }: ImpactTableProps) {
  const rows = jobKeys
    .map((k) => {
      const r = scenarioForJob(k, endY, changes)
      const bS = r.bs.at(-1) ?? 0
      const sS = r.ss.at(-1) ?? 0
      const bD = r.bd.at(-1) ?? 0
      const sD = r.sd.at(-1) ?? 0
      return {
        kod: k,
        bS,
        sS,
        dS: sS - bS,
        bD,
        sD,
        dD: sD - bD,
        gapB: bD - bS,
        gapS: sD - sS,
      }
    })
    .sort((a, b) => b.gapB - a.gapB)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Kesan Scenario Mengikut Semua Pekerjaan</CardTitle>
        <CardDescription>
          Perubahan angka pada tahun {endY} bagi semua pekerjaan MASCO · Baris biru ialah
          pekerjaan yang sedang dipilih
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kod</TableHead>
              <TableHead>Supply Baseline</TableHead>
              <TableHead>Supply Scenario</TableHead>
              <TableHead>Δ Supply</TableHead>
              <TableHead>Demand Baseline</TableHead>
              <TableHead>Demand Scenario</TableHead>
              <TableHead>Δ Demand</TableHead>
              <TableHead>Gap Baseline</TableHead>
              <TableHead>Gap Scenario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow
                key={r.kod}
                onClick={() => onSelect(r.kod)}
                className={cn(
                  'cursor-pointer',
                  selectedKod === r.kod && 'bg-sky-50 hover:bg-sky-50 dark:bg-sky-950/40'
                )}
              >
                <TableCell className='font-mono font-medium'>{r.kod}</TableCell>
                <TableCell className='tabular-nums'>{fmt(r.bS)}</TableCell>
                <TableCell className='tabular-nums'>{fmt(r.sS)}</TableCell>
                <TableCell
                  className={cn(
                    'tabular-nums',
                    Math.abs(r.dS) > 0.5 && r.dS > 0 && 'text-emerald-600 dark:text-emerald-400',
                    Math.abs(r.dS) > 0.5 && r.dS < 0 && 'text-red-600 dark:text-red-400'
                  )}
                >
                  {fmtSigned(r.dS)}
                </TableCell>
                <TableCell className='tabular-nums'>{fmt(r.bD)}</TableCell>
                <TableCell className='tabular-nums'>{fmt(r.sD)}</TableCell>
                <TableCell
                  className={cn(
                    'tabular-nums',
                    Math.abs(r.dD) > 0.5 && r.dD > 0 && 'text-emerald-600 dark:text-emerald-400',
                    Math.abs(r.dD) > 0.5 && r.dD < 0 && 'text-red-600 dark:text-red-400'
                  )}
                >
                  {fmtSigned(r.dD)}
                </TableCell>
                <TableCell className='tabular-nums'>{fmt(r.gapB)}</TableCell>
                <TableCell className='tabular-nums'>{fmt(r.gapS)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
