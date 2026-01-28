import en from '@/shared/config/locales/en.json'

export type LocaleCode = 'en'
export type Messages = typeof en

const messages: Record<LocaleCode, Messages> = { en }

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined
    return (acc as Record<string, unknown>)[key]
  }, obj)
  return typeof value === 'string' ? value : undefined
}

export function createT(locale: LocaleCode) {
  return function t(key: string): string {
    const msg = getNested(messages[locale] as Record<string, unknown>, key)
    return msg ?? key
  }
}

export const t = createT('en')
