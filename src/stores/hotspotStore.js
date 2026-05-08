import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

const COLLECTION = 'hotspots'

const DEFAULT_HOTSPOTS = [
  { id: 'hs-001', productId: 'babouches-camel-brodees', label: 'Camel brodées', position: [-0.407, 0.5, 0.914], active: true, sceneId: 'store_scan' },
  { id: 'hs-002', productId: 'babouches-noir-atelier', label: 'Noir atelier', position: [-0.208, 0.5, 0.978], active: true, sceneId: 'store_scan' },
  { id: 'hs-003', productId: 'babouches-ivoire-fines', label: 'Ivoire fines', position: [0.233, 0.5, 0.999], active: true, sceneId: 'store_scan' },
  { id: 'hs-004', productId: 'babouches-bleu-majorelle', label: 'Bleu Majorelle', position: [0.686, 0.655, 0.711], active: true, sceneId: 'store_scan' },
  { id: 'hs-005', productId: 'babouches-sable-dore', label: 'Sable doré', position: [0.88, 0.784, 0.589], active: true, sceneId: 'store_scan' },
]

function normalize(data, id) {
  return {
    id,
    productId: data.productId ?? '',
    label: data.label ?? '',
    position: Array.isArray(data.position) ? data.position : [0, 0.5, 0],
    active: data.active ?? true,
    sceneId: data.sceneId ?? 'store_scan',
  }
}

function genId(existing = []) {
  const id = `hs-${crypto.randomUUID().slice(0, 8)}`
  return existing.some((h) => h.id === id) ? genId(existing) : id
}

export const useHotspotStore = create(
  persist(
    (set, get) => ({
      hotspots: DEFAULT_HOTSPOTS,
      hasLoaded: false,
      isLoading: false,

      loadHotspots: async () => {
        if (get().isLoading) return get().hotspots
        set({ isLoading: true })
        try {
          const snap = await getDocs(collection(db, COLLECTION))
          if (snap.empty) {
            set({ hotspots: DEFAULT_HOTSPOTS, hasLoaded: true, isLoading: false })
            return DEFAULT_HOTSPOTS
          }
          const hotspots = snap.docs.map((d) => normalize(d.data(), d.id))
          set({ hotspots, hasLoaded: true, isLoading: false })
          return hotspots
        } catch {
          set({ hasLoaded: true, isLoading: false })
          return get().hotspots
        }
      },

      addHotspot: async (data = {}) => {
        const hotspots = get().hotspots
        const id = data.id || genId(hotspots)
        const hs = normalize({ ...data }, id)
        await setDoc(doc(db, COLLECTION, id), { ...hs, createdAt: serverTimestamp() })
        set({ hotspots: [...hotspots.filter((h) => h.id !== id), hs] })
        return hs
      },

      updateHotspot: async (id, updates) => {
        const existing = get().hotspots.find((h) => h.id === id) ?? { id }
        const hs = normalize({ ...existing, ...updates }, id)
        await setDoc(doc(db, COLLECTION, id), { ...hs, updatedAt: serverTimestamp() }, { merge: true })
        set({ hotspots: get().hotspots.map((h) => h.id === id ? hs : h) })
        return hs
      },

      assignProduct: async (hotspotId, productId) => {
        return get().updateHotspot(hotspotId, { productId })
      },

      toggleActive: async (id) => {
        const hs = get().hotspots.find((h) => h.id === id)
        if (!hs) return null
        return get().updateHotspot(id, { active: !hs.active })
      },

      deleteHotspot: async (id) => {
        await deleteDoc(doc(db, COLLECTION, id))
        set({ hotspots: get().hotspots.filter((h) => h.id !== id) })
      },
    }),
    {
      name: 'souk3d-hotspots',
      partialize: (s) => ({ hotspots: s.hotspots }),
    }
  )
)
