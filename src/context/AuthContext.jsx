import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db, googleProvider } from '../services/firebaseConfig'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)


const DEMO_MODE = false // Set to false when Firebase Auth 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
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

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        // Fetch user profile from Firestore
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid))
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data())
          } else {
            // New user without profile
            setUserProfile({ profileComplete: false })
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
          setUserProfile({ profileComplete: false })
        }
      } else {
        setUserProfile(null)
      }
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

  const loginWithGoogle = async () => {
    if (DEMO_MODE) return Promise.resolve()
    return signInWithPopup(auth, googleProvider)
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
    setUserProfile(null)
    return signOut(auth)
  }

  const updateUserProfile = async (profileData) => {
    if (!user) return
    
    const userDoc = {
      ...profileData,
      email: user.email,
      uid: user.uid,
      createdAt: new Date().toISOString(),
      profileComplete: true
    }
    
    await setDoc(doc(db, 'users', user.uid), userDoc)
    setUserProfile(userDoc)
  }

  const value = { 
    user: user || demoUser, 
    userProfile,
    login, 
    loginWithGoogle,
    signup, 
    logout, 
    updateUserProfile,
    isDemoMode: DEMO_MODE 
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}