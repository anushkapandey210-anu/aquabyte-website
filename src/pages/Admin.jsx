import { useEffect, useState } from 'react'
import { Lock, UserPlus, Users, Activity, Cloud, MapPin } from 'lucide-react'
import AccessDenied from '../components/AccessDenied'
import AdminAccess from '../components/AdminAccess'
import { ADMINS } from '../services/auth'

const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

const startUsers = [
  ...ADMINS.map(a => ({ ...a, id: a.email, role: 'Admin', sites: 'All', status: 'Active' })),
  { id: 'example-1', name: 'Hostel warden', email: 'example account', role: 'Site manager', sites: 'Hostel A', status: 'Invited' },
  { id: 'example-2', name: 'Maintenance team', email: 'example account', role: 'Technician', sites: 'Pump house', status: 'Inactive' },
]

const statusStyle = {
  Active: 'bg-emerald-50 text-emerald-600',
  Invited: 'bg-aqua-lightblue text-aqua-blue',
  Inactive: 'bg-slate-100 text-aqua-grey',
}

const health = [
  { name: 'Data API', note: '42 ms average response', ok: true },
  { name: 'Cloud database', note: '2.1 GB of 10 GB used', ok: true },
  { name: 'Sync queue', note: '1,284 readings waiting from AB-04', ok: false },
  { name: 'Aqua assistant', note: 'Answering questions', ok: true },
]

export default function Admin() {
  const [users, setUsers] = useState(startUsers)
  const [preview, setPreview] = useState(false)
  const [toast, setToast] = useState('')
  const [extraAdmins, setExtraAdmins] = useState(0)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(t)
  }, [toast])

  // Later: send the change to the backend
  const changeRole = (id, role) => {
    setUsers(users.map(u => (u.id === id && u.role !== 'Admin' ? { ...u, role } : u)))
    setToast('Role updated')
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-3xl flex items-center gap-3">
            Admin
            <span className="flex items-center gap-1.5 text-xs font-semibold font-body bg-aqua-lightblue text-aqua-blue px-2.5 py-1 rounded-full">
              <Lock size={12} /> Admins only
            </span>
          </h1>
          <p className="text-aqua-grey mt-1">Only the AquaByte founding team and the company account can open this page.</p>
        </div>
        {!preview && (
          <div className="flex gap-2">
            <button onClick={() => setPreview(true)}
              className="border border-slate-200 bg-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:border-aqua-blue hover:text-aqua-blue transition">
              Preview as a regular user
            </button>
            <button onClick={() => setToast('Inviting users will be available soon')}
              className="flex items-center gap-2 bg-aqua-blue text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition">
              <UserPlus size={16} /> Invite user
            </button>
          </div>
        )}
      </div>

      {preview ? <AccessDenied onExit={() => setPreview(false)} /> : (
        <>
          <AdminAccess onToast={setToast} onCount={setExtraAdmins} />

          {/* KPIs */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Admins', value: new Set(ADMINS.map(a => a.name)).size + extraAdmins, note: `${new Set(ADMINS.map(a => a.name)).size} founding · ${extraAdmins} added`, icon: Users },
              { label: 'Readings today', value: '41,280', note: '1,284 waiting on devices', icon: Activity, teal: true },
              { label: 'Platform uptime', value: '99.2%', note: 'Last 30 days', icon: Cloud },
              { label: 'Active sites', value: 6, note: '5 live · 1 buffering', icon: MapPin, teal: true },
            ].map(({ label, value, note, icon: Icon, teal }) => (
              <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 animate-enter">
                <div className="flex justify-between items-center text-sm text-aqua-grey">
                  {label}
                  <span className={`w-9 h-9 rounded-lg grid place-items-center ${teal ? 'bg-aqua-lightteal text-aqua-teal' : 'bg-aqua-lightblue text-aqua-blue'}`}><Icon size={18} /></span>
                </div>
                <div className="font-mono text-3xl font-bold mt-3">{value}</div>
                <div className="text-xs text-aqua-grey mt-1.5">{note}</div>
              </div>
            ))}
          </div>

          <div className="grid xl:grid-cols-[2fr_1fr] gap-4">
            {/* Users table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 min-w-0">
              <h3 className="font-display font-bold text-lg">Team & access</h3>
              <p className="text-sm text-aqua-grey">The Admin role is limited to the founding team and company account.</p>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-sm min-w-[620px]">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-aqua-grey border-b border-slate-200">
                      <th className="py-2.5 px-3 font-semibold">User</th>
                      <th className="py-2.5 px-3 font-semibold">Role</th>
                      <th className="py-2.5 px-3 font-semibold">Sites</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 shrink-0 rounded-full grid place-items-center text-white text-xs font-bold ${u.role === 'Admin' ? 'bg-gradient-to-br from-aqua-blue to-aqua-teal' : 'bg-slate-400'}`}>
                              {initials(u.name)}
                            </span>
                            <div>{u.name}<span className="block text-xs text-aqua-grey">{u.email}</span></div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {u.role === 'Admin' ? (
                            <span className="flex items-center gap-1.5 font-semibold text-aqua-blue"><Lock size={12} /> Admin</span>
                          ) : (
                            <select id={`role-${u.id}`} value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                              className="border border-slate-200 rounded-lg px-2 py-1.5 bg-white">
                              <option>Viewer</option>
                              <option>Site manager</option>
                              <option>Technician</option>
                            </select>
                          )}
                        </td>
                        <td className="py-3 px-3">{u.sites}</td>
                        <td className="py-3 px-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[u.status]}`}>{u.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* System health */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="font-display font-bold text-lg">System health</h3>
              <p className="text-sm text-aqua-grey">Live status of each service</p>
              <div className="grid gap-1 mt-3">
                {health.map(h => (
                  <div key={h.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50">
                    <span className={`w-1 self-stretch rounded-full ${h.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <div className="flex-1 min-w-0">
                      <b className="block text-sm">{h.name}</b>
                      <span className="text-xs text-aqua-grey">{h.note}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${h.ok ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {h.ok ? 'OK' : 'Backlog'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 bg-aqua-slate text-white text-sm px-5 py-3 rounded-xl shadow-xl animate-enter">
          {toast}
        </div>
      )}
    </div>
  )
}