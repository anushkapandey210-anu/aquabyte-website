import { useEffect, useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { getHourlyUsage } from '../services/mockData'

function HourTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-aqua-slate text-white text-xs rounded-lg px-3 py-2 shadow-xl">
      <b className="block font-mono mb-1">{label === 'Now' ? 'This hour' : label}</b>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm" style={{ background: p.color }} />
          {p.name}: <b>{p.value.toLocaleString('en-IN')} L</b>
        </div>
      ))}
    </div>
  )
}

export default function HourlyChart() {
  const [data, setData] = useState(getHourlyUsage)

  // The current hour keeps growing, like live data would
  useEffect(() => {
    const id = setInterval(() => {
      setData(d => {
        const copy = [...d]
        const last = { ...copy[23] }
        last.inlet += Math.round(Math.random() * 12)
        last.hostel += Math.round(Math.random() * 6)
        copy[23] = last
        return copy
      })
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-72 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="gInlet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2563EB" stopOpacity={0.25} />
              <stop offset="1" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gHostel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0D9488" stopOpacity={0.2} />
              <stop offset="1" stopColor="#0D9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#EEF2F7" vertical={false} />
          <XAxis dataKey="hour" interval={2} tickLine={false} axisLine={{ stroke: '#E2E8F0' }}
            tick={{ fontSize: 11, fill: '#64748B' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }}
            tickFormatter={v => (v >= 1000 ? `${v / 1000}k` : v)} />
          <Tooltip content={<HourTooltip />} cursor={{ stroke: '#94A3B8', strokeDasharray: '4 4' }} />
          <Area type="monotone" dataKey="inlet" name="Main inlet" stroke="#2563EB" strokeWidth={2.5}
            fill="url(#gInlet)" activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} animationDuration={1200} />
          <Area type="monotone" dataKey="hostel" name="Hostel Block A" stroke="#0D9488" strokeWidth={2.5}
            fill="url(#gHostel)" activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} animationDuration={1200} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}