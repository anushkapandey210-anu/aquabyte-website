import { useEffect, useState } from 'react'
import { RefreshCw, Droplet, TrendingUp, CalendarDays, Activity, Sun } from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts'
import { getAnalytics } from '../services/api'

const axis = { tickLine: false, tick: { fontSize: 11, fill: '#64748B' } }
const tooltipStyle = { contentStyle: { borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 } }
const litres = v => `${v.toLocaleString('en-IN')} L`
const nextHour = h => `${h} – ${String((parseInt(h) + 1) % 24).padStart(2, '0')}:00`

function ChartCard({ title, sub, endpoint, loading, ms, children, className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 ${className}`}>
      <h3 className="font-display font-bold text-lg">{title}</h3>
      <p className="text-sm text-aqua-grey">{sub}</p>
      <div className={`transition duration-300 ${loading ? 'opacity-25 blur-[1px]' : ''}`}>{children}</div>
      <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-[11px] text-aqua-grey">
        <span className="font-bold text-aqua-teal bg-aqua-lightteal rounded px-1.5">GET</span>
        <span className="truncate">{endpoint}</span>
        <span className={`ml-auto ${loading ? '' : 'text-emerald-600'}`}>{loading ? 'loading…' : `200 OK · ${ms} ms`}</span>
      </div>
      {loading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse pointer-events-none" />}
    </div>
  )
}

function Kpi({ label, value, note, icon: Icon, teal }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-enter">
      <div className="flex justify-between items-center text-sm text-aqua-grey">
        {label}
        <span className={`w-9 h-9 rounded-lg grid place-items-center ${teal ? 'bg-aqua-lightteal text-aqua-teal' : 'bg-aqua-lightblue text-aqua-blue'}`}><Icon size={18} /></span>
      </div>
      <div className="font-mono text-2xl font-bold mt-3">{value}</div>
      <div className="text-xs text-aqua-grey mt-1.5">{note}</div>
    </div>
  )
}

export default function Analytics() {
  const [range, setRange] = useState('30d')
  const [reload, setReload] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [ms, setMs] = useState(0)
  const [data, setData] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      const start = performance.now()
      try {
        const [consumption, devices, quality, hourly] = await Promise.all(
          ['consumption', 'devices', 'quality', 'hourly'].map(name => getAnalytics(name, range))
        )
        if (!cancelled) {
          setData({ consumption, devices, quality, hourly })
          setMs(Math.round(performance.now() - start))
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [range, reload])

  // Numbers for the KPI cards
  let kpi = null
  if (data) {
    const total = data.consumption.reduce((s, d) => s + d.litres, 0)
    const prev = data.consumption.reduce((s, d) => s + d.previous, 0)
    const peak = data.consumption.reduce((a, b) => (b.litres > a.litres ? b : a))
    const change = ((total - prev) / prev) * 100
    const avgNtu = data.quality.reduce((s, d) => s + d.inlet, 0) / data.quality.length
    kpi = { total, change, avg: Math.round(total / data.consumption.length), peak, avgNtu }
  }
  const maxShare = data ? Math.max(...data.devices.map(d => d.share)) : 1

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl">Analytics</h1>
          <p className="text-aqua-grey mt-1">Consumption and quality trends from the AquaByte API.</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex bg-slate-100 rounded-lg p-1">
            {['7d', '30d', '90d'].map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-md text-sm transition ${range === r ? 'bg-white shadow-sm font-semibold' : 'text-aqua-grey'}`}>
                {r.replace('d', ' d')}
              </button>
            ))}
          </div>
          <button onClick={() => setReload(x => x + 1)}
            className="flex items-center gap-2 bg-white border border-slate-200 text-sm font-semibold px-3 py-2 rounded-lg hover:border-aqua-blue hover:text-aqua-blue transition">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
          {error}. Check that the backend is running, then press Refresh.
        </div>
      )}

      {/* KPIs */}
      {kpi && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          <Kpi label="Total consumption" icon={Droplet} value={`${(kpi.total / 1000).toFixed(1)}k L`}
            note={<><span className={kpi.change < 0 ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
              {kpi.change < 0 ? '▼' : '▲'} {Math.abs(kpi.change).toFixed(1)}%</span> vs previous {range.replace('d', ' days')}</>} />
          <Kpi label="Daily average" icon={TrendingUp} teal value={`${kpi.avg.toLocaleString('en-IN')} L`} note="across all devices" />
          <Kpi label="Peak day" icon={CalendarDays} value={`${(kpi.peak.litres / 1000).toFixed(1)}k L`} note={kpi.peak.date} />
          <Kpi label="Avg. turbidity" icon={Activity} teal value={`${kpi.avgNtu.toFixed(2)} NTU`}
            note={<span className="text-emerald-600 font-semibold">Within safe limit</span>} />
        </div>
      )}

      {/* Insights */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {[
          { icon: Sun, title: 'Morning peak at 8 am', text: 'Usage between 7 and 9 am is about 3× the hourly average.', style: 'bg-aqua-lightblue text-aqua-blue' },
          { icon: Droplet, title: 'Library quality is getting worse', text: 'AB-03 turbidity climbed for 5 days and crossed 5 NTU.', style: 'bg-red-50 text-red-600' },
          { icon: TrendingUp, title: 'Main inlet uses 41%', text: 'The pump house line is the biggest consumer.', style: 'bg-aqua-lightteal text-aqua-teal' },
        ].map(({ icon: Icon, title, text, style }) => (
          <div key={title} className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3">
            <span className={`w-9 h-9 shrink-0 rounded-lg grid place-items-center ${style}`}><Icon size={18} /></span>
            <div><b className="block text-sm">{title}</b><p className="text-sm text-aqua-grey mt-0.5">{text}</p></div>
          </div>
        ))}
      </div>

      {data && (
        <>
          {/* Consumption trend */}
          <ChartCard className="mb-4" title="Water consumption" sub="Litres per day, all devices"
            endpoint={`/api/v1/analytics/consumption?range=${range}`} loading={loading} ms={ms}>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.consumption} margin={{ top: 10, right: 12, left: -6, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gUse" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#2563EB" stopOpacity={0.22} />
                      <stop offset="1" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#EEF2F7" vertical={false} />
                  <XAxis dataKey="date" {...axis} axisLine={{ stroke: '#E2E8F0' }} minTickGap={24} />
                  <YAxis {...axis} axisLine={false} tickFormatter={v => `${v / 1000}k`} domain={['dataMin - 1000', 'dataMax + 500']} />
                  <Tooltip {...tooltipStyle} formatter={(v, name) => [litres(v), name]} />
                  <Area type="monotone" dataKey="previous" name="Previous period" stroke="#94A3B8" strokeDasharray="5 5" fill="none" strokeWidth={1.6} />
                  <Area type="monotone" dataKey="litres" name="This period" stroke="#2563EB" strokeWidth={2.6} fill="url(#gUse)" activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <div className="grid xl:grid-cols-2 gap-4 mb-4">
            {/* Usage by device */}
            <ChartCard title="Usage by device" sub="Share of total litres"
              endpoint={`/api/v1/analytics/devices?range=${range}`} loading={loading} ms={ms}>
              <div className="grid gap-3.5 mt-5">
                {data.devices.map(d => (
                  <div key={d.id} className="grid grid-cols-[120px_1fr_44px] sm:grid-cols-[170px_1fr_44px] gap-3 items-center text-sm">
                    <span className="truncate">{d.name} <span className="font-mono text-[11px] text-aqua-grey">{d.id}</span></span>
                    <span className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <span className="block h-full rounded-full bg-gradient-to-r from-aqua-blue to-aqua-teal transition-all duration-1000"
                        style={{ width: loading ? '0%' : `${(d.share / maxShare) * 100}%` }} />
                    </span>
                    <b className="font-mono text-right">{d.share}%</b>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* Turbidity trend */}
            <ChartCard title="Turbidity trend" sub="Daily average NTU · dashed line is the 5 NTU limit"
              endpoint={`/api/v1/analytics/quality?range=${range}`} loading={loading} ms={ms}>
              <div className="h-60 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.quality} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
                    <CartesianGrid stroke="#EEF2F7" vertical={false} />
                    <XAxis dataKey="date" {...axis} axisLine={{ stroke: '#E2E8F0' }} minTickGap={24} />
                    <YAxis {...axis} axisLine={false} domain={[0, 8]} />
                    <Tooltip {...tooltipStyle} formatter={(v, name) => [`${v} NTU`, name]} />
                    <ReferenceLine y={5} stroke="#D97706" strokeDasharray="6 4" />
                    <Line type="monotone" dataKey="library" name="Library (AB-03)" stroke="#DC2626" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="inlet" name="Main inlet" stroke="#0D9488" strokeWidth={2.4} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Hourly pattern */}
          <ChartCard title="Hourly usage pattern" sub="Average litres per hour, 00:00 to 23:00 · hover to see each hour"
            endpoint={`/api/v1/analytics/hourly?range=${range}`} loading={loading} ms={ms}>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.hourly} margin={{ top: 10, right: 12, left: -6, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gWd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#2563EB" stopOpacity={0.22} />
                      <stop offset="1" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gWe" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#0D9488" stopOpacity={0.16} />
                      <stop offset="1" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#EEF2F7" vertical={false} />
                  <XAxis dataKey="hour" {...axis} axisLine={{ stroke: '#E2E8F0' }} interval={1} />
                  <YAxis {...axis} axisLine={false} tickFormatter={v => (v >= 1000 ? `${v / 1000}k` : v)} />
                  <Tooltip {...tooltipStyle} labelFormatter={nextHour} formatter={(v, name) => [litres(v), name]}
                    cursor={{ stroke: '#94A3B8', strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="weekday" name="Weekdays" stroke="#2563EB" strokeWidth={2.6} fill="url(#gWd)" activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="weekend" name="Weekends" stroke="#0D9488" strokeWidth={2.6} fill="url(#gWe)" activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </>
      )}
    </div>
  )
}