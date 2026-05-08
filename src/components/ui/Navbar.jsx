import { Link, NavLink } from 'react-router-dom'
import { useCartStore } from '../../stores/cartStore'
import { useLangStore } from '../../stores/langStore'
import LangSwitcher from './LangSwitcher'

export default function Navbar() {
  const items = useCartStore((s) => s.items)
  const t = useLangStore((s) => s.t)
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <header className="site-header">
      {/* Info bar */}
      <div className="info-bar">
        <div className="container-xl flex items-center justify-between">
          <span>MARRAKECH · ARTISANAT SÉLECTIONNÉ</span>
          <span>LIVRAISON LOCALE &amp; RETRAIT BOUTIQUE</span>
        </div>
      </div>

      {/* Logo row */}
      <div className="container-xl flex items-center justify-between py-4">
        {/* Left: search + lang */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-[#1C1C1A] hover:opacity-60 transition" aria-label="Rechercher">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <LangSwitcher />
        </div>

        {/* Center: logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <img src="/dar-naal/images/logo-dar-naal.png" alt="Dar Naal" className="h-16 w-auto" />
        </Link>

        {/* Right: commander + account + cart */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="text-[13px] font-medium tracking-wide text-[#1C1C1A] hover:opacity-60 transition">
            Commander
          </Link>
          <button className="p-2 text-[#1C1C1A] hover:opacity-60 transition" aria-label="Compte">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
          <Link to="/cart" className="relative p-2 text-[#1C1C1A] hover:opacity-60 transition" aria-label="Panier">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1C1C1A] text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-[#E8E0D4]">
        <div className="container-xl flex items-center justify-center gap-8 py-3">
          {[
            ['/','Accueil'],
            ['/boutique-3d','Boutique 3D'],
            ['/catalogue','Collections'],
            ['/catalogue?cat=coffrets','Coffrets cadeaux'],
            ['/cart','Commander'],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link text-[13px] ${isActive ? 'border-b-[#1C1C1A]' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
