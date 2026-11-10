import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import AuthArt from '../components/AuthArt'

const input = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none transition focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/15'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      setError('Enter your email and password.')
      return
    }
    setError('')
    setLoading(true)
    // Later: replace this with a real login call to your backend
    setTimeout(() => navigate('/dashboard'), 800)
  }

  return (
    <div className="grid md:grid-cols-2 md:min-h-[640px]">
      <AuthArt text="Monitor water flow, usage and quality across every device from one place." />

      <div className="flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm animate-enter">
          <h1 className="font-display font-extrabold text-3xl">Welcome back</h1>
          <p className="text-aqua-grey mt-1 mb-7">Log in to your AquaByte dashboard.</p>

          <label htmlFor="login-email" className="block text-sm font-semibold mb-1.5">Email</label>
          <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@organisation.in" className={input} />

          <label htmlFor="login-password" className="block text-sm font-semibold mb-1.5 mt-4">Password</label>
          <div className="relative">
            <input id="login-password" type={show ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Your password" className={`${input} pr-12`} />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-aqua-grey hover:text-aqua-slate">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-between items-center text-sm text-aqua-grey mt-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-aqua-blue" defaultChecked /> Remember me
            </label>
            <a href="#" className="text-aqua-blue font-medium hover:underline">Forgot password?</a>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-aqua-blue text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/40 hover:-translate-y-0.5 transition disabled:opacity-70 disabled:translate-y-0">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Logging in…' : 'Log in'}
          </button>

          <p className="text-center text-sm text-aqua-grey mt-6">
            New to AquaByte? <Link to="/signup" className="text-aqua-blue font-semibold hover:underline">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  )
}