import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../services/firebaseConfig'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

// Demo mode for when Firebase Auth is not configured
const DEMO_MODE = true // Set to false when Firebase Auth is properly configured

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [demoUser, setDemoUser] = useState(null)

  useEffect(() => {
    if (DEMO_MODE) {
      // Check for demo user in localStorage
      const savedDemoUser = localStorage.getItem('demoUser')
      if (savedDemoUser) {
        setDemoUser(JSON.parse(savedDemoUser))
        setUser(JSON.parse(savedDemoUser))
      }
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = async (email, password) => {
    if (DEMO_MODE) {
      // Demo login - accept any email/password
      const demoUser = {
        uid: 'demo-user-123',
        email: email,
        displayName: email.split('@')[0]
      }
      setDemoUser(demoUser)
      setUser(demoUser)
      localStorage.setItem('demoUser', JSON.stringify(demoUser))
      return Promise.resolve()
    }
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signup = async (email, password) => {
    if (DEMO_MODE) {
      // Demo signup - accept any email/password
      const demoUser = {
        uid: 'demo-user-' + Date.now(),
        email: email,
        displayName: email.split('@')[0]
      }
      setDemoUser(demoUser)
      setUser(demoUser)
      localStorage.setItem('demoUser', JSON.stringify(demoUser))
      return Promise.resolve()
    }
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    if (DEMO_MODE) {
      setDemoUser(null)
      setUser(null)
      localStorage.removeItem('demoUser')
      return Promise.resolve()
    }
    return signOut(auth)
  }

  const value = { user: user || demoUser, login, signup, logout, isDemoMode: DEMO_MODE }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}