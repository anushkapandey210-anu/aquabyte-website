import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import AuthArt from '../components/AuthArt'
import GoogleButton from '../components/GoogleButton'
import { useAuth } from '../context/AuthContext'
import { authErrorMessage } from '../services/authErrors'

const input = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none transition focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/15'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login, loginWithGoogle, resetPassword, firebaseReady } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState('') // '', 'email' or 'google'

  // Where to go after logging in: the page they tried to open, or the dashboard
  const goTo = location.state?.from || '/dashboard'

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // Already signed in? Skip the login page.
  if (user) return <Navigate to={goTo} replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setInfo('')
    if (!email || !password) { setError('Enter your email and password.'); return }
    setError('')
    setLoading('email')
    try {
      await login(email, password)
      navigate(goTo, { replace: true })
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setLoading('')
    }
  }

  async function handleGoogle() {
    setError(''); setInfo('')
    setLoading('google')
    try {
      await loginWithGoogle()
      navigate(goTo, { replace: true })
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setLoading('')
    }
  }

  async function handleForgot() {
    setInfo('')
    if (!email) { setError('Type your email above, then click "Forgot password?" again.'); return }
    setError('')
    try {
      await resetPassword(email)
      setInfo(`We've sent a password reset link to ${email}. Check your inbox and spam folder.`)
    } catch (err) {
      setError(authErrorMessage(err))
    }
  }

  return (
    <div className="grid md:grid-cols-2 md:min-h-[640px]">
      <AuthArt text="Monitor water flow, usage and quality across every device from one place." />

      <div className="flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm animate-enter">
          <h1 className="font-display font-extrabold text-3xl">Welcome back</h1>
          <p className="text-aqua-grey mt-1 mb-7">Log in to your AquaByte dashboard.</p>

          {!firebaseReady && (
            <p className="text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2 mb-5">
              Login isn't connected yet. Add your Firebase keys to the <b>.env.local</b> file, then restart <b>npm run dev</b>.
            </p>
          )}

          <GoogleButton onClick={handleGoogle} loading={loading === 'google'} />

          <div className="flex items-center gap-3 text-xs text-aqua-grey my-5">
            <span className="flex-1 h-px bg-slate-200" /> or log in with email <span className="flex-1 h-px bg-slate-200" />
          </div>

          <label htmlFor="login-email" className="block text-sm font-semibold mb-1.5">Email</label>
          <input id="login-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@organisation.in" className={input} />

          <label htmlFor="login-password" className="block text-sm font-semibold mb-1.5 mt-4">Password</label>
          <div className="relative">
            <input id="login-password" type={show ? 'text' : 'password'} autoComplete="current-password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Your password" className={`${input} pr-12`} />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-aqua-grey hover:text-aqua-slate">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end text-sm mt-3 mb-5">
            <button type="button" onClick={handleForgot} className="text-aqua-blue font-medium hover:underline">Forgot password?</button>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
          {info && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 mb-4">{info}</p>}

          <button type="submit" disabled={!!loading}
            className="w-full flex items-center justify-center gap-2 bg-aqua-blue text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/40 hover:-translate-y-0.5 transition disabled:opacity-70 disabled:translate-y-0">
            {loading === 'email' && <Loader2 size={18} className="animate-spin" />}
            {loading === 'email' ? 'Logging in…' : 'Log in'}
          </button>

          <p className="text-center text-sm text-aqua-grey mt-6">
            New to AquaByte? <Link to="/signup" className="text-aqua-blue font-semibold hover:underline">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
