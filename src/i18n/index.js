import fr from './fr'
import en from './en'
import ar from './ar'

export const locales = { fr, en, ar }
export const defaultLocale = 'fr'

export function t(translations, key, vars = {}) {
  const keys = key.split('.')
  let val = keys.reduce((obj, k) => obj?.[k], translations)
  if (typeof val !== 'string') val = key
  return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, v), val)
}
