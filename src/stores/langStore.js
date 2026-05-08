import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { locales, defaultLocale } from '../i18n'

export const useLangStore = create(
  persist(
    (set, get) => ({
      locale: defaultLocale,
      translations: locales[defaultLocale],

      setLocale: (locale) => {
        const translations = locales[locale] ?? locales[defaultLocale]
        document.documentElement.lang = locale
        document.documentElement.dir = translations.dir
        set({ locale, translations })
      },

      t: (key, vars) => {
        const { translations } = get()
        const keys = key.split('.')
        let val = keys.reduce((obj, k) => obj?.[k], translations)
        if (typeof val !== 'string') val = key
        return Object.entries(vars ?? {}).reduce((s, [k, v]) => s.replace(`{${k}}`, v), val)
      },
    }),
    { name: 'souk3d-lang', partialize: (s) => ({ locale: s.locale }) }
  )
)
