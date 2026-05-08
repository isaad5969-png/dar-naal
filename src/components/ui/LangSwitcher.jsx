import { useLangStore } from '../../stores/langStore'

const LANGS = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
]

export default function LangSwitcher() {
  const { locale, setLocale } = useLangStore()

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-[#DDD7CE] bg-white px-1 py-1">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className="rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
          style={{
            background: locale === code ? '#1C1C1A' : 'transparent',
            color: locale === code ? '#fff' : '#7A7268',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
