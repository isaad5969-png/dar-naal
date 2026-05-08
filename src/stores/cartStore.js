import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items
        const existing = items.find((i) => i.productId === product.id)
        if (existing) {
          set({ items: items.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i) })
        } else {
          set({ items: [...items, { productId: product.id, name: product.name, price: product.price, quantity: 1 }] })
        }
      },

      updateQuantity: (productId, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) })
        } else {
          set({ items: get().items.map((i) => i.productId === productId ? { ...i, quantity: qty } : i) })
        }
      },

      removeItem: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'souk3d-cart' }
  )
)
