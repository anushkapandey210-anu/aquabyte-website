// Extra admins (added from the Admin page) are stored in Firestore,
// in a collection called "admins". Each document's id is the person's email.
import { collection, deleteDoc, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export const emailKey = email => email.trim().toLowerCase()

// Is this email in the admins list? Returns false if anything goes wrong.
export async function hasAdminRecord(email) {
  if (!db || !email) return false
  try {
    const snap = await getDoc(doc(db, 'admins', emailKey(email)))
    return snap.exists()
  } catch {
    return false
  }
}

// Live list of extra admins. Returns a function that stops listening.
export function watchAdmins(onChange, onError) {
  if (!db) { onError?.(new Error('no-db')); return () => {} }
  return onSnapshot(collection(db, 'admins'), snap => {
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    list.sort((a, b) => (b.addedAt?.seconds || 0) - (a.addedAt?.seconds || 0))
    onChange(list)
  }, onError)
}

export function addAdmin({ email, name, addedBy }) {
  const key = emailKey(email)
  return setDoc(doc(db, 'admins', key), { email: key, name: name.trim(), addedBy: emailKey(addedBy), addedAt: serverTimestamp() })
}

export function removeAdmin(email) {
  return deleteDoc(doc(db, 'admins', emailKey(email)))
}
