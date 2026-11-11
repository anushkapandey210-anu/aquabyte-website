import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  updateProfile, signInWithPopup, sendPasswordResetEmail, sendEmailVerification, signOut,
} from 'firebase/auth'
import { auth, googleProvider, firebaseReady } from '../services/firebase'

const AuthContext = createContext(null)

// A small, plain version of the Firebase user that the rest of the site uses
function toUser(u) {
  if (!u) return null
  return {
    uid: u.uid,
    email: u.email || '',
    name: u.displayName || (u.email ? u.email.split('@')[0] : 'there'),
    photo: u.photoURL || '',
    verified: u.emailVerified,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // While Firebase checks if someone is already signed in, pages wait
  const [loading, setLoading] = useState(firebaseReady)

  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, u => {
      setUser(toUser(u))
      setLoading(false)
    })
    return () => { unsubscribe() }
  }, [])

  async function signup({ name, email, password }) {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
    if (name) await updateProfile(cred.user, { displayName: name })
    setUser(toUser(auth.currentUser))
    // Sends a "verify your email" message. Not required to log in.
    sendEmailVerification(cred.user).catch(() => {})
    return cred.user
  }

  const value = {
    user,
    loading,
    firebaseReady,
    signup,
    login: (email, password) => signInWithEmailAndPassword(auth, email.trim(), password),
    loginWithGoogle: () => signInWithPopup(auth, googleProvider),
    resetPassword: email => sendPasswordResetEmail(auth, email.trim()),
    logout: () => signOut(auth),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
