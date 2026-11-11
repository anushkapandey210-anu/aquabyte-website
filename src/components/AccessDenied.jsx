import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { ADMINS } from '../services/auth'

export default function AccessDenied({ onExit }) {
  return (
    <div className="max-w-lg mx-auto mt-10 bg-white border border-slate-200 rounded-3xl p-10 text-center animate-enter">
      <div className="w-16 h-16 rounded-2xl bg-aqua-lightblue text-aqua-blue grid place-items-center mx-auto mb-4">
        <Lock size={28} />
      </div>
      <h2 className="font-display font-extrabold text-2xl">Admin access only</h2>
      <p className="text-aqua-grey mt-2">This page is limited to AquaByte admins. Ask one of them if you need something changed.</p>
      <div className="flex flex-wrap justify-center gap-2 mt-5">
        {ADMINS.map(a => (
          <span key={a.email} className="text-xs font-semibold bg-aqua-lightblue text-aqua-blue px-3 py-1 rounded-full">{a.name}</span>
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