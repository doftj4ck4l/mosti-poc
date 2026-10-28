import { useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Provenance } from '@/components/provenance'
import { ArrowRight, Bot, Send, ShieldAlert, User } from 'lucide-react'
import { useT } from '@/lib/i18n'
import { answerQuestion, defaultSuggestions, type AskAnswer } from './lib/engine'

interface Message {
  role: 'user' | 'assistant'
  text?: string
  answer?: AskAnswer
}

const STORAGE_KEY = 'ask-mastic-accepted'

export function AskMastic() {
  const { t, lang } = useT()
  const [accepted, setAccepted] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === '1'
  )
  const [checked, setChecked] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const suggestions = defaultSuggestions()

  const send = (text: string) => {
    const q = text.trim()
    if (!q) return
    const a = answerQuestion(q, lang)
    setMessages((m) => [...m, { role: 'user', text: q }, { role: 'assistant', answer: a }])
    setInput('')
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }))
  }

  if (!accepted) {
    return (
      <>
        <Header fixed>
          <Search className='me-auto' />
          <ThemeSwitch />
          <ProfileDropdown />
        </Header>
        <Main className='flex flex-1 flex-col gap-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <h2 className='text-2xl font-bold tracking-tight'>Ask MASTIC</h2>
            <Badge variant='outline'>Beta</Badge>
            <Badge variant='secondary'>{t('Enjin deterministik · bukan LLM', 'Deterministic engine · not an LLM')}</Badge>
          </div>
          <Card className='max-w-2xl'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <ShieldAlert className='size-4 text-amber-600' /> {t('Penafian', 'Disclaimer')}
              </CardTitle>
              <CardDescription>
                {t(
                  'Jawapan yang dijana melalui Ask MASTIC adalah berasaskan data dan dokumen yang tersedia dalam platform ini. Dapatan dan tafsiran adalah untuk rujukan awal dan masih tertakluk kepada semakan lanjut.',
                  'Answers generated through Ask MASTIC are based on the data and documents available in this platform. Findings and interpretations are for initial reference and remain subject to further review.'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-start gap-2'>
                <Checkbox
                  id='accept'
                  checked={checked}
                  onCheckedChange={(v) => setChecked(v === true)}
                />
                <Label htmlFor='accept' className='text-sm leading-snug'>
                  {t(
                    'Saya telah membaca, memahami dan bersetuju dengan penafian di atas.',
                    'I have read, understood and agree to the disclaimer above.'
                  )}
                </Label>
              </div>
              <Button
                disabled={!checked}
                onClick={() => {
                  window.localStorage.setItem(STORAGE_KEY, '1')
                  setAccepted(true)
                }}
              >
                {t('Teruskan', 'Continue')} <ArrowRight className='size-4' />
              </Button>
            </CardContent>
          </Card>
        </Main>
      </>
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
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-2xl font-bold tracking-tight'>Ask MASTIC</h2>
              <Badge variant='outline'>Beta</Badge>
              <Badge variant='secondary'>
                {t('Enjin deterministik · bukan LLM', 'Deterministic engine · not an LLM')}
              </Badge>
            </div>
            <p className='text-muted-foreground'>
              {t(
                'Tanya soalan berkaitan SPM, E&E Supply & Demand, Graduate Mismatch, BEM/MBOT atau STI Foresight — setiap jawapan disertakan sumber.',
                'Ask about SPM, E&E Supply & Demand, Graduate Mismatch, BEM/MBOT or STI Foresight — every answer is cited.'
              )}
            </p>
          </div>
        </div>

        <Provenance
          source={t('Data berstruktur platform + katalog sumber', 'Platform structured data + source catalog')}
          owner='MASTIC · MOSTI'
          period='2018–2040'
        />

        <Card className='flex-1'>
          <CardContent className='flex flex-col gap-4 py-4'>
            {messages.length === 0 && (
              <div className='space-y-3'>
                <p className='text-sm text-muted-foreground'>
                  {t('Cuba soalan ini:', 'Try these questions:')}
                </p>
                <div className='flex flex-wrap gap-2'>
                  {suggestions.map((s) => (
                    <Button key={s} variant='outline' size='sm' onClick={() => send(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className='flex items-start justify-end gap-2'>
                  <div className='max-w-[80%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground'>
                    {m.text}
                  </div>
                  <User className='mt-1 size-4 text-muted-foreground' />
                </div>
              ) : (
                <div key={i} className='flex items-start gap-2'>
                  <Bot className='mt-1 size-4 text-muted-foreground' />
                  <div className='max-w-[85%] space-y-2'>
                    <div className='rounded-lg border bg-muted/40 px-3 py-2 text-sm'>
                      <p>{m.answer?.text}</p>
                      {m.answer?.bullets && (
                        <ul className='mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground'>
                          {m.answer.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      )}
                      {m.answer?.table && (
                        <div className='mt-3 overflow-x-auto rounded-md border bg-background'>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {m.answer.table.headers.map((h) => (
                                  <TableHead key={h} className='whitespace-nowrap text-xs'>
                                    {h}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {m.answer.table.rows.map((r, ri) => (
                                <TableRow key={ri}>
                                  {r.map((c, ci) => (
                                    <TableCell key={ci} className='whitespace-nowrap text-xs tabular-nums'>
                                      {c}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                      {m.answer?.citation && (
                        <div className='mt-3 flex flex-wrap items-center gap-2 border-t pt-2 text-[11px] text-muted-foreground'>
                          <span className='font-medium text-foreground'>
                            {t('Sumber', 'Source')}:
                          </span>
                          <span>{m.answer.citation.source}</span>
                          <span>· {m.answer.citation.owner}</span>
                          <span>· {m.answer.citation.period}</span>
                          {m.answer.link && (
                            <Button asChild size='sm' variant='outline' className='ms-auto h-6 px-2 text-[11px]'>
                              <Link to={m.answer.link.to}>
                                {m.answer.link.label} <ArrowRight className='size-3' />
                              </Link>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    {m.answer?.suggestions && (
                      <div className='flex flex-wrap gap-1.5'>
                        {m.answer.suggestions.map((s) => (
                          <Button key={s} variant='ghost' size='sm' className='h-6 text-[11px]' onClick={() => send(s)}>
                            {s}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
            <div ref={endRef} />
          </CardContent>
        </Card>

        <form
          className='flex items-center gap-2'
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('Tanya soalan tentang data bakat STEM…', 'Ask a question about STEM talent data…')}
          />
          <Button type='submit' disabled={!input.trim()}>
            <Send className='size-4' /> {t('Hantar', 'Send')}
          </Button>
        </form>

        <p className='text-[11px] text-muted-foreground'>
          {t(
            'Jawapan dijana daripada data berstruktur platform — bukan nasihat dasar. Semak sumber sebelum digunakan.',
            'Answers are generated from the platform structured data — not policy advice. Verify the source before use.'
          )}
        </p>
      </Main>
    </>
  )
}
