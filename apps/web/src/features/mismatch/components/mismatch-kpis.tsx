import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/stat-card'
import { GraduationCap, Percent, Split, TrendingDown, TrendingUp } from 'lucide-react'
import type { MismatchSummary } from '@/lib/engine/mismatch-types'
import { fmt, fmt1 } from '@/lib/engine/format'

export function MismatchKpis({ ds }: { ds: MismatchSummary }) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <StatCard
        title='Kadar Ketidaksepadanan (Mana-mana)'
        value={`${fmt1(ds.ap)}%`}
        sub={`${fmt(ds.a)} daripada ${fmt(ds.n)} graduan dinilai`}
        icon={<Percent />}
        danger
      />
      <StatCard
        title='Ketidaksepadanan Menegak'
        value={`${fmt1(ds.vp)}%`}
        sub={`Tahap kemahiran pekerjaan vs peringkat pengajian · ${fmt(ds.over)} terlebih / ${fmt(ds.under)} kurang kelayakan`}
        icon={<Split />}
      />
      <StatCard
        title='Ketidaksepadanan Mendatar'
        value={`${fmt1(ds.hp)}%`}
        sub={`Bidang pengajian vs bidang pekerjaan sebenar`}
        icon={<TrendingUp />}
      />
      <StatCard
        title='Asas Analisis'
        value={fmt(ds.n)}
        sub={`${fmt(ds.bekerja)} graduan bekerja · ${fmt(ds.graduan)} rekod · ${fmt(ds.none)} sepadan`}
        icon={<GraduationCap />}
      />
    </div>
  )
}

export function MismatchExtraKpis({ ds }: { ds: MismatchSummary }) {
  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium'>Ringkasan Silang & Arah Menegak</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-wrap gap-2'>
        <Badge variant='outline'>
          Menegak sahaja: {fmt(ds.onlyv)} ({fmt1((ds.onlyv / (ds.n || 1)) * 100)}%)
        </Badge>
        <Badge variant='outline'>
          Mendatar sahaja: {fmt(ds.onlyh)} ({fmt1((ds.onlyh / (ds.n || 1)) * 100)}%)
        </Badge>
        <Badge variant='outline'>
          Kedua-dua: {fmt(ds.dual)} ({fmt1(ds.dp)}%)
        </Badge>
        <Badge variant='destructive'>
          Terlebih kelayakan (over): {fmt(ds.over)} ({fmt1(ds.over / (ds.n || 1) * 100)}%)
        </Badge>
        <Badge variant='secondary'>
          Kurang kelayakan (under): {fmt(ds.under)} ({fmt1(ds.under / (ds.n || 1) * 100)}%)
        </Badge>
        <Badge variant='outline' className='gap-1'>
          <TrendingDown className='size-3' /> Sepadan: {fmt(ds.none)} ({fmt1(100 - ds.ap)}%)
        </Badge>
      </CardContent>
    </Card>
  )
}
