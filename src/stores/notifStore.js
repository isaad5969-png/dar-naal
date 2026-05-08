import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { requestNotificationPermission, onForegroundMessage } from '../lib/firebase'

export const useNotifStore = create(
  persist(
    (set, get) => ({
      permission: 'default', // 'default' | 'granted' | 'denied'
      fcmToken: null,
      toasts: [],

      requestPermission: async () => {
        const token = await requestNotificationPermission()
        const perm = Notification.permission
        set({ permission: perm, fcmToken: token })
        return { permission: perm, token }
      },

      initForegroundListener: () => {
        return onForegroundMessage((payload) => {
          const toast = {
            id: Date.now(),
            title: payload.notification?.title ?? 'Notification',
            body: payload.notification?.body ?? '',
          }
          set((s) => ({ toasts: [...s.toasts, toast] }))
          setTimeout(() => {
            set((s) => ({ toasts: s.toasts.filter((t) => t.id !== toast.id) }))
          }, 6000)
        })
      },

      showToast: (title, body) => {
        const toast = { id: Date.now(), title, body }
        set((s) => ({ toasts: [...s.toasts, toast] }))
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== toast.id) }))
        }, 6000)
      },

      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    { name: 'souk3d-notif', partialize: (s) => ({ permission: s.permission, fcmToken: s.fcmToken }) }
  )
)
