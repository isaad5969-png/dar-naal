import { useLangStore } from '../../stores/langStore'

const LANGS = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
]

export default function LangSwitcher() {
  const { locale, setLocale } = useLangStore()

  return (
    <div className="flex items-center gap-1 rounded-full border border-[#e8dfc8] bg-white px-1 py-1">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className="rounded-full px-2.5 py-1 text-xs font-semibold transition"
          style={{
            background: locale === code ? '#b05c3a' : 'transparent',
            color: locale === code ? '#fff' : '#5a4a3a',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
