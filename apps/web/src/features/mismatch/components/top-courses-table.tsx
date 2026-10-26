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
import { MENEGAK_COLOR, MENDATAR_COLOR } from '@/lib/chart-colors'
import type { MismatchCategory } from '@/lib/engine/mismatch-types'
import { fmt, fmt1 } from '@/lib/engine/format'

interface TopCoursesTableProps {
  courses: MismatchCategory[]
}

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className='flex items-center gap-2'>
      <div className='h-2 w-16 overflow-hidden rounded-full bg-muted'>
        <div
          className='h-full rounded-full'
          style={{ width: `${Math.min(100, pct)}%`, backgroundColor: color }}
        />
      </div>
      <span className='text-xs tabular-nums text-muted-foreground'>{fmt1(pct)}%</span>
    </div>
  )
}

export function TopCoursesTable({ courses }: TopCoursesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Kursus Pengajian dengan Bilangan Graduan Terbanyak</CardTitle>
        <CardDescription>
          15 Kursus Teratas — hanya kursus dengan sekurang-kurangnya 300 graduan dinilai
          disertakan, disusun mengikut bilangan graduan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kursus Pengajian</TableHead>
              <TableHead className='text-right'>Bil. Graduan</TableHead>
              <TableHead>Menegak %</TableHead>
              <TableHead>Mendatar %</TableHead>
              <TableHead>Mana-mana %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((c) => (
              <TableRow key={c.label}>
                <TableCell className='font-medium'>{c.label}</TableCell>
                <TableCell className='text-right tabular-nums'>{fmt(c.n)}</TableCell>
                <TableCell>
                  <MiniBar pct={c.vp} color={MENEGAK_COLOR} />
                </TableCell>
                <TableCell>
                  <MiniBar pct={c.hp} color={MENDATAR_COLOR} />
                </TableCell>
                <TableCell>
                  <MiniBar pct={c.ap} color='#0ea5e9' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
