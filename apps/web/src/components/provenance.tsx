import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Info, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface ProvenanceProps {
  source: string
  owner: string
  period: string
  version?: string
  status?: 'ingested' | 'linked' | 'planned' | 'document'
  className?: string
}

const STATUS_LABEL = {
  ingested: { ms: 'Data dalam platform', en: 'Data in platform', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  linked: { ms: 'Pautan luaran', en: 'External link', cls: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' },
  planned: { ms: 'Dirancang', en: 'Planned', cls: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300' },
  document: { ms: 'Dokumen diindeks', en: 'Indexed document', cls: 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300' },
}

export function Provenance({ source, owner, period, version = 'v1.0', status = 'ingested', className }: ProvenanceProps) {
  const { lang } = useT()
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className='flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-[11px] text-muted-foreground'>
        <span className='font-medium text-foreground'>
          {lang === 'en' ? 'Source' : 'Sumber'}: {source}
        </span>
        <span>· {owner}</span>
        <span>· {period}</span>
        <span>· {version}</span>
        <span
          className={cn('rounded-full px-2 py-0.5 font-medium', STATUS_LABEL[status].cls)}
        >
          {STATUS_LABEL[status][lang]}
        </span>
      </CardContent>
    </Card>
  )
}

interface CaveatsProps {
  can: string[]
  cannot: string[]
}

export function DataCaveats({ can, cannot }: CaveatsProps) {
  const { t } = useT()
  return (
    <Card>
      <CardContent className='grid gap-4 py-4 text-sm md:grid-cols-2'>
        <div>
          <p className='mb-2 flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400'>
            <CheckCircle2 className='size-4' /> {t('Apa yang data ini boleh beritahu', 'What this data can tell you')}
          </p>
          <ul className='list-disc space-y-1 pl-5 text-xs text-muted-foreground'>
            {can.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className='mb-2 flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-400'>
            <Info className='size-4' /> {t('Apa yang ia tidak boleh beritahu', 'What it cannot tell you')}
          </p>
          <ul className='list-disc space-y-1 pl-5 text-xs text-muted-foreground'>
            {cannot.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export function PrintButton() {
  const { t } = useT()
  return (
    <Button variant='outline' size='sm' onClick={() => window.print()} className='print:hidden'>
      <Printer className='size-4' /> {t('Cetak / PDF', 'Print / PDF')}
    </Button>
  )
}
