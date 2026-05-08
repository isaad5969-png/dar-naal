import { useState, useEffect } from 'react'
import { useHotspotStore } from '../stores/hotspotStore'
import { useProductStore } from '../stores/productStore'
import { useLangStore } from '../stores/langStore'
import StoreScene from '../components/3d/StoreScene'
import ProductPanel from '../components/ui/ProductPanel'

const MODEL_CONFIG = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: 1,
  cameraCenter: [0, 0, 0],
  initialYaw: 0,
  initialPitch: -0.02,
  initialFov: 72,
}

export default function StorePage() {
  const t = useLangStore((s) => s.t)
  const hotspots = useHotspotStore((s) => s.hotspots)
  const loadHotspots = useHotspotStore((s) => s.loadHotspots)
  const products = useProductStore((s) => s.products)
  const loadProducts = useProductStore((s) => s.loadProducts)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    loadHotspots().catch(console.error)
    loadProducts().catch(console.error)
  }, [loadHotspots, loadProducts])

  const selectedProduct = selectedId ? products.find((p) => p.id === selectedId) : null

  return (
    <section className="section-shell pb-10">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: '#b05c3a' }}>
          {t('store.hint')}
        </p>
      </div>

      <StoreScene
        hotspots={hotspots}
        selectedProductId={selectedId}
        onSelectProduct={(id) => setSelectedId((prev) => prev === id ? null : id)}
        modelConfig={MODEL_CONFIG}
      />

      {selectedProduct && (
        <ProductPanel product={selectedProduct} onClose={() => setSelectedId(null)} />
      )}
    </section>
  )
}
