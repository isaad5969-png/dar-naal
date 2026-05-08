import { Link } from 'react-router-dom'
import { useCartStore } from '../../stores/cartStore'
import { useLangStore } from '../../stores/langStore'
import { whatsappProductLink, formatPrice } from '../../lib/whatsapp'
import { getProductImage } from '../../lib/products'

export default function ProductPanel({ product, onClose }) {
  const addItem = useCartStore((s) => s.addItem)
  const t = useLangStore((s) => s.t)

  if (!product) return null

  const img = getProductImage(product)

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/30 md:bg-transparent" onClick={onClose} />
      <aside className="absolute inset-x-3 bottom-3 top-auto max-h-[84vh] overflow-hidden rounded-[30px] border border-white/70 bg-white/95 shadow-card backdrop-blur-xl md:inset-y-24 md:left-auto md:right-6 md:w-[430px]">

        <div className="flex items-start justify-between border-b border-[#e8dfc8] px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em]" style={{ color: '#b05c3a' }}>{t('product.product_sheet')}</p>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: '#1a1612' }}>{product.name}</h3>
          </div>
          <button type="button" onClick={onClose} className="public-btn-subtle px-3">{t('product.close')}</button>
        </div>

        <div className="max-h-[calc(84vh-88px)] space-y-5 overflow-y-auto px-5 py-5 md:max-h-[calc(100vh-14rem)]">
          <div className="overflow-hidden rounded-[26px] border border-[#e8dfc8]" style={{ background: '#faf6ee' }}>
            <img src={img} alt={product.name} className="h-56 w-full object-cover" />
          </div>

          <div className="flex flex-wrap gap-2">
            {product.isHandmade && <span className="product-badge">{t('product.handmade')}</span>}
            {product.isPremium && <span className="product-badge">{t('product.premium')}</span>}
            <span className="product-badge">{t('product.origin_label')} {product.origin}</span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm" style={{ color: '#7a6a58' }}>{product.category}</p>
              <p className="text-3xl font-semibold" style={{ color: '#b05c3a' }}>{formatPrice(product.price)}</p>
            </div>
            <div className="rounded-2xl px-4 py-3 text-right" style={{ background: '#faf6ee' }}>
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: '#a09080' }}>{t('product.stock_label')}</p>
              <p className="text-sm font-semibold" style={{ color: '#1a1612' }}>
                {product.stock > 0 ? `${product.stock} ${t('product.available')}` : t('product.on_order')}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm" style={{ color: '#5a4a3a' }}>
            <div>
              <p className="label-text">{t('product.short_desc')}</p>
              <p>{product.description}</p>
            </div>
            {product.detailedDescription && (
              <div>
                <p className="label-text">{t('product.detailed_desc')}</p>
                <p>{product.detailedDescription}</p>
              </div>
            )}
            <div>
              <p className="label-text">{t('product.artisan_story')}</p>
              <p>{product.story}</p>
            </div>

            <div className="grid gap-3 rounded-[26px] p-4 sm:grid-cols-2" style={{ background: '#faf6ee' }}>
              {[
                [t('product.artisan'), product.artisan],
                [t('product.material'), product.material],
                [t('product.origin'), product.origin],
                [t('product.travel'), product.isTouristFriendly ? t('product.travel_easy') : t('product.travel_ship')],
                [t('product.weight'), product.weight || '—'],
                [t('product.dimensions'), product.dimensions || '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-[0.18em]" style={{ color: '#a09080' }}>{label}</p>
                  <p className="mt-1 font-semibold" style={{ color: '#1a1612' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" className="public-btn-primary" onClick={() => addItem(product)}>
              {t('product.add_cart')}
            </button>
            <a href={whatsappProductLink(product)} target="_blank" rel="noreferrer" className="public-btn-secondary">
              {t('product.whatsapp')}
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to={`/products/${product.id}`} className="public-btn-secondary">{t('product.see_details')}</Link>
            <Link to="/cart" className="public-btn-secondary">{t('product.go_cart')}</Link>
          </div>
        </div>
      </aside>
    </div>
  )
}
