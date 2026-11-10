import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

const startPoints = Array.from({ length: 30 }, (_, i) => 24 + Math.sin(i / 3) * 3)

export default function LiveCard() {
  const [points, setPoints] = useState(startPoints)
  const [time, setTime] = useState(new Date())
  const [today, setToday] = useState(3482)

  useEffect(() => {
    const id = setInterval(() => {
      setPoints(p => {
        const last = p[p.length - 1]
        const next = Math.max(15, Math.min(33, last + (Math.random() - 0.5) * 2))
        return [...p.slice(1), next]
      })
      setTime(new Date())
      setToday(t => t + Math.round(Math.random() * 2))
    }, 1500)
    return () => clearInterval(id)
  }, [])

  const flow = points[points.length - 1]
  const W = 300, H = 80
  const line = points
    .map((v, i) => `${i ? 'L' : 'M'}${(i * W / (points.length - 1)).toFixed(1)} ${(H - 4 - (v - 12) / 24 * (H - 10)).toFixed(1)}`)
    .join(' ')

  return (
    <div className="relative bg-white border border-blue-100 rounded-3xl p-6 shadow-2xl shadow-slate-900/20 animate-float">
      <div className="flex justify-between items-center text-sm text-aqua-grey">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </span>
          AB-02 · Main inlet
        </span>
        <span className="font-mono">{time.toLocaleTimeString('en-GB')}</span>
      </div>

      <div className="mt-4 font-mono text-5xl font-bold">
        {flow.toFixed(1)}<span className="text-base font-medium text-aqua-grey ml-2 font-body">L/min</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-20 mt-3">
        <defs>
          <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0D9488" stopOpacity="0.25" />
            <stop offset="1" stopColor="#0D9488" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${line} L${W} ${H} L0 ${H}Z`} fill="url(#spark)" />
        <path d={line} fill="none" stroke="#0D9488" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="grid grid-cols-3 gap-2.5 mt-4">
        <div className="bg-aqua-lightblue rounded-xl px-3 py-2.5">
          <span className="block text-[11px] uppercase tracking-wider text-aqua-grey">Today</span>
          <b className="font-mono">{today.toLocaleString('en-IN')} L</b>
        </div>
        <div className="bg-aqua-lightteal rounded-xl px-3 py-2.5">
          <span className="block text-[11px] uppercase tracking-wider text-aqua-grey">Quality</span>
          <b className="font-mono text-aqua-teal">Good</b>
        </div>
        <div className="bg-aqua-lightblue rounded-xl px-3 py-2.5">
          <span className="block text-[11px] uppercase tracking-wider text-aqua-grey">Status</span>
          <b className="font-mono text-emerald-600">Live</b>
        </div>
      </div>

      <div className="absolute -left-4 -bottom-14 sm:-left-6 bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-lg animate-float [animation-direction:reverse]">
        <span className="w-8 h-8 rounded-lg bg-aqua-lightteal text-aqua-teal grid place-items-center">
          <RefreshCw size={16} />
        </span>
        <div className="text-sm">
          <b className="block">1,284 readings saved offline</b>
          <span className="text-xs text-aqua-grey">Uploading when back online</span>
        </div>
      </div>
    </div>
  )
}