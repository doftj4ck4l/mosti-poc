import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { setLang, useLang } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function LangToggle() {
  const lang = useLang()
  return (
    <div className='flex items-center gap-1 rounded-md border p-0.5' title='Bahasa / Language'>
      <Languages className='ms-1 size-3.5 text-muted-foreground' />
      {(['ms', 'en'] as const).map((l) => (
        <Button
          key={l}
          size='sm'
          variant={lang === l ? 'secondary' : 'ghost'}
          className={cn('h-6 px-1.5 text-[11px] font-medium uppercase', lang !== l && 'text-muted-foreground')}
          onClick={() => setLang(l)}
        >
          {l}
        </Button>
      ))}
    </div>
  )
}
