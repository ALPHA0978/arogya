import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDzlLTIj9KpWibsaDwbiSlDR4c_1a6dnuQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "health-arogya.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "health-arogya",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "health-arogya.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "106590983581",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:106590983581:web:1e87745b56a1dda87ccb74",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6Z8PRT3M0G"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()

// Only initialize analytics in production
let analytics = null
try {
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    analytics = getAnalytics(app)
  }
} catch (error) {
  console.warn('Analytics not available:', error.message)
}

export { analytics }
export default app