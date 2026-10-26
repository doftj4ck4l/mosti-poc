import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DIM_LABELS,
  gapRows,
  type MismatchDim,
} from '@/lib/engine/mismatch'
import type { MismatchMeasure, MismatchScope } from '@/lib/engine/mismatch-types'
import { fmt, fmt1 } from '@/lib/engine/format'
import { cn } from '@/lib/utils'

const GAP_DIMS: MismatchDim[] = [
  'sektor_ekonomi',
  'kumpulan',
  'income',
  'peringkat',
  'negeri',
  'nec',
]

interface GapMatrixTableProps {
  scope: MismatchScope
  measure: MismatchMeasure
}

export function GapMatrixTable({ scope, measure }: GapMatrixTableProps) {
  const [dim, setDim] = useState<MismatchDim>('sektor_ekonomi')
  const rows = gapRows(scope, dim, measure)

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div>
            <CardTitle className='text-base'>Jadual Jurang TVET − IPT</CardTitle>
            <CardDescription>
              Nilai positif bermakna kadar ketidaksepadanan TVET lebih tinggi. Sel dikira hanya
              jika kedua-dua kumpulan mempunyai sekurang-kurangnya 200 graduan dinilai.
            </CardDescription>
          </div>
          <Select value={dim} onValueChange={(v) => setDim(v as MismatchDim)}>
            <SelectTrigger className='w-[240px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GAP_DIMS.map((d) => (
                <SelectItem key={d} value={d}>
                  {DIM_LABELS[d]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className='py-8 text-center text-sm text-muted-foreground'>
            Tiada kategori memenuhi ambang 200 graduan bagi kedua-dua kumpulan.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategori</TableHead>
                <TableHead className='text-right'>Bil. TVET</TableHead>
                <TableHead className='text-right'>Bil. IPT</TableHead>
                <TableHead className='text-right'>TVET %</TableHead>
                <TableHead className='text-right'>IPT %</TableHead>
                <TableHead className='text-right'>Jurang (mata %)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.label}>
                  <TableCell className='font-medium'>{r.label}</TableCell>
                  <TableCell className='text-right tabular-nums'>{fmt(r.tvetN)}</TableCell>
                  <TableCell className='text-right tabular-nums'>{fmt(r.iptN)}</TableCell>
                  <TableCell className='text-right tabular-nums'>{fmt1(r.tvetPct)}%</TableCell>
                  <TableCell className='text-right tabular-nums'>{fmt1(r.iptPct)}%</TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-medium tabular-nums',
                      r.gapPp > 0
                        ? 'text-red-600 dark:text-red-400'
                        : r.gapPp < 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : ''
                    )}
                  >
                    {r.gapPp > 0 ? '+' : ''}
                    {fmt1(r.gapPp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
