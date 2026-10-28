import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataCaveats, PrintButton, Provenance } from '@/components/provenance'
import { ExternalLink, ImageOff } from 'lucide-react'
import { IMPAK } from '@/features/foresight/data/foresight'
import { StatCard } from '@/components/stat-card'
import { fmt1 } from '@/lib/engine/format'

export function Impak() {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-2xl font-bold tracking-tight'>Minat &amp; Aspirasi STEM</h2>
              <Badge variant='outline'>Kajian Impak</Badge>
              <Badge variant='secondary'>Pautan luaran</Badge>
            </div>
            <p className='text-muted-foreground'>
              Bagaimana peserta menilai program, dan apakah hubungan antara minat, sikap,
              kesedaran dan aspirasi kerjaya STEM?
            </p>
          </div>
          <PrintButton />
        </div>

        <Provenance
          source='Kajian Impak Program STEM · Power BI'
          owner='MASTIC'
          period='Kajian Impak'
          status='linked'
        />

        <div className='grid gap-4 sm:grid-cols-3'>
          <StatCard
            title='Responden'
            value={fmt1(IMPAK.respondents).replace('.0', '')}
            sub='Jumlah responden dalam Executive Summary'
          />
          <StatCard
            title='Skor Aspirasi Kerjaya'
            value={`${fmt1(IMPAK.aspirationScore)}%`}
            sub='Signal aspirasi kerjaya STEM'
            good
          />
          <StatCard
            title='Faktor Paling Berkait'
            value={`r = ${IMPAK.topCorrelation.r}`}
            sub={`${IMPAK.topCorrelation.label} · korelasi, bukan sebab-akibat`}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Paparan Penuh (Power BI)</CardTitle>
            <CardDescription>
              Pratonton ini dipaparkan terlebih dahulu untuk tujuan pembentangan — dashboard
              luaran tidak dipaparkan dalam iframe kerana sekatan keselamatan, log masuk atau
              dasar laman.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-14 text-center'>
              <ImageOff className='size-8 text-muted-foreground' />
              <div>
                <p className='font-medium'>Pratonton dashboard Power BI</p>
                <p className='text-sm text-muted-foreground'>
                  Buka sumber asal untuk interaksi penuh
                </p>
              </div>
              <Button variant='outline' disabled>
                <ExternalLink className='size-4' /> Buka Sumber (pautan disediakan dalam
                persekitaran produksi)
              </Button>
              <Badge variant='outline'>external — not ingested</Badge>
            </div>
          </CardContent>
        </Card>

        <DataCaveats
          can={[
            'Menunjukkan perkaitan antara penilaian program, minat dan aspirasi kerjaya STEM.',
            'Memberi konteks kualitatif untuk tafsiran data SPM dan SKPG.',
          ]}
          cannot={[
            'Membuktikan sebab-akibat antara program dan aspirasi.',
            'Dihubungkan pada peringkat individu dengan rekod SPM, i-360 atau permintaan pekerjaan.',
            'Memberi angka terperinci di luar Executive Summary dalam platform ini.',
          ]}
        />

        <p className='text-xs text-muted-foreground'>
          {IMPAK.notes.join(' ')} Sumber: {IMPAK.source}.
        </p>
      </Main>
    </>
  )
}
