import { Link, useLocation } from 'react-router-dom'
import { useCartStore } from '../../stores/cartStore'
import { useLangStore } from '../../stores/langStore'
import LangSwitcher from './LangSwitcher'
import NotifBell from './NotifBell'

export default function Navbar() {
  const items = useCartStore((s) => s.items)
  const t = useLangStore((s) => s.t)
  const { pathname } = useLocation()
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0)

  const navLink = (to, label) => (
    <Link
      to={to}
      className="public-btn-subtle px-4 py-2 text-sm"
      style={{ fontWeight: pathname === to ? '700' : '500', color: pathname === to ? '#b05c3a' : undefined }}
    >
      {label}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8dfc8] bg-[#f8f1e5]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/logo-dar-naal.png" alt="Dar Naal" className="h-9 w-auto" />
          <span className="hidden text-sm font-bold tracking-wide sm:block" style={{ color: '#1a1612' }}>
            Souk 3D Marrakech
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLink('/boutique-3d', t('nav.store3d'))}
          {navLink('/catalogue', t('nav.catalog'))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitcher />
          <NotifBell />
          <Link to="/cart" className="public-btn-secondary relative px-4 py-2 text-sm">
            {t('nav.cart')}
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: '#b05c3a' }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex items-center justify-center gap-2 border-t border-[#e8dfc8] px-4 py-2 md:hidden">
        {navLink('/boutique-3d', t('nav.store3d'))}
        {navLink('/catalogue', t('nav.catalog'))}
      </div>
    </header>
  )
}
