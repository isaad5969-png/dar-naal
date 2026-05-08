import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../stores/productStore'
import { useCartStore } from '../stores/cartStore'
import { formatPrice } from '../lib/whatsapp'
import { getProductImage } from '../lib/products'

function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem)
  return (
    <div className="product-card">
      <div className="overflow-hidden bg-[#F5F0E8]" style={{ aspectRatio: '4/3' }}>
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-4 space-y-2.5">
        <div className="flex flex-wrap gap-1.5">
          {product.isHandmade && <span className="badge">Fait main</span>}
          {product.isPremium && <span className="badge">Premium</span>}
        </div>
        <p className="label-category">{product.category?.toUpperCase()}</p>
        <h3 className="text-[17px] leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
          {product.name}
        </h3>
        <p className="text-[13px] leading-relaxed line-clamp-2" style={{ color: '#7A7268' }}>{product.description}</p>
        <div className="flex items-end justify-between pt-1">
          <p className="text-[15px] font-semibold">{formatPrice(product.price)}</p>
          <p className="text-[11px]" style={{ color: '#9A8F82' }}>Marrakech Médina</p>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={() => addItem(product)} className="btn-dark flex-1 py-2.5 text-[12px]">
            Ajouter au panier
          </button>
          <Link to={`/products/${product.id}`} className="btn-outline px-4 py-2.5 text-[12px]">
            Voir la fiche
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CatalogPage() {
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
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
      {/* Page header */}
      <div className="border-b border-[#E8E0D4] bg-white py-10 text-center">
        <p className="section-label">Boutique</p>
        <h1 className="mt-2 text-[40px] font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
          Nos Collections
        </h1>
        <p className="mt-2 text-[14px]" style={{ color: '#9A8F82' }}>
          Artisanat marocain authentique, sélectionné à Marrakech
        </p>
      </div>

      <div className="container-xl py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3 items-center">
          <input
            type="search"
            className="input-field"
            style={{ maxWidth: 260 }}
            placeholder="Rechercher un produit…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('')}
              className={`text-[12px] font-medium rounded-full px-4 py-2 border transition ${!category ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]' : 'border-[#DDD7CE] text-[#5A5248] hover:bg-[#F0EBE3]'}`}
            >
              Tout
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c === category ? '' : c)}
                className={`text-[12px] font-medium rounded-full px-4 py-2 border transition ${category === c ? 'bg-[#1C1C1A] text-white border-[#1C1C1A]' : 'border-[#DDD7CE] text-[#5A5248] hover:bg-[#F0EBE3]'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {!filtered.length && (
          <div className="py-20 text-center">
            <p className="text-[20px] font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>Aucun produit trouvé.</p>
            <button onClick={() => { setSearch(''); setCategory('') }} className="btn-outline mt-4">
              Effacer les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
