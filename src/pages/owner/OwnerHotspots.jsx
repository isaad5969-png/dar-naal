import { useEffect, useState } from 'react'
import { useHotspotStore } from '../../stores/hotspotStore'
import { useProductStore } from '../../stores/productStore'
import { useLangStore } from '../../stores/langStore'

export default function OwnerHotspots() {
  const t = useLangStore((s) => s.t)
  const hotspots = useHotspotStore((s) => s.hotspots)
  const loadHotspots = useHotspotStore((s) => s.loadHotspots)
  const addHotspot = useHotspotStore((s) => s.addHotspot)
  const updateHotspot = useHotspotStore((s) => s.updateHotspot)
  const assignProduct = useHotspotStore((s) => s.assignProduct)
  const toggleActive = useHotspotStore((s) => s.toggleActive)
  const deleteHotspot = useHotspotStore((s) => s.deleteHotspot)
  const products = useProductStore((s) => s.products)
  const loadProducts = useProductStore((s) => s.loadProducts)
  const [newLabel, setNewLabel] = useState('')

  useEffect(() => {
    loadHotspots().catch(console.error)
    loadProducts().catch(console.error)
  }, [loadHotspots, loadProducts])

  const handleAdd = async () => {
    if (!newLabel.trim()) return
    await addHotspot({ label: newLabel.trim(), position: [0, 0.5, 0], active: true })
    setNewLabel('')
  }

  const handleAssign = async (hotspotId, productId) => {
    await assignProduct(hotspotId, productId)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce hotspot ?')) return
    await deleteHotspot(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-semibold" style={{ color: '#1a1612' }}>{t('owner.hotspots')}</h2>
        <div className="flex gap-2">
          <input
            className="input-field"
            style={{ width: 200 }}
            placeholder="Nouveau hotspot..."
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="primary-button" onClick={handleAdd}>Ajouter</button>
        </div>
      </div>

      <div className="panel-surface p-5 text-sm" style={{ color: '#7a6a58', background: '#faf6ee', borderRadius: 20 }}>
        💡 Pour placer un hotspot précisément dans la scène 3D, activez le mode debug (<code>debugCoordinates=true</code>) dans StoreScene.jsx et cliquez dans la scène — les coordonnées s'affichent dans la console.
      </div>

      <div className="space-y-4">
        {hotspots.map((hs) => {
          const linked = products.find((p) => p.id === hs.productId)
          return (
            <div key={hs.id} className="panel-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${hs.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <p className="font-semibold text-sm" style={{ color: '#1a1612' }}>{hs.label || hs.id}</p>
                    <span className="product-badge text-[10px]">{hs.id}</span>
                  </div>
                  <p className="mt-1 text-xs font-mono" style={{ color: '#a09080' }}>
                    Position : [{hs.position.join(', ')}]
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="public-btn-subtle px-3 py-1.5 text-xs" onClick={() => toggleActive(hs.id)}>
                    {hs.active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button className="public-btn-subtle px-3 py-1.5 text-xs" style={{ color: '#c0392b' }} onClick={() => handleDelete(hs.id)}>
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label-text">Produit associé</label>
                  <select
                    className="input-field"
                    value={hs.productId}
                    onChange={(e) => handleAssign(hs.id, e.target.value)}
                  >
                    <option value="">— Aucun produit —</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-text">Label affiché</label>
                  <input
                    className="input-field"
                    defaultValue={hs.label}
                    onBlur={(e) => updateHotspot(hs.id, { label: e.target.value })}
                  />
                </div>
              </div>

              {linked && (
                <div className="mt-3 flex items-center gap-2 rounded-2xl p-3" style={{ background: '#f2e8d4' }}>
                  <span style={{ fontSize: 16 }}>🔗</span>
                  <p className="text-sm font-medium" style={{ color: '#b05c3a' }}>{linked.name} — {linked.category}</p>
                </div>
              )}
            </div>
          )
        })}

        {!hotspots.length && (
          <div className="panel-surface px-8 py-14 text-center">
            <p className="text-xl font-semibold">Aucun hotspot configuré.</p>
            <p className="mt-2 text-sm" style={{ color: '#7a6a58' }}>Ajoutez des hotspots pour les relier aux produits dans la boutique 3D.</p>
          </div>
        )}
      </div>
    </div>
  )
}
