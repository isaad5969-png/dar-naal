import { Link } from 'react-router-dom'
import { useLangStore } from '../stores/langStore'

export default function HomePage() {
  const t = useLangStore((s) => s.t)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: '70vh' }}>
        <img
          src="/images/home-hero.jpg"
          alt="Souk Marrakech"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, rgba(26,22,18,0.6), rgba(80,40,20,0.4))' }} />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-center px-6 py-24 sm:px-10">
          <span className="pill-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
            Souk 3D Marrakech
          </span>
          <h1 className="mt-6 max-w-2xl text-5xl sm:text-6xl" style={{ color: '#fff', whiteSpace: 'pre-line' }}>
            {t('home.hero_title')}
          </h1>
          <p className="mt-5 max-w-xl text-lg" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {t('home.hero_sub')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/boutique-3d" className="public-btn-primary text-base">
              {t('home.cta_explore')}
            </Link>
            <Link to="/catalogue" className="public-btn-secondary text-base" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' }}>
              {t('home.cta_catalog')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-shell py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: '🏛️', title: 'Visite 3D immersive', desc: 'Explorez notre boutique en 3D réelle, scannée avec précision.' },
            { icon: '🛍️', title: 'Artisanat authentique', desc: '100% fait main par des artisans marocains certifiés.' },
            { icon: '🚚', title: 'Livraison partout', desc: 'Domicile, hôtel, riad ou retrait en boutique à Marrakech.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="panel-surface p-7 text-center">
              <span style={{ fontSize: 36 }}>{icon}</span>
              <h3 className="mt-4 text-xl font-semibold" style={{ color: '#1a1612' }}>{title}</h3>
              <p className="mt-2 text-sm" style={{ color: '#7a6a58' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
