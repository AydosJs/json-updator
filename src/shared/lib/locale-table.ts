/**
 * Flatten nested JSON to dot-notation keys. Only string values are kept.
 */
export function flattenKeys(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenKeys(value as Record<string, unknown>, path))
    } else if (typeof value === 'string') {
      result[path] = value
    }
  }
  return result
}

/**
 * Unflatten dot-notation keys back into a nested object. Only string values.
 */
export function unflattenKeys(
  flat: Record<string, string>
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [path, value] of Object.entries(flat)) {
    const parts = path.split('.')
    let current: Record<string, unknown> = result
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      const next = current[part]
      if (next === undefined || typeof next !== 'object' || Array.isArray(next)) {
        current[part] = {}
        current = current[part] as Record<string, unknown>
      } else {
        current = next as Record<string, unknown>
      }
    }
    current[parts[parts.length - 1]] = value
  }
  return result
}

export type LocaleFile = { name: string; data: Record<string, unknown> }

export function getAllKeys(localeFiles: Array<LocaleFile>): Array<string> {
  const keySet = new Set<string>()
  for (const { data } of localeFiles) {
    const flat = flattenKeys(data)
    for (const k of Object.keys(flat)) keySet.add(k)
  }
  return Array.from(keySet).sort()
}

export function getLocaleLabel(filename: string): string {
  const base = filename.replace(/\.json$/i, '').toLowerCase()
  const labels: Record<string, string> = {
    en: 'English',
    eng: 'English',
    english: 'English',
    ru: 'Russian',
    rus: 'Russian',
    russian: 'Russian',
    uz: 'Uzbek',
    uzb: 'Uzbek',
    uzbek: 'Uzbek',
  }
  return labels[base] ?? base
}
