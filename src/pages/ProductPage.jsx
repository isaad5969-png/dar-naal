import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProductStore } from '../stores/productStore'
import { useCartStore } from '../stores/cartStore'
import { useLangStore } from '../stores/langStore'
import { whatsappProductLink, formatPrice } from '../lib/whatsapp'
import { getProductImage } from '../lib/products'

export default function ProductPage() {
  const { id } = useParams()
  const t = useLangStore((s) => s.t)
  const products = useProductStore((s) => s.products)
  const loadProducts = useProductStore((s) => s.loadProducts)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => { loadProducts().catch(console.error) }, [loadProducts])

  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <section className="section-shell pb-16">
        <div className="panel-surface px-8 py-14 text-center">
          <h1 className="text-4xl">Produit introuvable.</h1>
          <Link to="/catalogue" className="public-btn-primary mt-6 inline-flex">Retour au catalogue</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section-shell pb-16">
      <div className="mb-4">
        <Link to="/catalogue" className="public-btn-subtle text-sm">← Retour au catalogue</Link>
      </div>

      <div className="panel-surface overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="overflow-hidden" style={{ background: '#faf6ee' }}>
            <img src={getProductImage(product)} alt={product.name} className="h-full w-full object-cover" style={{ minHeight: 300 }} />
          </div>

          <div className="p-7 space-y-5">
            <div>
              <span className="pill-badge">{product.category}</span>
              <h1 className="mt-4 text-4xl" style={{ color: '#1a1612' }}>{product.name}</h1>
              <p className="mt-2 text-3xl font-semibold" style={{ color: '#b05c3a' }}>{formatPrice(product.price)}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.isHandmade && <span className="product-badge">{t('product.handmade')}</span>}
              {product.isPremium && <span className="product-badge">{t('product.premium')}</span>}
              <span className="product-badge">{t('product.origin_label')} {product.origin}</span>
            </div>

            <div className="rounded-[26px] p-5 space-y-3" style={{ background: '#faf6ee' }}>
              <p className="text-sm" style={{ color: '#5a4a3a' }}>{product.description}</p>
              {product.detailedDescription && <p className="text-sm" style={{ color: '#5a4a3a' }}>{product.detailedDescription}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-[26px] p-4" style={{ background: '#faf6ee' }}>
              {[
                [t('product.artisan'), product.artisan],
                [t('product.material'), product.material],
                [t('product.weight'), product.weight || '—'],
                [t('product.dimensions'), product.dimensions || '—'],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-[0.15em]" style={{ color: '#a09080' }}>{label}</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: '#1a1612' }}>{val}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="label-text">{t('product.artisan_story')}</p>
              <p className="text-sm" style={{ color: '#5a4a3a' }}>{product.story}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button className="public-btn-primary" onClick={() => addItem(product)}>
                {t('product.add_cart')}
              </button>
              <a href={whatsappProductLink(product)} target="_blank" rel="noreferrer" className="public-btn-secondary">
                {t('product.whatsapp')}
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link to="/cart" className="public-btn-secondary">{t('product.go_cart')}</Link>
              <Link to="/boutique-3d" className="public-btn-secondary">{t('nav.store3d')}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
