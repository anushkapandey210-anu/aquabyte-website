import { Loader2 } from 'lucide-react'

export default function GoogleButton({ onClick, loading, label = 'Continue with Google' }) {
  return (
    <button type="button" onClick={onClick} disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 font-semibold py-3 rounded-xl hover:border-aqua-blue hover:text-aqua-blue transition disabled:opacity-70">
      {loading
        ? <Loader2 size={18} className="animate-spin" />
        : <span className="w-6 h-6 rounded-full bg-slate-100 grid place-items-center text-xs font-extrabold text-aqua-slate">G</span>}
      {label}
    </button>
  )
}
