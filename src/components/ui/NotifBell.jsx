import { useEffect } from 'react'
import { useNotifStore } from '../../stores/notifStore'
import { useLangStore } from '../../stores/langStore'

export default function NotifBell() {
  const { permission, toasts, requestPermission, initForegroundListener, dismissToast } = useNotifStore()
  const t = useLangStore((s) => s.t)

  useEffect(() => {
    const unsub = initForegroundListener()
    return unsub
  }, [initForegroundListener])

  const handleClick = async () => {
    if (permission !== 'granted') {
      await requestPermission()
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        title={permission === 'granted' ? t('notifications.enabled') : t('notifications.enable')}
        className="public-btn-subtle relative px-3 py-2"
        style={{ fontSize: 18 }}
      >
        {permission === 'granted' ? '🔔' : '🔕'}
      </button>

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2" style={{ maxWidth: 320 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="panel-surface shadow-card flex items-start gap-3 px-5 py-4"
            style={{ animation: 'slideIn 0.2s ease' }}
          >
            <span style={{ fontSize: 20 }}>🔔</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: '#1a1612' }}>{toast.title}</p>
              {toast.body && <p className="text-xs mt-0.5" style={{ color: '#5a4a3a' }}>{toast.body}</p>}
            </div>
            <button onClick={() => dismissToast(toast.id)} className="public-btn-subtle px-2 py-1 text-xs">✕</button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
