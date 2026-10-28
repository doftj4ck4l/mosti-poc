import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { fmt2Signed } from '@/lib/engine/format'
import { subjectName, subjects, subjectOptions, years } from '../lib/spm'

const HEAT_YEARS = years.filter((y) => y >= 2019)

function colorFor(delta: number | null): string {
  if (delta === null) return 'bg-muted/40'
  const capped = Math.max(-0.5, Math.min(0.5, delta))
  const intensity = Math.min(1, Math.abs(capped) / 0.35)
  if (Math.abs(capped) < 0.005) return 'bg-muted/60'
  const alpha = 0.15 + intensity * 0.7
  return capped < 0
    ? `rgba(16, 148, 96, ${alpha})`
    : `rgba(220, 38, 38, ${alpha})`
}

export function GpmpHeatmap() {
  const [showAll, setShowAll] = useState(false)
  const options = useMemo(() => subjectOptions(), [])
  const rows = showAll ? options : options.slice(0, 25)

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-wrap items-start justify-between gap-2'>
          <div>
            <CardTitle className='text-base'>Peta Haba Perubahan GPMP</CardTitle>
            <CardDescription>
              Setiap sel menunjukkan perubahan GPMP berbanding tahun sebelumnya · hijau = GPMP
              lebih rendah (bertambah baik) · merah = GPMP meningkat
            </CardDescription>
          </div>
          <Button size='sm' variant='outline' onClick={() => setShowAll((s) => !s)}>
            {showAll ? 'Tunjuk 25 teratas' : 'Tunjuk semua 95'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <div className='min-w-[640px]'>
            <div
              className='grid items-center gap-1 text-[11px] text-muted-foreground'
              style={{ gridTemplateColumns: `minmax(220px,1fr) repeat(${HEAT_YEARS.length}, 44px)` }}
            >
              <div className='px-2 py-1'>Mata pelajaran</div>
              {HEAT_YEARS.map((y) => (
                <div key={y} className='text-center'>
                  {y}
                </div>
              ))}
              {rows.map((o) => (
                <RowCells key={o.code} code={o.code} />
              ))}
            </div>
          </div>
        </div>
        <div className='mt-4 flex items-center gap-3 text-xs text-muted-foreground'>
          <span>Lebih baik</span>
          <div className='flex'>
            {[-0.4, -0.2, -0.05, 0.05, 0.2, 0.4].map((d) => (
              <span
                key={d}
                className='h-3 w-6'
                style={{ backgroundColor: colorFor(d) }}
                title={fmt2Signed(d)}
              />
            ))}
          </div>
          <span>Lebih buruk</span>
          <span className='ml-auto'>Δ GPMP (negatif = bertambah baik)</span>
        </div>
      </CardContent>
    </Card>
  )
}

function RowCells({ code }: { code: string }) {
  const s = subjects[code]
  return (
    <>
      <div className='truncate px-2 py-1 text-xs text-foreground' title={subjectName(code)}>
        {subjectName(code)}
      </div>
      {HEAT_YEARS.map((y) => {
        const cur = s.series[String(y)]?.gpmp
        const prev = s.series[String(y - 1)]?.gpmp
        const d = cur !== undefined && prev !== undefined ? cur - prev : null
        return (
          <div
            key={y}
            className='h-6 rounded-sm text-center text-[10px] leading-6 tabular-nums'
            style={{
              backgroundColor: colorFor(d),
              color: d !== null && Math.abs(d) >= 0.2 ? 'white' : undefined,
            }}
            title={`${subjectName(code)} · ${y}: ${d === null ? 'tiada data' : fmt2Signed(d)}`}
          >
            {d === null ? '' : fmt2Signed(d)}
          </div>
        )
      })}
    </>
  )
}
