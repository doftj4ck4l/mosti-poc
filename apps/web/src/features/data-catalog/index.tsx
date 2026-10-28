import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Database, Download, FileText, Search as SearchIcon } from 'lucide-react'
import { StatCard } from '@/components/stat-card'
import { downloadCsv, toCsv } from '@/lib/csv'
import { cn } from '@/lib/utils'
import docs from './data/documents.json'
import {
  STATUS_LABELS,
  agencies,
  catalogModules,
  indicators,
  type SourceStatus,
} from './data/catalog'

interface Doc {
  id: string
  module: string
  type: string
  title: string
  period: string
  access: string
  indexed: boolean
  fileName: string
  preloaded: boolean
}

const documents = docs as Doc[]

const STATUS_STYLES: Record<SourceStatus, string> = {
  ingested: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  linked: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
  planned: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300',
  document: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300',
}

export function DataCatalog() {
  const [docSearch, setDocSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('all')

  const modules = useMemo(
    () => Array.from(new Set(documents.map((d) => d.module))),
    []
  )

  const filteredDocs = documents.filter((d) => {
    const okModule = moduleFilter === 'all' || d.module === moduleFilter
    const okSearch =
      !docSearch ||
      d.title.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.module.toLowerCase().includes(docSearch.toLowerCase())
    return okModule && okSearch
  })

  const ingested = catalogModules.filter((m) => m.status === 'ingested').length
  const linked = catalogModules.filter((m) => m.status === 'linked').length
  const planned = catalogModules.filter((m) => m.status === 'planned').length
  const indexed = documents.filter((d) => d.indexed).length

  const exportCatalog = () => {
    downloadCsv(
      'sumber-data.csv',
      toCsv(
        ['Modul', 'Pemilik sumber', 'Tempoh', 'Status', 'Liputan', 'Had'],
        catalogModules.map((m) => [
          m.module,
          m.owner,
          m.period,
          STATUS_LABELS[m.status],
          m.coverage,
          m.limitations,
        ])
      )
    )
  }

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
            <div className='flex items-center gap-2'>
              <Database className='size-6 text-muted-foreground' />
              <h2 className='text-2xl font-bold tracking-tight'>Sumber Data &amp; Metadata</h2>
            </div>
            <p className='text-muted-foreground'>
              Katalog sumber, dokumen, definisi indikator dan provenance yang menyokong setiap
              modul analitik — lapisan pengetahuan platform.
            </p>
          </div>
          <Button variant='outline' onClick={exportCatalog}>
            <Download className='size-4' /> Eksport katalog
          </Button>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            title='Modul dengan data'
            value={String(ingested)}
            sub='data berstruktur dalam platform'
            icon={<Database />}
            good
          />
          <StatCard
            title='Modul pautan luaran'
            value={String(linked)}
            sub='i-360 dan Power BI (belum diambil)'
            icon={<FileText />}
          />
          <StatCard
            title='Modul dirancang'
            value={String(planned)}
            sub='BEM/MBOT menunggu dataset rasmi'
          />
          <StatCard
            title='Dokumen diindeks'
            value={`${indexed} / ${documents.length}`}
            sub='laporan SPM 2018–2025 + Foresight'
          />
        </div>

        <Tabs defaultValue='modul' className='space-y-4'>
          <TabsList className='flex-wrap'>
            <TabsTrigger value='modul'>Sumber Mengikut Modul</TabsTrigger>
            <TabsTrigger value='dokumen'>Dokumen</TabsTrigger>
            <TabsTrigger value='indikator'>Definisi Indikator</TabsTrigger>
            <TabsTrigger value='agensi'>Agensi &amp; Tadbir Urus</TabsTrigger>
          </TabsList>

          <TabsContent value='modul'>
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Status Sumber Mengikut Modul</CardTitle>
                <CardDescription>
                  Data kekal pada pemilik masing-masing; platform menghubungkan melalui
                  interoperability dan analytical linkage
                </CardDescription>
              </CardHeader>
              <CardContent className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Modul</TableHead>
                      <TableHead>Pemilik sumber</TableHead>
                      <TableHead>Tempoh</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='min-w-[260px]'>Liputan</TableHead>
                      <TableHead className='min-w-[280px]'>Had / nota</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {catalogModules.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className='font-medium'>{m.module}</TableCell>
                        <TableCell>{m.owner}</TableCell>
                        <TableCell className='whitespace-nowrap'>{m.period}</TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium',
                              STATUS_STYLES[m.status]
                            )}
                          >
                            {STATUS_LABELS[m.status]}
                          </span>
                        </TableCell>
                        <TableCell className='text-xs text-muted-foreground'>{m.coverage}</TableCell>
                        <TableCell className='text-xs text-muted-foreground'>{m.limitations}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='dokumen'>
            <Card>
              <CardHeader>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <div>
                    <CardTitle className='text-base'>Dokumen Rujukan</CardTitle>
                    <CardDescription>
                      15 dokumen dalam katalog · 9 diindeks untuk rujukan bersumber (8 laporan SPM
                      + STI Foresight Report)
                    </CardDescription>
                  </div>
                  <div className='flex flex-wrap items-center gap-2'>
                    <div className='relative'>
                      <SearchIcon className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
                      <Input
                        placeholder='Cari dokumen…'
                        value={docSearch}
                        onChange={(e) => setDocSearch(e.target.value)}
                        className='w-[220px] pl-8'
                      />
                    </div>
                    <Select value={moduleFilter} onValueChange={setModuleFilter}>
                      <SelectTrigger className='w-[220px]'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Semua modul</SelectItem>
                        {modules.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='max-h-[520px] overflow-auto'>
                <Table>
                  <TableHeader className='sticky top-0 bg-background'>
                    <TableRow>
                      <TableHead>Tajuk</TableHead>
                      <TableHead>Modul</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Tempoh</TableHead>
                      <TableHead>Akses</TableHead>
                      <TableHead>Diindeks</TableHead>
                      <TableHead>Fail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocs.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className='font-medium'>{d.title}</TableCell>
                        <TableCell className='text-xs'>{d.module}</TableCell>
                        <TableCell className='text-xs'>{d.type}</TableCell>
                        <TableCell className='whitespace-nowrap text-xs'>{d.period}</TableCell>
                        <TableCell className='text-xs'>{d.access}</TableCell>
                        <TableCell>
                          {d.indexed ? (
                            <Badge variant='secondary'>Ya</Badge>
                          ) : (
                            <Badge variant='outline'>Tidak</Badge>
                          )}
                        </TableCell>
                        <TableCell className='font-mono text-[11px] text-muted-foreground'>
                          {d.fileName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className='mt-3 text-xs text-muted-foreground'>
                  {filteredDocs.length} daripada {documents.length} dokumen dipaparkan.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='indikator'>
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Definisi Indikator</CardTitle>
                <CardDescription>
                  Definisi yang digunakan secara konsisten merentas dashboard dan laporan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kod</TableHead>
                      <TableHead>Indikator</TableHead>
                      <TableHead className='min-w-[320px]'>Definisi</TableHead>
                      <TableHead>Sumber</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {indicators.map((i) => (
                      <TableRow key={i.code}>
                        <TableCell className='font-mono text-xs'>{i.code}</TableCell>
                        <TableCell className='font-medium'>{i.label}</TableCell>
                        <TableCell className='text-xs text-muted-foreground'>{i.definition}</TableCell>
                        <TableCell className='whitespace-nowrap text-xs'>{i.source}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='agensi'>
            <div className='grid gap-4 xl:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>Penglibatan Agensi</CardTitle>
                  <CardDescription>
                    Kertas MPN Bil. 2/2026 · Jawatankuasa Teknikal Bakat STI Negara
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agensi</TableHead>
                        <TableHead>Peranan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agencies.map((a) => (
                        <TableRow key={a.agency}>
                          <TableCell className='whitespace-nowrap font-medium'>{a.agency}</TableCell>
                          <TableCell className='text-xs text-muted-foreground'>{a.role}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>Tadbir Urus Data</CardTitle>
                  <CardDescription>Prinsip dan lapisan platform</CardDescription>
                </CardHeader>
                <CardContent className='space-y-3 text-sm'>
                  {[
                    ['Pemilikan data', 'Data kekal pada pemilik masing-masing; platform menghubungkan melalui interoperability.'],
                    ['Metadata & provenance', 'Setiap sumber merekodkan pemilik, tempoh rujukan, versi, tahap akses dan had.'],
                    ['Klasifikasi sepunya', 'NEC · MASCO · MSIC · ISCO sebagai asas pautan analitik.'],
                    ['Kesimpulan bersumber', 'Setiap dapatan perlu boleh dijejak kepada dataset dan halaman laporan asal.'],
                    ['Belum pada peringkat rekod', 'Pautan individu merentas sistem agensi belum tersedia dalam POC ini.'],
                  ].map(([t, d]) => (
                    <div key={t} className='rounded-md border p-3'>
                      <p className='font-medium'>{t}</p>
                      <p className='text-xs text-muted-foreground'>{d}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
