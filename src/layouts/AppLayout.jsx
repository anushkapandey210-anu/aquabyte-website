import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutGrid, LineChart, Cpu, Bell, ShieldCheck, User, Lock, LogOut, RefreshCw } from 'lucide-react'
import { Brand } from '../components/Navbar'
import AquaButton from '../components/AquaButton'
import { isAdmin } from '../services/auth'
import { useAuth } from '../context/AuthContext'

const groups = [
  {
    title: 'Monitor',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
      { to: '/analytics', label: 'Analytics', icon: LineChart },
      { to: '/devices', label: 'Devices', icon: Cpu },
      { to: '/alerts', label: 'Alerts', icon: Bell, badge: 2 },
    ],
  },
  {
    title: 'Manage',
    items: [
      { to: '/admin', label: 'Admin', icon: ShieldCheck, adminOnly: true },
      { to: '/profile', label: 'Profile', icon: User },
    ],
  },
]

const linkStyle = ({ isActive }) =>
  `relative flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium whitespace-nowrap transition ${
    isActive ? 'bg-aqua-lightblue text-aqua-blue font-semibold' : 'text-aqua-grey hover:bg-aqua-lightblue hover:text-aqua-slate'
  }`

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const admin = isAdmin(user)

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[250px_1fr] bg-slate-50">
      <aside className="bg-white border-b md:border-b-0 md:border-r border-slate-200 p-3 md:p-5 md:h-screen md:sticky md:top-0 flex md:flex-col">
        <div className="hidden md:block pb-5 mb-2 border-b border-slate-100"><Brand /></div>

        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible w-full">
          {groups.map(group => (
            <div key={group.title} className="flex md:flex-col gap-1">
              <span className="hidden md:block text-[11px] font-semibold uppercase tracking-[0.12em] text-aqua-grey px-3 pt-4 pb-1">
                {group.title}
              </span>
              {group.items
                .filter(item => !item.adminOnly || admin)
                .map(({ to, label, icon: Icon, badge, adminOnly }) => (
                  <NavLink key={to} to={to} className={linkStyle}>
                    <Icon size={18} /> {label}
                    {badge > 0 && (
                      <span className="ml-auto bg-red-600 text-white text-[11px] font-bold rounded-full px-1.5 min-w-5 text-center">{badge}</span>
                    )}
                    {adminOnly && <Lock size={13} className="ml-auto text-aqua-grey" />}
                  </NavLink>
                ))}
            </div>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium whitespace-nowrap text-aqua-grey hover:bg-red-50 hover:text-red-600 transition">
            <LogOut size={18} /> Log out
          </button>
        </nav>

        {/* Signed-in person (desktop only) */}
        <NavLink to="/profile" className="hidden md:flex items-center gap-3 mt-auto mb-3 p-2 rounded-xl hover:bg-slate-50 transition">
          {user?.photo
            ? <img src={user.photo} alt="" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover" />
            : <span className="w-9 h-9 rounded-full bg-gradient-to-br from-aqua-blue to-aqua-teal text-white grid place-items-center text-sm font-bold">{user?.name?.[0]?.toUpperCase()}</span>}
          <span className="min-w-0">
            <b className="block text-sm truncate">{user?.name}</b>
            <span className="block text-xs text-aqua-grey truncate">{user?.email}</span>
          </span>
        </NavLink>

        {/* Sync health box (desktop only) */}
        <div className="hidden md:block bg-aqua-lightteal rounded-xl p-3.5 text-sm">
          <b className="flex items-center gap-2 text-aqua-teal"><RefreshCw size={15} /> Sync health</b>
          <span className="block text-aqua-grey text-xs mt-1">5 of 6 devices live · 1 buffering</span>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
            <div className="h-full w-[83%] rounded-full bg-gradient-to-r from-aqua-blue to-aqua-teal" />
          </div>
        </div>
      </aside>

      <main className="p-4 md:p-6 min-w-0"><Outlet /></main>
      <AquaButton />
    </div>
  )
}