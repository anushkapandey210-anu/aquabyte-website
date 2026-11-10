import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line } from 'recharts'
import { devices as startDevices, getSparkline } from '../services/mockData'

const statusStyle = {
  online: { pill: 'bg-emerald-50 text-emerald-600', label: 'Online', line: '#2563EB' },
  warning: { pill: 'bg-red-50 text-red-600', label: 'Unsafe quality', line: '#DC2626' },
  offline: { pill: 'bg-slate-100 text-aqua-grey', label: 'Offline · buffering', line: '#94A3B8' },
}

const filters = [
  { id: 'all', label: 'All' },
  { id: 'online', label: 'Online' },
  { id: 'warning', label: 'Needs attention' },
  { id: 'offline', label: 'Offline' },
]

function Sparkline({ seed, color }) {
  const data = useMemo(() => getSparkline(seed), [seed])
  return (
    <div className="h-11 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} animationDuration={900} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function Metric({ label, value, unit, danger }) {
  return (
    <div className="bg-slate-50 rounded-lg px-2.5 py-2">
      <span className="block text-[11px] text-aqua-grey">{label}</span>
      <b className={`font-mono text-sm ${danger ? 'text-red-600' : ''}`}>
        {value ?? '—'}{value != null && unit && <small className="text-[10px] text-aqua-grey ml-0.5">{unit}</small>}
      </b>
    </div>
  )
}

export default function Devices() {
  const [list, setList] = useState(startDevices)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const shown = list.filter(d =>
    (filter === 'all' || d.status === filter) &&
    (d.name + d.id).toLowerCase().includes(query.toLowerCase())
  )

  function removeDevice(id) {
    // Later: call DELETE /api/v1/devices/:id on your backend first
    setList(list.filter(d => d.id !== id))
    setConfirmId(null)
    setToast(`${id} removed`)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl">Devices</h1>
          <p className="text-aqua-grey mt-1">{list.length} AquaByte device{list.length === 1 ? '' : 's'} across your sites.</p>
        </div>
        <button onClick={() => setToast('Adding devices will be available soon')}
          className="flex items-center gap-2 bg-aqua-blue text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition">
          <Plus size={16} /> Add device
        </button>
      </div>

      {/* Filters + search */}
      <div className="flex flex-wrap gap-3 justify-between mb-5">
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                filter === f.id ? 'bg-aqua-slate border-aqua-slate text-white' : 'bg-white border-slate-200 text-aqua-grey hover:border-aqua-blue'}`}>
              {f.label} · {list.filter(d => f.id === 'all' || d.status === f.id).length}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64 focus-within:border-aqua-blue">
          <Search size={16} className="text-aqua-grey" />
          <input id="device-search" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search devices…" className="outline-none text-sm flex-1 min-w-0" />
        </label>
      </div>

      {/* Device cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {shown.map((d, i) => {
          const s = statusStyle[d.status]
          return (
            <div key={d.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition duration-300 animate-enter"
              style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <b className="block">{d.name}</b>
                  <span className="text-xs font-mono text-aqua-grey">{d.id}</span>
                </div>
                <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${s.pill}`}>{s.label}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <Metric label="Flow" value={d.flow} unit="L/m" />
                <Metric label="Turbidity" value={d.ntu} unit="NTU" danger={d.status === 'warning'} />
                <Metric label="Signal" value={d.signal} unit="dBm" />
              </div>

              {d.status !== 'offline' && <Sparkline seed={i + 1.3} color={s.line} />}

              {d.note && (
                <p className={`mt-3 text-xs rounded-lg px-3 py-2 ${d.noteOk ? 'bg-aqua-lightteal text-teal-800' : 'bg-amber-50 text-amber-800'}`}>
                  {d.note}
                </p>
              )}

              {confirmId === d.id ? (
                <div className="mt-4 bg-red-50 rounded-xl p-3 text-sm text-red-900 animate-enter">
                  Remove <b>{d.id}</b> from AquaByte? Its history will be kept.
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => removeDevice(d.id)}
                      className="bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-red-700 transition">
                      Yes, remove
                    </button>
                    <button onClick={() => setConfirmId(null)}
                      className="bg-white border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center mt-4 text-xs text-aqua-grey">
                  Last sync {d.lastSync}
                  <div className="flex gap-2">
                    <button className="border border-slate-200 font-semibold text-aqua-slate px-3 py-1.5 rounded-lg hover:border-aqua-blue hover:text-aqua-blue transition">
                      Details
                    </button>
                    <button onClick={() => setConfirmId(d.id)} aria-label={`Remove ${d.id}`}
                      className="flex items-center gap-1 border border-slate-200 font-semibold text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:border-red-300 transition">
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {shown.length === 0 && <p className="text-aqua-grey mt-6">No devices match.</p>}

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 bg-aqua-slate text-white text-sm px-5 py-3 rounded-xl shadow-xl animate-enter">
          {toast}
        </div>
      )}
    </div>
  )
}