import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../stores/productStore'
import { useLangStore } from '../stores/langStore'
import { formatPrice } from '../lib/whatsapp'
import { getProductImage } from '../lib/products'
import { useCartStore } from '../stores/cartStore'

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
        <p className="text-[13px] text-[#7A7268] leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex items-end justify-between pt-1">
          <p className="text-[15px] font-semibold text-[#1C1C1A]">{formatPrice(product.price)}</p>
          <p className="text-[11px] text-[#9A8F82]">Marrakech Médina</p>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => addItem(product)}
            className="btn-dark flex-1 py-2.5 text-[12px]"
          >
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

function ProductSection({ title, products, categoryLink }) {
  if (!products.length) return null
  return (
    <section className="py-12">
      <div className="container-xl">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="section-label">Sélection</p>
            <h2 className="text-[32px] font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h2>
          </div>
          <Link to={categoryLink} className="text-[12px] font-medium border border-[#1C1C1A] rounded-full px-4 py-2 hover:bg-[#F0EBE3] transition text-[#1C1C1A]">
            Voir toute la sélection
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Faux feed Instagram avec les images produits
function InstagramSection({ products }) {
  const imgs = products.slice(0, 4)
  return (
    <section className="py-12 border-t border-[#E8E0D4]">
      <div className="container-xl">
        <p className="section-label">Instagram</p>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-[28px] font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
            Nos inspirations Instagram
          </h2>
          <p className="text-[13px] text-[#9A8F82]">Découvrez nos modèles, nos nouveautés et l'univers Dar Naal.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {imgs.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-lg aspect-square bg-[#F5F0E8]">
              <img
                src={getProductImage(p)}
                alt={p.name}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const products = useProductStore((s) => s.products)
  const loadProducts = useProductStore((s) => s.loadProducts)

  useEffect(() => { loadProducts().catch(console.error) }, [loadProducts])

  const active = products.filter((p) => p.status === 'active')
  const babouches = active.filter((p) => p.category === 'Babouches')
  const deco = active.filter((p) => ['Décoration', 'Art de la table'].includes(p.category))
  const beaute = active.filter((p) => ['Beauté', 'Bijoux', 'Maroquinerie'].includes(p.category))

  return (
    <div style={{ background: '#FAF7F2' }}>

      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: '88vh' }}>
        <img
          src="/dar-naal/images/home-hero.jpg"
          alt="Souk Marrakech"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(28,28,26,0.18) 0%, rgba(28,28,26,0.52) 100%)' }} />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/80 mb-6">
            SOUK 3D MARRAKECH
          </p>
          <h1 className="text-white mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 500, lineHeight: 1.1 }}>
            Découvrez l'artisanat<br />marocain autrement.
          </h1>
          <p className="text-white/80 text-[15px] max-w-xl mx-auto mb-10 leading-relaxed">
            Explorez notre boutique immersive, cliquez sur les produits et commandez directement depuis le Souk 3D.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/boutique-3d" className="btn-hero-dark">
              Entrer dans le Souk 3D
            </Link>
            <Link to="/catalogue" className="btn-outline-white">
              Voir les collections
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured bar ──────────────────────────── */}
      <div className="border-y border-[#E8E0D4] bg-white py-4">
        <div className="container-xl flex flex-wrap items-center justify-center gap-8 text-[11px] font-medium tracking-[0.15em] uppercase text-[#5A5248]">
          <span>✦ Artisanat 100% Fait Main</span>
          <span>✦ Livraison Marrakech & International</span>
          <span>✦ Boutique 3D Immersive</span>
          <span>✦ Retrait en Boutique</span>
        </div>
      </div>

      {/* ── Babouches ─────────────────────────────── */}
      <ProductSection title="Babouches &amp; sandales" products={babouches} categoryLink="/catalogue" />

      {/* ── Décoration ────────────────────────────── */}
      {deco.length > 0 && (
        <div className="border-t border-[#E8E0D4]">
          <ProductSection title="Décoration &amp; art de vivre" products={deco} categoryLink="/catalogue" />
        </div>
      )}

      {/* ── Beauté & Bijoux ───────────────────────── */}
      {beaute.length > 0 && (
        <div className="border-t border-[#E8E0D4]">
          <ProductSection title="Beauté, bijoux &amp; accessoires" products={beaute} categoryLink="/catalogue" />
        </div>
      )}

      {/* ── Instagram ─────────────────────────────── */}
      {active.length > 0 && <InstagramSection products={active.slice(4, 8)} />}

      {/* ── Footer ────────────────────────────────── */}
      <footer className="border-t border-[#E8E0D4] bg-white py-10">
        <div className="container-xl flex flex-col items-center gap-4 text-center">
          <img src="/dar-naal/images/logo-dar-naal.png" alt="Dar Naal" className="h-12 w-auto" />
          <p className="text-[12px] text-[#9A8F82] tracking-wider uppercase">Marrakech · Artisanat Sélectionné</p>
          <p className="text-[12px] text-[#B0A898]">© 2026 Dar Naal. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
