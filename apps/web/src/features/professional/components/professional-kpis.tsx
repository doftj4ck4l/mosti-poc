import { StatCard } from '@/components/stat-card'
import { fmt, fmt1Signed } from '@/lib/engine/format'
import {
  fieldGrowth,
  fieldTotals,
  totalFor,
  yearsFor,
  type Body,
} from '../lib/professional'

export function ProfessionalKpis({ body }: { body: Body }) {
  const years = yearsFor(body)
  const latest = years[years.length - 1]
  const prev = years[years.length - 2]
  const total = totalFor(body, latest)
  const prevTotal = totalFor(body, prev)
  const growth = prevTotal ? ((total - prevTotal) / prevTotal) * 100 : null
  const fields = fieldTotals(body, latest)
  const fastest = fieldGrowth(body)[0]

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <StatCard
        title={`Jumlah Pendaftaran ${latest}`}
        value={fmt(total)}
        sub={`${body} · semua jenis dan bidang`}
      />
      <StatCard
        title='Pertumbuhan Tahunan'
        value={`${growth !== null && growth >= 0 ? '+' : ''}${growth === null ? '—' : growth.toFixed(2)}%`}
        sub={`${fmt(prevTotal)} (${prev}) → ${fmt(total)} (${latest})`}
        good={growth !== null && growth > 0}
      />
      <StatCard
        title='Bidang Terbesar'
        value={fields[0]?.field ?? '—'}
        sub={`${fmt(fields[0]?.total)} pendaftaran (${latest})`}
      />
      <StatCard
        title='Pertumbuhan Tertinggi'
        value={fastest?.field ?? '—'}
        sub={`${fmt1Signed(fastest?.growth)}% (${fastest?.from} → ${fastest?.to})`}
        good={(fastest?.growth ?? 0) > 0}
      />
    </div>
  )
}
