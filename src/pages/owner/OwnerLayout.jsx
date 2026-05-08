import { NavLink, Outlet } from 'react-router-dom'
import { useLangStore } from '../../stores/langStore'

export default function OwnerLayout() {
  const t = useLangStore((s) => s.t)

  const link = (to, label) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `block rounded-2xl px-4 py-2.5 text-sm font-medium transition ${isActive ? 'bg-[#b05c3a] text-white' : 'text-[#5a4a3a] hover:bg-[#f2e8d4]'}`
      }
    >
      {label}
    </NavLink>
  )

  return (
    <div className="section-shell pb-16">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="pill-badge">Back-office</span>
          <h1 className="mt-3 text-4xl font-semibold" style={{ color: '#1a1612' }}>{t('owner.dashboard')}</h1>
        </div>
        <NavLink to="/" className="public-btn-subtle text-sm">← Site public</NavLink>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="panel-surface h-fit p-3 space-y-1">
          {link('/owner', t('owner.dashboard'))}
          {link('/owner/products', t('owner.products'))}
          {link('/owner/products/new', t('owner.add_product'))}
          {link('/owner/hotspots', t('owner.hotspots'))}
        </nav>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
