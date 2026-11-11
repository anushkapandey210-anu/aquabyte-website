import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Waves, Droplet, TriangleAlert, Cpu, Download } from 'lucide-react'
import StatCard from '../components/StatCard'
import HourlyChart from '../components/HourlyChart'
import QualityGauge from '../components/QualityGauge'
import UsageBars from '../components/UsageBars'
import { recentAlerts } from '../services/mockData'
import { useAuth } from '../context/AuthContext'

const levels = {
  critical: { bar: 'bg-red-500', pill: 'bg-red-50 text-red-600', label: 'Critical' },
  warning: { bar: 'bg-amber-500', pill: 'bg-amber-50 text-amber-600', label: 'Warning' },
  info: { bar: 'bg-aqua-blue', pill: 'bg-aqua-lightblue text-aqua-blue', label: 'Info' },
  resolved: { bar: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-600', label: 'Resolved' },
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export default function Dashboard() {
  const { user } = useAuth()
  const userName = user?.name?.split(' ')[0] || 'there'
  const [range, setRange] = useState('Live')
  const [flow, setFlow] = useState(46.2)
  const [ntu, setNtu] = useState(0.82)

  // Live numbers that wiggle a little, like real readings
  useEffect(() => {
    const id = setInterval(() => {
      setFlow(f => Math.max(35, Math.min(58, f + (Math.random() - 0.5) * 2.4)))
      setNtu(n => Math.max(0.5, Math.min(1.2, n + (Math.random() - 0.5) * 0.08)))
    }, 1500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl">{greeting()}, {userName}</h1>
          <p className="text-aqua-grey mt-1">Here's what your water network is doing right now.</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex bg-slate-100 rounded-lg p-1">
            {['Live', '24 h', '7 d', '30 d'].map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-md text-sm transition ${range === r ? 'bg-white shadow-sm font-semibold' : 'text-aqua-grey'}`}>
                {r}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-aqua-blue text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:-translate-y-0.5 transition">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <StatCard label="Total flow rate" value={flow} decimals={1} unit="L/min" icon={Waves} countUp={false}
          note={<><span className="text-emerald-600 font-semibold">▲ 4.2%</span> vs last hour</>} />
        <StatCard label="Used today" value={12846} unit="L" icon={Droplet} tone="teal"
          note={<><span className="text-red-600 font-semibold">▲ 8%</span> above 7-day average</>} />
        <StatCard label="Avg. turbidity" value={ntu} decimals={2} unit="NTU" icon={TriangleAlert} countUp={false}
          note={<span className="text-emerald-600 font-semibold">Acceptable</span>} />
        <StatCard label="Devices online" value={5} unit="/ 6" icon={Cpu} tone="teal"
          note="1 offline · buffering locally" />
      </div>

      {/* Hourly chart + quality */}
      <div className="grid xl:grid-cols-[2fr_1fr] gap-4 mb-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h3 className="font-display font-bold text-lg">Water usage by hour</h3>
              <p className="text-sm text-aqua-grey">Litres per hour, last 24 hours · hover to see each hour</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
            </span>
          </div>
          <HourlyChart />
          <div className="flex gap-5 text-xs text-aqua-grey mt-2">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-aqua-blue" />Main inlet (AB-02)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-aqua-teal" />Hostel Block A (AB-01)</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h3 className="font-display font-bold text-lg">Water quality</h3>
          <p className="text-sm text-aqua-grey">Turbidity at the main inlet</p>
          <QualityGauge value={ntu} />
        </div>
      </div>

      {/* Weekly usage + alerts */}
      <div className="grid xl:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h3 className="font-display font-bold text-lg">Daily consumption</h3>
          <p className="text-sm text-aqua-grey">Litres, last 7 days</p>
          <UsageBars />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg">Recent alerts</h3>
            <Link to="/alerts" className="text-sm font-semibold text-aqua-blue hover:underline">View all</Link>
          </div>
          <div className="mt-3 grid gap-1">
            {recentAlerts.map(a => (
              <Link key={a.id} to="/alerts" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition">
                <span className={`w-1 self-stretch rounded-full ${levels[a.level].bar}`} />
                <div className="flex-1 min-w-0">
                  <b className="block text-sm truncate">{a.title}</b>
                  <span className="text-xs text-aqua-grey font-mono">{a.device} · {a.time}</span>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levels[a.level].pill}`}>{levels[a.level].label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}