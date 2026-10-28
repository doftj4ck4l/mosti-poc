import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { Download } from 'lucide-react'
import { downloadCsv, toCsv } from '@/lib/csv'
import { fmt, fmt1 } from '@/lib/engine/format'
import { cn } from '@/lib/utils'
import {
  GROUP_LABELS,
  SCOPE_LABELS,
  getDataset,
} from '@/lib/engine/mismatch'
import type {
  MismatchGroup,
  MismatchScope,
} from '@/lib/engine/mismatch-types'

const FUNNEL_COLORS = ['#0B2E63', '#1C4B86', '#287A5A', '#2C6E9B', '#A4681B', '#B24A56']

function riskTier(score: number): { label: string; cls: string } {
  if (score >= 12000) return { label: 'Tinggi', cls: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' }
  if (score >= 4000) return { label: 'Sederhana', cls: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300' }
  return { label: 'Rendah', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' }
}

interface SupplyStrengthProps {
  scope: MismatchScope
  grp: MismatchGroup
  onChange: (patch: Partial<{ scope: MismatchScope; grp: MismatchGroup }>) => void
}

export function SupplyStrength({ scope, grp, onChange }: SupplyStrengthProps) {
  const ds = useMemo(() => getDataset(scope, grp), [scope, grp])
  const [dim, setDim] = useState<'nec' | 'sektor_ekonomi' | 'peringkat'>('nec')

  const funnel = [
    { label: 'Graduan E&E (rekod)', value: ds.graduan },
    { label: 'Bekerja', value: ds.bekerja },
    { label: 'Asas analisis (klasifikasi sah)', value: ds.n },
    { label: 'Sepadan', value: ds.none },
    { label: 'Tidak sepadan (mana-mana)', value: ds.a },
  ]
  const max = Math.max(...funnel.map((f) => f.value), 1)

  const dimKey =
    dim === 'nec' ? 'by_nec' : dim === 'sektor_ekonomi' ? 'by_sektor_ekonomi' : 'by_peringkat'
  const rows = useMemo(() => {
    const items = ds[dimKey] as unknown as {
      label: string
      n: number
      a: number
      vp: number
      hp: number
      ap: number
    }[]
    return items
      .map((c) => ({
        label: c.label,
        supply: c.n,
        matched: c.n - c.a,
        vertical: c.vp,
        horizontal: c.hp,
        any: c.ap,
        atRisk: Math.round((c.n * c.ap) / 100),
      }))
      .sort((x, y) => y.atRisk - x.atRisk)
  }, [ds, dimKey])

  const totalSupply = rows.reduce((a, r) => a + r.supply, 0) || 1

  const exportCsv = () => {
    downloadCsv(
      'kekuatan-bekalan-nec.csv',
      toCsv(
        ['Kategori', 'Bekalan (n)', 'Sepadan', 'Menegak %', 'Mendatar %', 'Mana-mana %', 'Berisiko (anggaran)'],
        rows.map((r) => [r.label, r.supply, r.matched, fmt1(r.vertical), fmt1(r.horizontal), fmt1(r.any), r.atRisk])
      )
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='space-y-1'>
        <h3 className='text-xl font-bold tracking-tight'>Kekuatan Bekalan Graduan E&amp;E</h3>
        <p className='text-sm text-muted-foreground'>
          Menilai keupayaan Malaysia menyediakan graduan E&amp;E serta sejauh mana bekalan tersebut
          diserap dalam bidang dan tahap kemahiran yang bersesuaian.
        </p>
      </div>

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
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Corong Kekuatan Bekalan Graduan E&amp;E</CardTitle>
          <CardDescription>
            Graduan → bekerja → asas analisis → sepadan / tidak sepadan · kadar dikira ke atas
            graduan bekerja dengan klasifikasi sah
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          {funnel.map((f, i) => {
            const pctOfGraduates = (f.value / (funnel[0].value || 1)) * 100
            return (
              <div key={f.label} className='space-y-1'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='font-medium'>{f.label}</span>
                  <span className='tabular-nums text-muted-foreground'>
                    {fmt(f.value)} ({fmt1(pctOfGraduates)}%)
                  </span>
                </div>
                <div className='h-6 w-full overflow-hidden rounded-md bg-muted'>
                  <div
                    className='flex h-full items-center rounded-md px-2 text-[10px] font-medium text-white'
                    style={{
                      width: `${Math.max(4, (f.value / max) * 100)}%`,
                      backgroundColor: FUNNEL_COLORS[i % FUNNEL_COLORS.length],
                    }}
                  >
                    {fmt1(pctOfGraduates)}%
                  </div>
                </div>
              </div>
            )
          })}
          <div className='mt-3 grid gap-2 text-xs sm:grid-cols-3'>
            <div className='rounded-md border p-2'>
              <p className='text-muted-foreground'>Menegak sahaja</p>
              <p className='font-medium tabular-nums'>
                {fmt(ds.onlyv)} ({fmt1((ds.onlyv / (ds.n || 1)) * 100)}%)
              </p>
            </div>
            <div className='rounded-md border p-2'>
              <p className='text-muted-foreground'>Mendatar sahaja</p>
              <p className='font-medium tabular-nums'>
                {fmt(ds.onlyh)} ({fmt1((ds.onlyh / (ds.n || 1)) * 100)}%)
              </p>
            </div>
            <div className='rounded-md border p-2'>
              <p className='text-muted-foreground'>Kedua-dua</p>
              <p className='font-medium tabular-nums'>
                {fmt(ds.dual)} ({fmt1(ds.dp)}%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div>
              <CardTitle className='text-base'>Keberkesanan Bekalan &amp; Tahap Risiko</CardTitle>
              <CardDescription>
                Menggabungkan saiz bekalan dan kadar ketidaksepadanan — bidang dengan bilangan
                graduan besar serta kadar tinggi perlu perhatian utama
              </CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              <Select value={dim} onValueChange={(v) => setDim(v as typeof dim)}>
                <SelectTrigger className='w-[200px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='nec'>Kategori NEC</SelectItem>
                  <SelectItem value='sektor_ekonomi'>Sektor Ekonomi</SelectItem>
                  <SelectItem value='peringkat'>Peringkat Pengajian</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' size='sm' onClick={exportCsv}>
                <Download className='size-4' /> CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategori</TableHead>
                <TableHead className='text-right'>Bekalan</TableHead>
                <TableHead className='text-right'>Bahagian</TableHead>
                <TableHead className='text-right'>Sepadan</TableHead>
                <TableHead className='text-right'>Menegak %</TableHead>
                <TableHead className='text-right'>Mendatar %</TableHead>
                <TableHead className='text-right'>Mana-mana %</TableHead>
                <TableHead className='text-right'>Berisiko</TableHead>
                <TableHead className='text-right'>Tahap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const tier = riskTier(r.atRisk)
                return (
                  <TableRow key={r.label}>
                    <TableCell className='max-w-[280px] truncate font-medium' title={r.label}>
                      {r.label}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>{fmt(r.supply)}</TableCell>
                    <TableCell className='text-right tabular-nums text-muted-foreground'>
                      {fmt1((r.supply / totalSupply) * 100)}%
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>{fmt(r.matched)}</TableCell>
                    <TableCell className='text-right tabular-nums'>{fmt1(r.vertical)}%</TableCell>
                    <TableCell className='text-right tabular-nums'>{fmt1(r.horizontal)}%</TableCell>
                    <TableCell className='text-right font-medium tabular-nums'>{fmt1(r.any)}%</TableCell>
                    <TableCell className='text-right tabular-nums'>{fmt(r.atRisk)}</TableCell>
                    <TableCell className='text-right'>
                      <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium', tier.cls)}>
                        {tier.label}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <p className='mt-3 text-xs text-muted-foreground'>
            “Berisiko” ialah anggaran bilangan graduan tidak sepadan (bekalan × kadar mana-mana) —
            penunjuk keutamaan, bukan kiraan individu sebenar. Ambang tahap: ≥12,000 tinggi ·
            4,000–11,999 sederhana · &lt;4,000 rendah.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
