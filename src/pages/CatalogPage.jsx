import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../stores/productStore'
import { useLangStore } from '../stores/langStore'
import { formatPrice } from '../lib/whatsapp'
import { getProductImage } from '../lib/products'

export default function CatalogPage() {
  const t = useLangStore((s) => s.t)
  const products = useProductStore((s) => s.products)
  const loadProducts = useProductStore((s) => s.loadProducts)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => { loadProducts().catch(console.error) }, [loadProducts])

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))]
  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !category || p.category === category
    return p.status === 'active' && matchSearch && matchCat
  })

  return (
    <section className="section-shell pb-16">
      <div className="mb-6">
        <span className="pill-badge">{t('nav.catalog')}</span>
        <h1 className="mt-4 text-4xl" style={{ color: '#1a1612' }}>Catalogue</h1>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="search"
          className="input-field max-w-xs"
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input-field max-w-[200px]" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Toutes catégories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || category) && (
          <button className="public-btn-subtle" onClick={() => { setSearch(''); setCategory('') }}>
            Effacer les filtres
          </button>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`} className="panel-surface group block overflow-hidden transition hover:-translate-y-1 hover:shadow-card">
            <div className="overflow-hidden" style={{ background: '#faf6ee', borderRadius: '26px 26px 0 0' }}>
              <img src={getProductImage(product)} alt={product.name} className="h-48 w-full object-cover transition group-hover:scale-105" />
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-1 mb-2">
                {product.isHandmade && <span className="product-badge">{t('product.handmade')}</span>}
                {product.isPremium && <span className="product-badge">{t('product.premium')}</span>}
              </div>
              <h3 className="text-base font-semibold leading-snug" style={{ color: '#1a1612' }}>{product.name}</h3>
              <p className="mt-1 text-xs" style={{ color: '#7a6a58' }}>{product.category}</p>
              <p className="mt-2 text-lg font-semibold" style={{ color: '#b05c3a' }}>{formatPrice(product.price)}</p>
              {product.stock <= 0 && (
                <p className="mt-1 text-xs" style={{ color: '#a09080' }}>{t('product.on_order')}</p>
              )}
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full panel-surface px-8 py-14 text-center">
            <p className="text-xl font-semibold" style={{ color: '#1a1612' }}>Aucun produit trouvé.</p>
          </div>
        )}
      </div>
    </section>
  )
}
