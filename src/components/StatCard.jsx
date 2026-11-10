import { useEffect, useState } from 'react'

function useCountUp(target, enabled) {
  const [value, setValue] = useState(enabled ? 0 : target)
  useEffect(() => {
    if (!enabled) { setValue(target); return }
    let raf
    const start = performance.now()
    const tick = now => {
      const p = Math.min(1, (now - start) / 1200)
      setValue(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, enabled])
  return value
}

export default function StatCard({ label, value, unit, decimals = 0, icon: Icon, note, tone = 'blue', countUp = true }) {
  const shown = useCountUp(value, countUp)
  const iconStyle = tone === 'teal' ? 'bg-aqua-lightteal text-aqua-teal' : 'bg-aqua-lightblue text-aqua-blue'

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition duration-300 animate-enter">
      <div className="flex justify-between items-center text-sm text-aqua-grey">
        {label}
        <span className={`w-9 h-9 rounded-lg grid place-items-center ${iconStyle}`}><Icon size={18} /></span>
      </div>
      <div className="font-mono text-3xl font-bold mt-3 tabular-nums">
        {shown.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {unit && <span className="font-body text-sm font-medium text-aqua-grey ml-1.5">{unit}</span>}
      </div>
      <div className="text-xs text-aqua-grey mt-2">{note}</div>
    </div>
  )
}