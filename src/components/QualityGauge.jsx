import { useEffect, useState } from 'react'

export default function QualityGauge({ value }) {
  const [shown, setShown] = useState(0)
  useEffect(() => { const t = setTimeout(() => setShown(value), 100); return () => clearTimeout(t) }, [value])

  const percent = Math.min(value, 10) * 10 // scale 0–10 NTU
  const status = value <= 1 ? ['Good', 'text-emerald-600'] : value <= 5 ? ['Fair', 'text-amber-600'] : ['Unsafe', 'text-red-600']

  return (
    <div className="flex flex-col items-center mt-4">
      <svg viewBox="0 0 220 130" className="w-56 max-w-full">
        <defs>
          <linearGradient id="gauge">
            <stop offset="0" stopColor="#0D9488" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <path d="M20 115a90 90 0 0 1 180 0" fill="none" stroke="#E2E8F0" strokeWidth="16" strokeLinecap="round" />
        <path d="M20 115a90 90 0 0 1 180 0" fill="none" stroke="url(#gauge)" strokeWidth="16" strokeLinecap="round"
          pathLength="100" strokeDasharray="100" strokeDashoffset={100 - (shown ? percent : 0)}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.2,.7,.2,1)' }} />
      </svg>
      <div className="-mt-14 font-mono text-4xl font-bold">{value.toFixed(2)}</div>
      <div className="text-sm text-aqua-grey">NTU · <span className={`font-semibold ${status[1]}`}>{status[0]}</span></div>
      <div className="grid grid-cols-3 gap-1.5 w-full mt-5 text-xs text-center">
        <span className="bg-emerald-50 text-emerald-700 rounded-lg py-1.5">≤1 Good</span>
        <span className="bg-amber-50 text-amber-700 rounded-lg py-1.5">1–5 Fair</span>
        <span className="bg-red-50 text-red-700 rounded-lg py-1.5">&gt;5 Unsafe</span>
      </div>
      <p className="text-xs text-aqua-grey mt-3">Limits from IS 10500 drinking water standard</p>
    </div>
  )
}