import { useEffect, useState } from 'react'
import { Lock, ShieldPlus, Trash2, Loader2, Crown } from 'lucide-react'
import { ADMINS } from '../services/auth'
import { addAdmin, emailKey, removeAdmin, watchAdmins } from '../services/admins'
import { useAuth } from '../context/AuthContext'

const input = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white outline-none text-sm transition focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/15'
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())

// Lets founding admins make anyone an admin, and remove them later.
export default function AdminAccess({ onToast, onCount }) {
  const { user, isFounder } = useAuth()
  const [admins, setAdmins] = useState([])
  const [loadError, setLoadError] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)

  useEffect(() => {
    const stop = watchAdmins(
      list => { setAdmins(list); setLoadError(''); onCount?.(list.length) },
      () => setLoadError("The admin list couldn't load. Check that Firestore is created and its security rules are published."),
    )
    return () => { stop() }
  }, [onCount])

  const founderEmails = ADMINS.map(a => a.email.toLowerCase())

  async function handleAdd(e) {
    e.preventDefault()
    const key = emailKey(email)
    if (!validEmail(key)) return setFormError('Enter a valid email address.')
    if (founderEmails.includes(key)) return setFormError('That person is already a founding admin.')
    if (admins.some(a => a.id === key)) return setFormError('That person is already an admin.')
    setFormError('')
    setSaving(true)
    try {
      await addAdmin({ email: key, name, addedBy: user.email })
      onToast?.(`${name.trim() || key} is now an admin`)
      setEmail(''); setName('')
    } catch {
      setFormError("Couldn't add this admin. Only founding admins can do this, and Firestore must be set up.")
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove(id) {
    try {
      await removeAdmin(id)
      onToast?.('Admin access removed')
    } catch {
      onToast?.("Couldn't remove this admin. Try again.")
    }
    setConfirm(null)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 animate-enter">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h3 className="font-display font-bold text-lg flex items-center gap-2"><ShieldPlus size={18} className="text-aqua-blue" /> Admin access</h3>
          <p className="text-sm text-aqua-grey">
            {isFounder
              ? 'Make anyone an admin by their email. They get access the next time they log in.'
              : 'Only founding admins can add or remove admins.'}
          </p>
        </div>
      </div>

      {isFounder && (
        <form onSubmit={handleAdd} className="grid sm:grid-cols-[1.4fr_1fr_auto] gap-2 mt-4">
          <label className="sr-only" htmlFor="new-admin-email">Email</label>
          <input id="new-admin-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="their-email@gmail.com" className={input} />
          <label className="sr-only" htmlFor="new-admin-name">Name</label>
          <input id="new-admin-name" value={name} onChange={e => setName(e.target.value)}
            placeholder="Name (optional)" className={input} />
          <button type="submit" disabled={saving}
            className="flex items-center justify-center gap-2 bg-aqua-blue text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:-translate-y-0.5 transition disabled:opacity-70">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <ShieldPlus size={16} />} Make admin
          </button>
        </form>
      )}
      {formError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-3">{formError}</p>}
      {loadError && <p className="text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2 mt-3">{loadError}</p>}

      <div className="mt-4 grid gap-1">
        {/* Founding admins: fixed in the code, can't be removed here */}
        {[...new Map(ADMINS.map(a => [a.name, a])).values()].map(a => (
          <div key={a.email} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50">
            <Crown size={16} className="text-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <b className="block text-sm">{a.name}</b>
              <span className="text-xs text-aqua-grey">Founding admin</span>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-aqua-blue"><Lock size={12} /> Permanent</span>
          </div>
        ))}

        {/* Admins added from this page */}
        {admins.map(a => (
          <div key={a.id} className="flex flex-wrap items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-aqua-blue to-aqua-teal text-white grid place-items-center text-xs font-bold shrink-0">
              {(a.name || a.email)[0].toUpperCase()}
            </span>
            <div className="flex-1 min-w-0">
              <b className="block text-sm truncate">{a.name || a.email}</b>
              <span className="text-xs text-aqua-grey break-all">{a.email}{a.addedBy ? ` · added by ${a.addedBy}` : ''}</span>
            </div>
            {isFounder && (confirm === a.id ? (
              <span className="flex items-center gap-2 text-xs">
                Remove admin access?
                <button onClick={() => handleRemove(a.id)} className="bg-red-600 text-white font-semibold px-2.5 py-1.5 rounded-lg">Remove</button>
                <button onClick={() => setConfirm(null)} className="border border-slate-200 font-semibold px-2.5 py-1.5 rounded-lg">Cancel</button>
              </span>
            ) : (
              <button onClick={() => setConfirm(a.id)} aria-label={`Remove ${a.email}`}
                className="flex items-center gap-1 text-xs font-semibold text-red-600 border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50 hover:border-red-300 transition">
                <Trash2 size={13} /> Remove
              </button>
            ))}
          </div>
        ))}
        {!loadError && admins.length === 0 && (
          <p className="text-sm text-aqua-grey px-2.5 py-2">No extra admins yet.</p>
        )}
      </div>
    </div>
  )
}
