import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

// TODO: Remplacez ces valeurs par votre propre projet Firebase
// Allez sur https://console.firebase.google.com → Paramètres du projet → Config web
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_BUCKET",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId: "VOTRE_APP_ID",
  // Optionnel mais recommandé :
  measurementId: "VOTRE_MEASUREMENT_ID",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// --- Firebase Cloud Messaging (notifications push) ---
let messaging = null
try {
  messaging = getMessaging(app)
} catch {
  // FCM non supporté dans cet environnement (ex: navigateur sans service worker)
}
export { messaging }

export async function requestNotificationPermission() {
  if (!messaging) return null
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null

    // VAPID key : Paramètres Firebase → Cloud Messaging → Web push certificates
    const token = await getToken(messaging, {
      vapidKey: 'VOTRE_VAPID_KEY_PUBLIC',
    })
    return token
  } catch (err) {
    console.error('FCM token error:', err)
    return null
  }
}

export function onForegroundMessage(callback) {
  if (!messaging) return () => {}
  return onMessage(messaging, callback)
}
