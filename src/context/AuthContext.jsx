import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  updateProfile, signInWithPopup, sendPasswordResetEmail, sendEmailVerification, signOut,
} from 'firebase/auth'
import { auth, googleProvider, firebaseReady } from '../services/firebase'
import { isFoundingAdmin } from '../services/auth'
import { hasAdminRecord } from '../services/admins'

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
  const [role, setRole] = useState({ isAdmin: false, isFounder: false })
  // While Firebase checks if someone is already signed in, pages wait
  const [loading, setLoading] = useState(firebaseReady)

  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, async u => {
      const plain = toUser(u)
      let next = { isAdmin: false, isFounder: false }
      if (plain) {
        const founder = isFoundingAdmin(plain)
        // Extra admins need a verified email too
        const extra = !founder && plain.verified ? await hasAdminRecord(plain.email) : false
        next = { isAdmin: founder || extra, isFounder: founder }
      }
      setUser(plain)
      setRole(next)
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
    isAdmin: role.isAdmin,
    isFounder: role.isFounder,
    resendVerification: () => sendEmailVerification(auth.currentUser),
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
