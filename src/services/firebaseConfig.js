import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyDzlLTIj9KpWibsaDwbiSlDR4c_1a6dnuQ",
  authDomain: "health-arogya.firebaseapp.com",
  projectId: "health-arogya",
  storageBucket: "health-arogya.firebasestorage.app",
  messagingSenderId: "106590983581",
  appId: "1:106590983581:web:1e87745b56a1dda87ccb74",
  measurementId: "G-6Z8PRT3M0G"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

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