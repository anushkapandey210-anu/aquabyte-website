import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, House, GraduationCap, Factory } from 'lucide-react'
import AuthArt from '../components/AuthArt'
import GoogleButton from '../components/GoogleButton'
import { useAuth } from '../context/AuthContext'
import { authErrorMessage } from '../services/authErrors'

const input = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none transition focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/15'
const roles = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'institution', label: 'Institution', icon: GraduationCap },
  { id: 'industry', label: 'Industry', icon: Factory },
]

export default function Signup() {
  const navigate = useNavigate()
  const { user, signup, loginWithGoogle, firebaseReady } = useAuth()
  const [form, setForm] = useState({ first: '', last: '', email: '', org: '', password: '' })
  const [role, setRole] = useState('home')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState('') // '', 'email' or 'google'

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const update = e => setForm({ ...form, [e.target.name]: e.target.value })

  // Already signed in? Go straight to the dashboard.
  if (user && !loading) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.first || !form.email) return setError('Enter your first name and email.')
    if (form.password.length < 8) return setError('Your password needs at least 8 characters.')
    setError('')
    setLoading('email')
    try {
      await signup({ name: `${form.first} ${form.last}`.trim(), email: form.email, password: form.password })
      // Later: save form.org and role to the database too
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(authErrorMessage(err))
      setLoading('')
    }
  }

  async function handleGoogle() {
    setError('')
    setLoading('google')
    try {
      await loginWithGoogle()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(authErrorMessage(err))
      setLoading('')
    }
  }

  return (
    <div className="grid md:grid-cols-2 md:min-h-[720px]">
      <AuthArt text="Join AquaByte and start building a clear picture of your water use." />

      <div className="flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm animate-enter">
          <h1 className="font-display font-extrabold text-3xl">Create your account</h1>
          <p className="text-aqua-grey mt-1 mb-7">It takes less than a minute.</p>

          {!firebaseReady && (
            <p className="text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2 mb-5">
              Sign-up isn't connected yet. Add your Firebase keys to the <b>.env.local</b> file, then restart <b>npm run dev</b>.
            </p>
          )}

          <GoogleButton onClick={handleGoogle} loading={loading === 'google'} label="Sign up with Google" />

          <div className="flex items-center gap-3 text-xs text-aqua-grey my-5">
            <span className="flex-1 h-px bg-slate-200" /> or sign up with email <span className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="su-first" className="block text-sm font-semibold mb-1.5">First name</label>
              <input id="su-first" name="first" value={form.first} onChange={update} className={input} />
            </div>
            <div>
              <label htmlFor="su-last" className="block text-sm font-semibold mb-1.5">Last name</label>
              <input id="su-last" name="last" value={form.last} onChange={update} className={input} />
            </div>
          </div>

          <label htmlFor="su-email" className="block text-sm font-semibold mb-1.5 mt-4">Email</label>
          <input id="su-email" name="email" type="email" autoComplete="email" value={form.email} onChange={update}
            placeholder="you@organisation.in" className={input} />

          <label htmlFor="su-org" className="block text-sm font-semibold mb-1.5 mt-4">Organisation</label>
          <input id="su-org" name="org" value={form.org} onChange={update}
            placeholder="e.g. Hostel Block A, Green Park Society" className={input} />

          <span className="block text-sm font-semibold mb-1.5 mt-4">I'm signing up for</span>
          <div className="grid grid-cols-3 gap-2">
            {roles.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => setRole(id)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-sm transition ${
                  role === id ? 'border-aqua-blue bg-aqua-lightblue text-aqua-blue font-semibold' : 'border-slate-200 text-aqua-grey hover:border-aqua-blue/50'}`}>
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>

          <label htmlFor="su-password" className="block text-sm font-semibold mb-1.5 mt-4">Password</label>
          <div className="relative">
            <input id="su-password" name="password" type={show ? 'text' : 'password'} autoComplete="new-password" value={form.password}
              onChange={update} placeholder="At least 8 characters" className={`${input} pr-12`} />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-aqua-grey hover:text-aqua-slate">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-4">{error}</p>}

          <button type="submit" disabled={!!loading}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-aqua-blue text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/40 hover:-translate-y-0.5 transition disabled:opacity-70 disabled:translate-y-0">
            {loading === 'email' && <Loader2 size={18} className="animate-spin" />}
            {loading === 'email' ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-center text-sm text-aqua-grey mt-6">
            Already have an account? <Link to="/login" className="text-aqua-blue font-semibold hover:underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}