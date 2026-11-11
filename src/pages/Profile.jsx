import { useEffect, useState } from 'react'
import { Save, Mail, MessageSquare, Bell, CalendarDays } from 'lucide-react'
import { isAdmin } from '../services/auth'
import { useAuth } from '../context/AuthContext'

const input = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none transition focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/15'
const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

function Toggle({ id, checked, onChange }) {
  return (
    <button id={id} type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 shrink-0 rounded-full transition ${checked ? 'bg-aqua-teal' : 'bg-slate-300'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  )
}

function Slider({ id, label, value, onChange, min, max, step, unit, hint }) {
  return (
    <div className="mt-5">
      <label htmlFor={id} className="flex justify-between text-sm font-semibold">
        {label}
        <b className="font-mono text-aqua-teal">{value} {unit}</b>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} className="w-full mt-2 accent-aqua-teal" />
      {hint && <p className="text-xs text-aqua-grey">{hint}</p>}
    </div>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const admin = isAdmin(user)

  const [details, setDetails] = useState({ name: user.name, phone: '', email: user.email, language: 'English' })
  const [ntuLimit, setNtuLimit] = useState(5)
  const [offlineAfter, setOfflineAfter] = useState(10)
  const [usageAbove, setUsageAbove] = useState(15)
  const [notify, setNotify] = useState({ email: true, sms: true, push: false, weekly: true })
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const update = e => setDetails({ ...details, [e.target.name]: e.target.value })

  // Later: send these to the backend
  const save = what => setToast(`${what} saved`)

  const notifications = [
    { key: 'email', icon: Mail, title: 'Email', text: 'Daily summary and critical alerts' },
    { key: 'sms', icon: MessageSquare, title: 'SMS', text: 'Critical alerts only' },
    { key: 'push', icon: Bell, title: 'Push', text: 'All alerts in the app' },
    { key: 'weekly', icon: CalendarDays, title: 'Weekly report', text: 'Usage trends every Monday' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-3xl">Profile & settings</h1>
        <p className="text-aqua-grey mt-1">Your account, alert limits and notifications.</p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        {/* Profile card */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden text-center self-start animate-enter">
          <div className="h-24 bg-gradient-to-r from-aqua-blue to-aqua-teal" />
          <div className="w-24 h-24 -mt-12 mx-auto rounded-full border-4 border-white bg-gradient-to-br from-aqua-blue to-aqua-teal grid place-items-center text-white font-display font-extrabold text-3xl">
            {initials(details.name || user.name)}
          </div>
          <div className="px-5 pt-3 pb-6">
            <h3 className="font-display font-extrabold text-xl">{details.name || user.name}</h3>
            <span className="text-sm text-aqua-grey">{admin ? 'Admin' : 'Member'} · AquaByte IoT Solutions</span>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm text-left mt-5">
              <dt className="text-aqua-grey">Email</dt><dd className="text-right font-medium truncate">{details.email}</dd>
              <dt className="text-aqua-grey">Role</dt><dd className="text-right font-medium">{admin ? 'Admin' : 'Member'}</dd>
              <dt className="text-aqua-grey">Devices</dt><dd className="text-right font-medium">6</dd>
              <dt className="text-aqua-grey">Member since</dt><dd className="text-right font-medium">2026</dd>
            </dl>
          </div>
        </div>

        <div className="grid gap-4 min-w-0">
          {/* Personal details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-enter">
            <h3 className="font-display font-bold text-lg">Personal details</h3>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="pf-name" className="block text-sm font-semibold mb-1.5">Full name</label>
                <input id="pf-name" name="name" value={details.name} onChange={update} className={input} />
              </div>
              <div>
                <label htmlFor="pf-phone" className="block text-sm font-semibold mb-1.5">Phone</label>
                <input id="pf-phone" name="phone" value={details.phone} onChange={update} placeholder="+91" className={input} />
              </div>
              <div>
                <label htmlFor="pf-email" className="block text-sm font-semibold mb-1.5">Email</label>
                <input id="pf-email" name="email" type="email" value={details.email} readOnly title="Your login email can't be changed here" className={`${input} bg-slate-50 text-aqua-grey`} />
              </div>
              <div>
                <label htmlFor="pf-lang" className="block text-sm font-semibold mb-1.5">Language</label>
                <select id="pf-lang" name="language" value={details.language} onChange={update} className={input}>
                  <option>English</option>
                  <option>हिन्दी</option>
                </select>
              </div>
            </div>
            <button onClick={() => save('Profile')}
              className="mt-5 flex items-center gap-2 bg-aqua-blue text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition">
              <Save size={16} /> Save changes
            </button>
          </div>

          <div className="grid xl:grid-cols-2 gap-4">
            {/* Alert limits */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-enter">
              <h3 className="font-display font-bold text-lg">Alert limits</h3>
              <p className="text-sm text-aqua-grey">When AquaByte should warn you.</p>
              <Slider id="th-ntu" label="Turbidity alert above" value={ntuLimit} onChange={setNtuLimit}
                min={1} max={10} step={0.5} unit="NTU" hint="IS 10500 permissible limit is 5 NTU" />
              <Slider id="th-usage" label="Usage alert above average by" value={usageAbove} onChange={setUsageAbove}
                min={5} max={50} step={5} unit="%" hint="Compared with your 7-day average" />
              <Slider id="th-offline" label="Offline alert after" value={offlineAfter} onChange={setOfflineAfter}
                min={5} max={60} step={5} unit="min" hint="How long a device can be silent before we alert you" />
              <button onClick={() => save('Alert limits')}
                className="mt-5 text-sm font-semibold border border-slate-200 px-4 py-2 rounded-lg hover:border-aqua-blue hover:text-aqua-blue transition">
                Save limits
              </button>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-enter">
              <h3 className="font-display font-bold text-lg">Notifications</h3>
              <p className="text-sm text-aqua-grey">How you hear about alerts.</p>
              <div className="mt-2">
                {notifications.map(({ key, icon: Icon, title, text }) => (
                  <div key={key} className="flex items-center gap-3 py-3.5 border-b border-slate-100 last:border-0">
                    <span className="w-9 h-9 shrink-0 rounded-lg bg-aqua-lightblue text-aqua-blue grid place-items-center"><Icon size={17} /></span>
                    <div className="flex-1 min-w-0">
                      <b className="block text-sm">{title}</b>
                      <span className="text-xs text-aqua-grey">{text}</span>
                    </div>
                    <Toggle id={`notify-${key}`} checked={notify[key]}
                      onChange={v => { setNotify({ ...notify, [key]: v }); setToast(`${title} ${v ? 'on' : 'off'}`) }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 bg-aqua-slate text-white text-sm px-5 py-3 rounded-xl shadow-xl animate-enter">
          {toast}
        </div>
      )}
    </div>
  )
}