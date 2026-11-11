import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, MailCheck } from 'lucide-react'
import { ADMINS, FOUNDER_EMAILS } from '../services/auth'
import { useAuth } from '../context/AuthContext'

export default function AccessDenied({ onExit }) {
  const { user, resendVerification } = useAuth()
  const [sent, setSent] = useState('')
  // A founder (or anyone) whose email isn't verified yet
  const needsVerify = !onExit && user && !user.verified
  const isFounderEmail = user && FOUNDER_EMAILS.includes(user.email.toLowerCase())

  async function resend() {
    try {
      await resendVerification()
      setSent(`Verification email sent to ${user.email}. Click the link in it, then log out and log in again.`)
    } catch {
      setSent('Could not send the email right now. Wait a minute and try again.')
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-3xl p-10 text-center animate-enter">
      <div className="w-16 h-16 rounded-2xl bg-aqua-lightblue text-aqua-blue grid place-items-center mx-auto mb-4">
        <Lock size={28} />
      </div>
      <h2 className="font-display font-extrabold text-2xl">Admin access only</h2>
      <p className="text-aqua-grey mt-2">This page is limited to AquaByte admins. Ask one of them if you need something changed.</p>

      {needsVerify && (
        <div className="mt-5 text-left text-sm bg-amber-50 text-amber-900 rounded-xl p-4">
          <b className="flex items-center gap-2"><MailCheck size={16} /> Verify your email first</b>
          <p className="mt-1">
            {isFounderEmail ? 'You are a founding admin, but ' : ''}Admin access needs a verified email address.
            Use <b>Continue with Google</b>, or verify your email with the link we sent when you signed up.
          </p>
          <button onClick={resend} className="mt-3 text-xs font-semibold bg-white border border-amber-200 px-3 py-1.5 rounded-lg hover:border-amber-400">
            Resend verification email
          </button>
          {sent && <p className="mt-2 text-xs">{sent}</p>}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 mt-5">
        {[...new Set(ADMINS.map(a => a.name))].map(name => (
          <span key={name} className="text-xs font-semibold bg-aqua-lightblue text-aqua-blue px-3 py-1 rounded-full">{name}</span>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        <Link to="/dashboard" className="bg-aqua-blue text-white text-sm font-semibold px-4 py-2.5 rounded-lg">Go to dashboard</Link>
        {onExit && (
          <button onClick={onExit} className="border border-slate-200 text-sm font-semibold px-4 py-2.5 rounded-lg">Exit preview</button>
        )}
      </div>
    </div>
  )
}
