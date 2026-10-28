import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { Download, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { downloadCsv, toCsv } from '@/lib/csv'
import { fmt, fmt1, fmt2, fmt2Signed } from '@/lib/engine/format'
import { cn } from '@/lib/utils'
import {
  GROUP_LABELS,
  groupCodes,
  subjectName,
  subjects,
  delta,
} from '../lib/spm'

interface Row {
  code: string
  name: string
  gpmp: number | null
  d1: number | null
  d3: number | null
  candidates: number
  creditPlus: number | null
  fail: number | null
}

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'code', header: 'Kod' },
  { accessorKey: 'name', header: 'Mata Pelajaran' },
  {
    accessorKey: 'gpmp',
    header: 'GPMP 2025',
    cell: ({ row }) => <span className='tabular-nums'>{fmt2(row.original.gpmp)}</span>,
  },
  {
    accessorKey: 'd1',
    header: 'Δ 1 tahun',
    cell: ({ row }) => (
      <DeltaCell value={row.original.d1} lowerBetter />
    ),
  },
  {
    accessorKey: 'd3',
    header: 'Δ 3 tahun',
    cell: ({ row }) => (
      <DeltaCell value={row.original.d3} lowerBetter />
    ),
  },
  {
    accessorKey: 'candidates',
    header: 'Calon 2025',
    cell: ({ row }) => <span className='tabular-nums'>{fmt(row.original.candidates)}</span>,
  },
  {
    accessorKey: 'creditPlus',
    header: 'Kepujian+ %',
    cell: ({ row }) => <span className='tabular-nums'>{fmt1(row.original.creditPlus)}%</span>,
  },
  {
    accessorKey: 'fail',
    header: 'Gagal %',
    cell: ({ row }) => <span className='tabular-nums'>{fmt1(row.original.fail)}%</span>,
  },
]

function DeltaCell({ value, lowerBetter }: { value: number | null; lowerBetter?: boolean }) {
  if (value === null) return <span className='text-muted-foreground'>—</span>
  const good = lowerBetter ? value < 0 : value > 0
  return (
    <span
      className={cn(
        'tabular-nums',
        Math.abs(value) < 0.005
          ? 'text-muted-foreground'
          : good
            ? 'font-medium text-emerald-600 dark:text-emerald-400'
            : 'font-medium text-red-600 dark:text-red-400'
      )}
    >
      {fmt2Signed(value)}
    </span>
  )
}

export function SubjectTable() {
  const [group, setGroup] = useState('all')
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'candidates', desc: true }])

  const rows: Row[] = useMemo(
    () =>
      groupCodes(group).map((code) => {
        const s = subjects[code]
        return {
          code,
          name: subjectName(code),
          gpmp: s.series['2025']?.gpmp ?? null,
          d1: delta(code, 'gpmp', 2024, 2025),
          d3: delta(code, 'gpmp', 2022, 2025),
          candidates: s.series['2025']?.candidates ?? 0,
          creditPlus: s.series['2025']?.credit_plus_pct ?? null,
          fail: s.series['2025']?.fail ?? null,
        }
      }),
    [group]
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const exportCsv = () => {
    downloadCsv(
      'spm-subjects-2025.csv',
      toCsv(
        ['Kod', 'Mata Pelajaran', 'GPMP 2025', 'Delta 1 tahun', 'Delta 3 tahun', 'Calon 2025', 'Kepujian+ %', 'Gagal %'],
        table.getFilteredRowModel().rows.map((r) => [
          r.original.code,
          r.original.name,
          fmt2(r.original.gpmp),
          fmt2(r.original.d1),
          fmt2(r.original.d3),
          r.original.candidates,
          fmt1(r.original.creditPlus),
          fmt1(r.original.fail),
        ])
      )
    )
  }

  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap items-center gap-2'>
        <div className='relative'>
          <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
          <Input
            placeholder='Cari mata pelajaran…'
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className='w-[240px] pl-8'
          />
        </div>
        <Select value={group} onValueChange={setGroup}>
          <SelectTrigger className='w-[200px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(GROUP_LABELS).map(([k, label]) => (
              <SelectItem key={k} value={k}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant='outline' size='sm' className='ml-auto' onClick={exportCsv}>
          <Download className='size-4' /> Eksport CSV
        </Button>
      </div>

      <div className='max-h-[560px] overflow-auto rounded-lg border'>
        <Table>
          <TableHeader className='sticky top-0 bg-background'>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    className={cn('whitespace-nowrap', h.column.getCanSort() && 'cursor-pointer select-none')}
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {{ asc: ' ↑', desc: ' ↓' }[h.column.getIsSorted() as string] ?? ''}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((r) => (
              <TableRow key={r.id}>
                {r.getVisibleCells().map((c) => (
                  <TableCell key={c.id}>
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className='text-xs text-muted-foreground'>
        {table.getFilteredRowModel().rows.length} mata pelajaran · Δ GPMP negatif = pencapaian
        bertambah baik · nilai Gagal/Kepujian ialah anggaran daripada peratusan laporan × calon
        menduduki
      </p>
    </div>
  )
}
