import { useState } from 'react'
import { Droplet, LineChart, WifiOff, RefreshCw, CheckCheck } from 'lucide-react'
import { allAlerts } from '../services/mockData'

const levels = {
  critical: { border: 'border-l-red-500', icon: 'bg-red-50 text-red-600', pill: 'bg-red-50 text-red-600', label: 'Critical' },
  warning: { border: 'border-l-amber-500', icon: 'bg-amber-50 text-amber-600', pill: 'bg-amber-50 text-amber-600', label: 'Warning' },
  info: { border: 'border-l-aqua-blue', icon: 'bg-aqua-lightblue text-aqua-blue', pill: 'bg-aqua-lightblue text-aqua-blue', label: 'Info' },
  resolved: { border: 'border-l-emerald-500', icon: 'bg-emerald-50 text-emerald-600', pill: 'bg-emerald-50 text-emerald-600', label: 'Resolved' },
}

const icons = { quality: Droplet, usage: LineChart, offline: WifiOff, sync: RefreshCw }

const filters = [
  { id: 'all', label: 'All' },
  { id: 'critical', label: 'Critical' },
  { id: 'warning', label: 'Warning' },
  { id: 'info', label: 'Info' },
]

export default function Alerts() {
  const [alerts, setAlerts] = useState(allAlerts)
  const [filter, setFilter] = useState('all')

  const shown = alerts.filter(a =>
    filter === 'all' || a.level === filter || (filter === 'info' && a.level === 'resolved')
  )
  const openCount = alerts.filter(a => !a.ack && (a.level === 'critical' || a.level === 'warning')).length

  // Later: also tell the backend the alert was acknowledged
  const acknowledge = id => setAlerts(alerts.map(a => (a.id === id ? { ...a, ack: true } : a)))
  const acknowledgeAll = () => setAlerts(alerts.map(a => ({ ...a, ack: true })))

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl">Alerts</h1>
          <p className="text-aqua-grey mt-1">
            Quality, usage and connectivity events from all devices.{' '}
            {openCount > 0
              ? <span className="font-semibold text-red-600">{openCount} need attention.</span>
              : <span className="font-semibold text-emerald-600">All caught up.</span>}
          </p>
        </div>
        <button onClick={acknowledgeAll} disabled={openCount === 0}
          className="flex items-center gap-2 bg-white border border-slate-200 text-sm font-semibold px-4 py-2.5 rounded-lg hover:border-aqua-blue hover:text-aqua-blue transition disabled:opacity-50 disabled:pointer-events-none">
          <CheckCheck size={16} /> Acknowledge all
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              filter === f.id ? 'bg-aqua-slate border-aqua-slate text-white' : 'bg-white border-slate-200 text-aqua-grey hover:border-aqua-blue'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="grid gap-3">
        {shown.map((a, i) => {
          const l = levels[a.level]
          const Icon = icons[a.type]
          return (
            <div key={a.id}
              className={`bg-white border border-slate-200 border-l-4 ${l.border} rounded-2xl p-4 flex flex-wrap sm:flex-nowrap gap-4 items-start transition duration-300 animate-enter ${a.ack ? 'opacity-55' : ''}`}
              style={{ animationDelay: `${i * 0.06}s` }}>
              <span className={`w-10 h-10 shrink-0 rounded-xl grid place-items-center ${l.icon}`}><Icon size={18} /></span>
              <div className="flex-1 min-w-0">
                <b className="block">{a.title}</b>
                <p className="text-sm text-aqua-grey mt-0.5">{a.detail}</p>
                <div className="flex gap-3 text-xs text-aqua-grey mt-2">
                  <span className="font-mono">{a.device}</span><span>{a.time}</span>
                </div>
              </div>
              <div className="flex sm:flex-col items-end gap-2 ml-auto">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${a.ack ? 'bg-slate-100 text-aqua-grey' : l.pill}`}>
                  {a.ack ? 'Acknowledged' : l.label}
                </span>
                {!a.ack && a.level !== 'resolved' && (
                  <button onClick={() => acknowledge(a.id)}
                    className="text-xs font-semibold border border-slate-200 px-3 py-1.5 rounded-lg hover:border-aqua-blue hover:text-aqua-blue transition">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}