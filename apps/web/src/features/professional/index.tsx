import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DataCaveats, PrintButton, Provenance } from '@/components/provenance'
import { TriangleAlert } from 'lucide-react'
import { ProfessionalKpis } from './components/professional-kpis'
import { ProfessionalTrend } from './components/professional-trend'
import { FieldBreakdown } from './components/field-breakdown'
import { BODY_LABELS, fieldsFor, type Body } from './lib/professional'

export function Professional() {
  const [body, setBody] = useState<Body>('BEM')
  const [field, setField] = useState('Semua')
  const fields = fieldsFor(body)

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
              <h2 className='text-2xl font-bold tracking-tight'>Bakat Profesional</h2>
              <Badge variant='outline'>BEM · MBOT</Badge>
              <Badge variant='secondary'>2020–2025</Badge>
            </div>
            <p className='text-muted-foreground'>
              Trend tahunan pendaftaran dan pengiktirafan profesional mengikut jenis dan bidang —
              hujung hilir rantaian bakat (profesional).
            </p>
          </div>
          <PrintButton />
        </div>

        <Provenance
          source='Data Pendaftaran Profesional (prototaip ilustratif)'
          owner='BEM · MBOT'
          period='2020–2025'
          status='planned'
        />

        <Alert className='border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950'>
          <TriangleAlert className='size-4 text-amber-600' />
          <AlertTitle>Prototaip ilustratif</AlertTitle>
          <AlertDescription>
            Angka adalah ilustratif sehingga dataset rasmi BEM/MBOT dimuatkan. Struktur paparan,
            definisi dan pemetaan jenis/bidang adalah tetap; hanya nilainya akan diganti.
          </AlertDescription>
        </Alert>

        <Tabs value={body} onValueChange={(v) => { setBody(v as Body); setField('Semua') }}>
          <TabsList>
            <TabsTrigger value='BEM'>BEM</TabsTrigger>
            <TabsTrigger value='MBOT'>MBOT</TabsTrigger>
          </TabsList>

          {(['BEM', 'MBOT'] as Body[]).map((b) => (
            <TabsContent key={b} value={b} className='space-y-4'>
              <div className='flex flex-wrap items-center gap-3'>
                <span className='text-sm text-muted-foreground'>{BODY_LABELS[b]}</span>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-muted-foreground'>Bidang</span>
                  <Select value={field} onValueChange={setField}>
                    <SelectTrigger className='w-[240px]'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Semua'>Semua bidang</SelectItem>
                      {fieldsFor(b).map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ProfessionalKpis body={b} />
              <div className='grid gap-4 xl:grid-cols-2'>
                <ProfessionalTrend body={b} field={field} />
                <FieldBreakdown
                  body={b}
                  field={field}
                  onSelect={(f) => setField(f === field ? 'Semua' : f)}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <DataCaveats
          can={[
            'Melihat trend pendaftaran mengikut jenis pengiktirafan dan bidang dari semasa ke semasa.',
            'Membandingkan pertumbuhan antara bidang untuk keutamaan pemantauan.',
            'Menjadi asas struktur untuk dataset rasmi BEM/MBOT kelak.',
          ]}
          cannot={[
            'Mewakili bilangan jurutera/teknologis aktif secara unik (pendaftaran tahunan boleh bertindih).',
            'Mengukur kekurangan atau lebihan bakat secara langsung.',
            'Menggantikan laporan tahunan rasmi BEM/MBOT sehingga dataset rasmi dimuatkan.',
          ]}
        />

        <p className='text-xs text-muted-foreground'>
          Nota: {fields.length} bidang · data ilustratif 2020–2025 · klik bar bidang untuk menapis
          trend. Sumber rujukan: BEM Annual Report 2022–2024, MBOT Annual Report 2023–2024, MBOT
          STRIVE 2024–2029.
        </p>
      </Main>
    </>
  )
}
