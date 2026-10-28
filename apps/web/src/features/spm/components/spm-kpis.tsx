import { StatCard } from '@/components/stat-card'
import { Badge } from '@/components/ui/badge'
import { coreFacts, localityValues } from '../lib/spm'
import { fmt, fmt2, fmt2Signed } from '@/lib/engine/format'

export function SpmKpis() {
  const c25 = coreFacts['2025']
  const c24 = coreFacts['2024']
  const loc = localityValues[2025]
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <StatCard
        title='GPK 2025'
        value={fmt2(c25.average)}
        sub={`${fmt2Signed(c25.average - c24.average)} berbanding 2024 · lebih rendah = lebih baik`}
        good={c25.average < c24.average}
        danger={c25.average > c24.average}
      />
      <StatCard
        title='Layak Dianugerahkan Sijil'
        value={`${fmt2(c25.cert)}%`}
        sub={`${fmt2Signed(c25.cert - c24.cert)} mata peratus berbanding 2024`}
        good={c25.cert > c24.cert}
      />
      <StatCard
        title='Calon Berdaftar 2025'
        value={fmt(c25.registered)}
        sub={`${fmt2Signed(((c25.registered - c24.registered) / c24.registered) * 100)}% berbanding 2024`}
      />
      <StatCard
        title='Jurang Bandar–Luar Bandar'
        value={fmt2(c25.gap)}
        sub={`${fmt2Signed(c25.gap - c24.gap)} berbanding 2024 · bandar ${fmt2(loc.bandar)} vs luar bandar ${fmt2(loc.luarBandar)}`}
        good={c25.gap < c24.gap}
      />
      <div className='col-span-full flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
        <Badge variant='outline'>Sumber: Laporan Analisis Keputusan SPM 2018–2025</Badge>
        <Badge variant='outline'>Lembaga Peperiksaan, KPM</Badge>
        <span>
          Setiap angka boleh dijejak ke halaman laporan asal melalui katalog sumber data.
        </span>
      </div>
    </div>
  )
}
