import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataCaveats, PrintButton, Provenance } from '@/components/provenance'
import { ExternalLink, ImageOff } from 'lucide-react'
import { I360 } from '@/features/foresight/data/foresight'

export function I360Page() {
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
              <h2 className='text-2xl font-bold tracking-tight'>Capaian Program STEM</h2>
              <Badge variant='outline'>i-360 Tracker STI360</Badge>
              <Badge variant='secondary'>Pautan luaran</Badge>
            </div>
            <p className='text-muted-foreground'>
              Apakah program STI/STEM yang dilaksanakan, di mana, oleh siapa dan berapa ramai
              peserta direkodkan?
            </p>
          </div>
          <PrintButton />
        </div>

        <Provenance
          source='i-360 Tracker STI360 · Dashboard Eksekutif Program'
          owner='STI360'
          period='Semasa'
          status='linked'
        />

        <div className='grid gap-3 md:grid-cols-3'>
          {I360.questions.map((q) => (
            <Card key={q.q}>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm'>{q.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-xs text-muted-foreground'>{q.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Paparan Penuh (STI360)</CardTitle>
            <CardDescription>
              Pratonton pertama untuk pembentangan — sebahagian dashboard luaran tidak memaparkan
              kandungan dalam iframe kerana sekatan keselamatan atau log masuk.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-14 text-center'>
              <ImageOff className='size-8 text-muted-foreground' />
              <div>
                <p className='font-medium'>Pratonton dashboard i-360</p>
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
            'Menerangkan capaian dan pelaksanaan program (siapa, apa, di mana).',
            'Menjadi konteks untuk peringkat awal rantaian bakat (kesedaran dan minat).',
          ]}
          cannot={[
            'Menunjukkan outcome pendidikan atau kerjaya peserta.',
            'Dihubungkan pada peringkat individu dengan rekod SPM/SKPG.',
            'Memberi data terperinci dalam platform ini (belum diambil).',
          ]}
        />

        <p className='text-xs text-muted-foreground'>{I360.note} Sumber: {I360.source}.</p>
      </Main>
    </>
  )
}
