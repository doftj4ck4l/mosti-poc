import { useMemo } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  controlIndex,
  macroData,
  macroKeys,
  macroShortNames,
  years,
} from '@/lib/engine/masco'
import { downloadCsv, toCsv } from '@/lib/csv'
import { fmt1 } from '@/lib/engine/format'

export function MacroExplorer() {
  const rows = useMemo(
    () =>
      years.map((y, i) => {
        const row: Record<string, string | number> = { year: y }
        macroKeys.forEach((k) => {
          row[k] = macroData[k][i] ?? '—'
        })
        row.control = controlIndex[i] ?? '—'
        return row
      }),
    []
  )

  const exportCsv = () => {
    downloadCsv(
      'macro-series.csv',
      toCsv(
        ['Tahun', ...macroKeys.map((k) => macroShortNames[k]), 'Indeks Kawalan (PC1)'],
        rows.map((r) => [
          r.year,
          ...macroKeys.map((k) => (typeof r[k] === 'number' ? fmt1(r[k] as number) : '')),
          typeof r.control === 'number' ? fmt1(r.control) : '',
        ])
      )
    )
  }

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-muted-foreground'>
          Enam indikator makro (2015–2040) dan Indeks Kawalan Komposit (PC1) yang digunakan oleh
          model. Indeks hanya diterapkan pada tetingkap ramalan.
        </p>
        <Button variant='outline' size='sm' onClick={exportCsv}>
          <Download className='size-4' /> Eksport CSV
        </Button>
      </div>
      <div className='max-h-[560px] overflow-auto rounded-lg border'>
        <Table>
          <TableHeader className='sticky top-0 bg-background'>
            <TableRow>
              <TableHead className='sticky left-0 bg-background'>Tahun</TableHead>
              {macroKeys.map((k) => (
                <TableHead key={k} className='whitespace-nowrap'>
                  {macroShortNames[k]}
                </TableHead>
              ))}
              <TableHead>Indeks Kawalan (PC1)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.year}>
                <TableCell className='sticky left-0 bg-background font-medium tabular-nums'>
                  {r.year}
                </TableCell>
                {macroKeys.map((k) => (
                  <TableCell key={k} className='tabular-nums'>
                    {typeof r[k] === 'number' ? fmt1(r[k] as number) : '—'}
                    {k.includes('(RM)') && typeof r[k] === 'number'
                      ? ''
                      : typeof r[k] === 'number'
                        ? '%'
                        : ''}
                  </TableCell>
                ))}
                <TableCell className='tabular-nums'>
                  {typeof r.control === 'number' ? fmt1(r.control) : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className='text-xs text-muted-foreground'>
        {rows.length} tahun × {macroKeys.length} faktor makro · nilai sejarah 2015–2025, unjuran
        indikatif 2026–2040
      </p>
    </div>
  )
}
