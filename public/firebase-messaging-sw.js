// Service Worker Firebase Cloud Messaging
// Ce fichier DOIT être à la racine du site (public/)
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js')

// TODO: Copiez ici la même config que dans src/lib/firebase.js
firebase.initializeApp({
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_BUCKET",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId: "VOTRE_APP_ID",
})

const messaging = firebase.messaging()

// Affiche la notification quand l'app est en arrière-plan
messaging.onBackgroundMessage((payload) => {
  const { title = 'Souk 3D', body = '' } = payload.notification ?? {}
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
  })
})
