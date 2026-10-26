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
import { Badge } from '@/components/ui/badge'
import { buildRows } from './supply-demand-chart'
import { fmt, fmt1 } from '@/lib/engine/format'
import { cn } from '@/lib/utils'

interface TrendTableProps {
  kod: string
  from: number
  to: number
}

export function TrendTable({ kod, from, to }: TrendTableProps) {
  const rows = buildRows(kod, from, to)
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Jadual Trend Tahunan</CardTitle>
        <CardDescription>
          Nilai tahunan dengan kadar perubahan tahun-ke-tahun (YoY) dan nisbah Demand/Supply
        </CardDescription>
      </CardHeader>
      <CardContent className='max-h-[460px] overflow-y-auto'>
        <Table>
          <TableHeader className='sticky top-0 bg-background'>
            <TableRow>
              <TableHead>Tahun</TableHead>
              <TableHead className='text-right'>Supply</TableHead>
              <TableHead className='text-right'>YoY Supply</TableHead>
              <TableHead className='text-right'>Demand</TableHead>
              <TableHead className='text-right'>YoY Demand</TableHead>
              <TableHead className='text-right'>Jurang</TableHead>
              <TableHead className='text-right'>Nisbah D/S</TableHead>
              <TableHead className='text-right'>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => {
              const prev = i > 0 ? rows[i - 1] : null
              const yoyS = prev && prev.s ? ((r.s - prev.s) / prev.s) * 100 : null
              const yoyD = prev && prev.d ? ((r.d - prev.d) / prev.d) * 100 : null
              return (
                <TableRow key={r.year}>
                  <TableCell className='font-medium'>
                    {r.year}
                    {r.yearNum >= 2026 && (
                      <Badge variant='outline' className='ml-2 text-[10px]'>
                        ramalan
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>{fmt(r.s)}</TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {yoyS === null ? '—' : `${yoyS > 0 ? '+' : ''}${fmt1(yoyS)}%`}
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>{fmt(r.d)}</TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {yoyD === null ? '—' : `${yoyD > 0 ? '+' : ''}${fmt1(yoyD)}%`}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-medium tabular-nums',
                      r.gap > 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    )}
                  >
                    {fmt(r.gap)}
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {r.s ? fmt1(r.d / r.s) : '—'}
                  </TableCell>
                  <TableCell className='text-right'>
                    {r.gap > 0 ? (
                      <Badge variant='destructive' className='text-[10px]'>
                        defisit
                      </Badge>
                    ) : (
                      <Badge variant='secondary' className='text-[10px]'>
                        lebihan
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
