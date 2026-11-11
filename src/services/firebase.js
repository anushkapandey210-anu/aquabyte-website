// Firebase setup. The keys come from the .env.local file (and from Vercel's
// Environment Variables when the site is live). They are safe to be public,
// but keeping them in .env makes it easy to switch projects.
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// True once the keys are filled in. Until then the site still runs, and the
// login page shows a note instead of crashing.
export const firebaseReady = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId)

export const app = firebaseReady ? initializeApp(config) : null
export const auth = app ? getAuth(app) : null

export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
