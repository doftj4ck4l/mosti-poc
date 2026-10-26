import { useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table'
import { Download, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DIM_LABELS,
  GROUP_LABELS,
  MEASURE_LABELS,
  SCOPE_LABELS,
  getDataset,
  type MismatchDim,
} from '@/lib/engine/mismatch'
import type {
  MismatchCategory,
  MismatchGroup,
  MismatchMeasure,
  MismatchScope,
  MismatchSummary,
} from '@/lib/engine/mismatch-types'
import { downloadCsv, toCsv } from '@/lib/csv'
import { fmt1 } from '@/lib/engine/format'

const routeApi = getRouteApi('/_authenticated/data/')

interface FlatRow {
  dim: string
  label: string
  n: number
  vp: number
  hp: number
  dp: number
  ap: number
}

const DIM_ORDER: MismatchDim[] = [
  'tahun',
  'peringkat',
  'institusi',
  'sektor_ekonomi',
  'sektor_pekerjaan',
  'kumpulan',
  'income',
  'gpa',
  'nec',
  'jawatan',
  'negeri',
  'kursus',
]

const DIM_KEY_MAP: Record<MismatchDim, keyof MismatchSummary> = {
  tahun: 'by_tahun',
  peringkat: 'by_peringkat',
  institusi: 'by_institusi',
  sektor_ekonomi: 'by_sektor_ekonomi',
  sektor_pekerjaan: 'by_sektor_pekerjaan',
  kumpulan: 'by_kumpulan',
  income: 'by_income',
  gpa: 'by_gpa',
  nec: 'by_nec',
  jawatan: 'by_jawatan',
  negeri: 'by_negeri',
  kursus: 'top_kursus',
}

const columns: ColumnDef<FlatRow>[] = [
  { accessorKey: 'dim', header: 'Dimensi', filterFn: 'equalsString' },
  { accessorKey: 'label', header: 'Kategori' },
  {
    accessorKey: 'n',
    header: 'Bil. Dinilai',
    cell: ({ row }) => (
      <span className='tabular-nums'>{row.original.n.toLocaleString('en-US')}</span>
    ),
  },
  {
    accessorKey: 'vp',
    header: 'Menegak %',
    cell: ({ row }) => <span className='tabular-nums'>{fmt1(row.original.vp)}%</span>,
  },
  {
    accessorKey: 'hp',
    header: 'Mendatar %',
    cell: ({ row }) => <span className='tabular-nums'>{fmt1(row.original.hp)}%</span>,
  },
  {
    accessorKey: 'dp',
    header: 'Kedua-dua %',
    cell: ({ row }) => <span className='tabular-nums'>{fmt1(row.original.dp)}%</span>,
  },
  {
    accessorKey: 'ap',
    header: 'Mana-mana %',
    cell: ({ row }) => (
      <span className='font-medium tabular-nums'>{fmt1(row.original.ap)}%</span>
    ),
  },
]

export function CutsExplorer() {
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const ds = getDataset(search.scope as MismatchScope, search.grp as MismatchGroup)

  const rows: FlatRow[] = useMemo(() => {
    const out: FlatRow[] = []
    for (const dim of DIM_ORDER) {
      const cats = ds[DIM_KEY_MAP[dim]] as unknown as MismatchCategory[]
      for (const c of cats) {
        out.push({
          dim: DIM_LABELS[dim],
          label: c.label,
          n: c.n,
          vp: c.vp,
          hp: c.hp,
          dp: c.dp,
          ap: c.ap,
        })
      }
    }
    return out
  }, [ds])

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const dimValues = useMemo(() => Array.from(new Set(rows.map((r) => r.dim))), [rows])
  const dimFilter = (table.getColumn('dim')?.getFilterValue() as string) ?? 'ALL'

  const exportCsv = () => {
    const filtered = table.getFilteredRowModel().rows
    downloadCsv(
      'mismatch-cuts.csv',
      toCsv(
        [
          'Dimensi',
          'Kategori',
          'Bil. Dinilai',
          'Menegak %',
          'Mendatar %',
          'Kedua-dua %',
          'Mana-mana %',
        ],
        filtered.map((r) => [
          r.original.dim,
          r.original.label,
          r.original.n,
          fmt1(r.original.vp),
          fmt1(r.original.hp),
          fmt1(r.original.dp),
          fmt1(r.original.ap),
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
            placeholder='Cari kategori…'
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className='w-[220px] pl-8'
          />
        </div>
        <Select
          value={dimFilter}
          onValueChange={(v) =>
            table.getColumn('dim')?.setFilterValue(v === 'ALL' ? undefined : v)
          }
        >
          <SelectTrigger className='w-[230px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>Semua Dimensi</SelectItem>
            {dimValues.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className='flex items-center gap-2'>
          <Select
            value={search.scope}
            onValueChange={(v) => void navigate({ search: (p) => ({ ...p, scope: v }) })}
          >
            <SelectTrigger className='w-[160px]'>
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
          <Select
            value={search.grp}
            onValueChange={(v) => void navigate({ search: (p) => ({ ...p, grp: v }) })}
          >
            <SelectTrigger className='w-[170px]'>
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
          <Select
            value={search.measure}
            onValueChange={(v) => void navigate({ search: (p) => ({ ...p, measure: v }) })}
          >
            <SelectTrigger className='w-[150px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(['vp', 'hp', 'dp', 'ap'] as MismatchMeasure[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {MEASURE_LABELS[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                    className={h.column.getCanSort() ? 'cursor-pointer select-none' : ''}
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
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center text-muted-foreground'
                >
                  Tiada hasil.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((r) => (
                <TableRow key={r.id}>
                  {r.getVisibleCells().map((c) => (
                    <TableCell key={c.id}>
                      {flexRender(c.column.columnDef.cell, c.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className='text-xs text-muted-foreground'>
        {table.getFilteredRowModel().rows.length} daripada {rows.length} baris · Sumber: SKPG
        2018–2024 (Graduan E&amp;E dan Berkaitan, NEC) · kadar ke atas graduan bekerja dengan
        klasifikasi sah
      </p>
    </div>
  )
}
