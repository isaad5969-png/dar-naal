import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_BUCKET",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId: "VOTRE_APP_ID",
}

// true uniquement quand les vraies clés sont renseignées
export const isFirebaseConfigured =
  firebaseConfig.apiKey !== 'VOTRE_API_KEY' &&
  firebaseConfig.projectId !== 'VOTRE_PROJECT_ID'

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// --- Notifications push (FCM) ---
export async function requestNotificationPermission() {
  if (!isFirebaseConfigured) return null
  try {
    const { getMessaging, getToken } = await import('firebase/messaging')
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') return null
    const msg = getMessaging(app)
    return await getToken(msg, { vapidKey: 'VOTRE_VAPID_KEY_PUBLIC' })
  } catch (err) {
    console.error('FCM token error:', err)
    return null
  }
}

export function onForegroundMessage(callback) {
  if (!isFirebaseConfigured) return () => {}
  import('firebase/messaging').then(({ getMessaging, onMessage }) => {
    onMessage(getMessaging(app), callback)
  })
  return () => {}
}
