import { useSyncExternalStore } from 'react'

export type Lang = 'ms' | 'en'

const KEY = 'mastic-lang'
const listeners = new Set<() => void>()

function readLang(): Lang {
  if (typeof window === 'undefined') return 'ms'
  return window.localStorage.getItem(KEY) === 'en' ? 'en' : 'ms'
}

let current: Lang = readLang()

export function getLang(): Lang {
  return current
}

export function setLang(lang: Lang) {
  current = lang
  if (typeof window !== 'undefined') window.localStorage.setItem(KEY, lang)
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, () => 'ms')
}

export function t(ms: string, en: string, lang: Lang): string {
  return lang === 'en' ? en : ms
}

export function useT() {
  const lang = useLang()
  return {
    lang,
    t: (ms: string, en: string) => t(ms, en, lang),
  }
}
