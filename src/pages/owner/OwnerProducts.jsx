import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../../stores/productStore'
import { useLangStore } from '../../stores/langStore'
import { formatPrice } from '../../lib/whatsapp'
import { getProductImage } from '../../lib/products'

export default function OwnerProducts() {
  const t = useLangStore((s) => s.t)
  const products = useProductStore((s) => s.products)
  const loadProducts = useProductStore((s) => s.loadProducts)
  const deleteProduct = useProductStore((s) => s.deleteProduct)

  useEffect(() => { loadProducts().catch(console.error) }, [loadProducts])

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return
    await deleteProduct(id)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold" style={{ color: '#1a1612' }}>{t('owner.products')}</h2>
        <Link to="/owner/products/new" className="primary-button">{t('owner.add_product')}</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => (
          <div key={p.id} className="panel-surface overflow-hidden">
            <img src={getProductImage(p)} alt={p.name} className="h-36 w-full object-cover" style={{ background: '#faf6ee' }} />
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.15em]" style={{ color: '#a09080' }}>{p.category}</p>
                <h3 className="text-base font-semibold mt-1" style={{ color: '#1a1612' }}>{p.name}</h3>
                <p className="text-lg font-semibold" style={{ color: '#b05c3a' }}>{formatPrice(p.price)}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="product-badge">{p.status === 'active' ? '✓ Actif' : '⊘ Brouillon'}</span>
                <span className="product-badge">Stock: {p.stock}</span>
                {p.isPremium && <span className="product-badge">Premium</span>}
              </div>
              <div className="flex gap-2">
                <Link to={`/owner/products/${p.id}`} className="secondary-button flex-1 text-center text-sm py-2">Modifier</Link>
                <button onClick={() => handleDelete(p.id)} className="public-btn-subtle px-3 py-2 text-sm" style={{ color: '#c0392b' }}>Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!products.length && (
        <div className="panel-surface px-8 py-14 text-center">
          <p className="text-xl font-semibold">Aucun produit.</p>
          <Link to="/owner/products/new" className="primary-button mt-6 inline-flex">{t('owner.add_product')}</Link>
        </div>
      )}
    </div>
  )
}
