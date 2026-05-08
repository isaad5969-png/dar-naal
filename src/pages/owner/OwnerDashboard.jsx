import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../../stores/productStore'
import { useHotspotStore } from '../../stores/hotspotStore'
import { useLangStore } from '../../stores/langStore'

function StatCard({ label, value, helper }) {
  return (
    <article className="panel-surface p-6">
      <p className="text-xs uppercase tracking-[0.18em]" style={{ color: '#a09080' }}>{label}</p>
      <p className="mt-3 text-4xl font-semibold" style={{ color: '#1a1612' }}>{value}</p>
      <p className="mt-2 text-sm" style={{ color: '#7a6a58' }}>{helper}</p>
    </article>
  )
}

export default function OwnerDashboard() {
  const t = useLangStore((s) => s.t)
  const products = useProductStore((s) => s.products)
  const loadProducts = useProductStore((s) => s.loadProducts)
  const hotspots = useHotspotStore((s) => s.hotspots)
  const loadHotspots = useHotspotStore((s) => s.loadHotspots)

  useEffect(() => {
    loadProducts().catch(console.error)
    loadHotspots().catch(console.error)
  }, [loadProducts, loadHotspots])

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === 'active').length,
    outStock: products.filter((p) => p.stock <= 0).length,
    premium: products.filter((p) => p.isPremium).length,
    hotspots: hotspots.filter((h) => h.productId).length,
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('owner.total')} value={stats.total} helper="Toutes les références gérées." />
        <StatCard label={t('owner.active')} value={stats.active} helper="Visibles côté client." />
        <StatCard label={t('owner.out_stock')} value={stats.outStock} helper="À surveiller ou passer en brouillon." />
        <StatCard label={t('owner.premium')} value={stats.premium} helper="Pièces premium signalées." />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel-surface p-6">
          <span className="pill-badge">{t('owner.quick_access')}</span>
          <h2 className="mt-4 text-3xl font-semibold" style={{ color: '#1a1612' }}>Gestion catalogue & hotspots</h2>
          <p className="mt-4 max-w-3xl text-base" style={{ color: '#5a4a3a' }}>{t('owner.quick_desc')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/owner/products" className="primary-button">{t('owner.manage_products')}</Link>
            <Link to="/owner/products/new" className="secondary-button">{t('owner.add_product')}</Link>
            <Link to="/owner/hotspots" className="secondary-button">{t('owner.manage_hotspots')}</Link>
          </div>
        </div>
        <div className="panel-surface p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: '#b05c3a' }}>
            Résumé hotspots
          </p>
          <div className="mt-5 rounded-[28px] p-5" style={{ background: '#faf6ee' }}>
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: '#a09080' }}>{t('owner.hotspots_linked')}</p>
            <p className="mt-3 text-4xl font-semibold" style={{ color: '#1a1612' }}>{stats.hotspots}</p>
            <p className="mt-2 text-sm" style={{ color: '#7a6a58' }}>Les hotspots liés à un produit actif remontent automatiquement dans la boutique 3D.</p>
          </div>
          <Link to="/owner/hotspots" className="ghost-button mt-5 inline-flex rounded-full border border-[#e8dfc8]">
            Ouvrir la gestion hotspots
          </Link>
        </div>
      </section>
    </div>
  )
}
