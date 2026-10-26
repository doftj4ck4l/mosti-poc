import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import {
  SCENARIO_PRESETS,
  macroKeys,
  macroShortNames,
  macroData,
  scenarioDefs,
  indexOfYear,
  type ScenarioChanges,
} from '@/lib/engine/masco'
import { fmt, fmt1 } from '@/lib/engine/format'

interface MacroSlidersProps {
  changes: ScenarioChanges
  onChange: (changes: ScenarioChanges) => void
  endY: number
}

export function macroFmt(k: string, v: number) {
  return k.includes('(RM)') ? 'RM ' + fmt(v) : fmt1(v) + '%'
}

export function MacroSliders({ changes, onChange, endY }: MacroSlidersProps) {
  const endIdx = indexOfYear(endY)

  const setOne = (k: string, v: number) => onChange({ ...changes, [k]: v })

  const applyPreset = (key: string) => {
    const preset = SCENARIO_PRESETS[key]
    const next: ScenarioChanges = {}
    macroKeys.forEach((k, i) => (next[k] = preset.changes(k, i)))
    onChange(next)
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-2'>
        {Object.entries(SCENARIO_PRESETS).map(([key, p]) => {
          const isActive = macroKeys.every(
            (k, i) => Math.abs((changes[k] ?? 0) - p.changes(k, i)) < 0.001
          )
          return (
            <Button
              key={key}
              size='sm'
              variant={isActive ? 'default' : 'outline'}
              onClick={() => applyPreset(key)}
            >
              {p.label}
            </Button>
          )
        })}
      </div>

      <p className='text-xs text-muted-foreground'>
        Ubah andaian faktor makro dan lihat nilai faktor Baseline → Scenario pada tahun {endY}.
        Faktor kadar menggunakan mata peratus (pp); gaji menggunakan perubahan relatif (%).
        Pelaburan ialah kadar pertumbuhan pelaburan diluluskan MIDA, bukan nilai RM pelaburan.
      </p>

      <div className='grid gap-5 md:grid-cols-2'>
        {macroKeys.map((k, i) => {
          const def = scenarioDefs[k]
          const chg = changes[k] ?? 0
          const base = macroData[k][endIdx] ?? 0
          const sc =
            def.type === 'pct' ? base * (1 + chg / 100) : base + chg
          return (
            <div key={k} className='space-y-2 rounded-lg border p-4'>
              <div className='flex items-start justify-between gap-2'>
                <Label className='text-sm font-medium'>
                  {i + 1}. {macroShortNames[k]}
                </Label>
                <span
                  className={cn(
                    'text-xs font-medium tabular-nums',
                    chg > 0 && 'text-emerald-600 dark:text-emerald-400',
                    chg < 0 && 'text-red-600 dark:text-red-400'
                  )}
                >
                  {(chg >= 0 ? '+' : '') + fmt1(chg)} {def.unit}
                </span>
              </div>
              <Slider
                min={def.min}
                max={def.max}
                step={def.step}
                value={[chg]}
                onValueChange={([v]) => setOne(k, v)}
              />
              <div className='flex justify-between text-xs text-muted-foreground tabular-nums'>
                <span>
                  {endY} baseline: {macroFmt(k, base)}
                </span>
                <span>
                  → scenario: {macroFmt(k, sc)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
