import { NavLink, Outlet } from 'react-router-dom'
import { LayoutGrid, LineChart, Cpu, Bell, ShieldCheck, User } from 'lucide-react'
import { Brand } from '../components/Navbar'
import AquaButton from '../components/AquaButton'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/analytics', label: 'Analytics', icon: LineChart },
  { to: '/devices', label: 'Devices', icon: Cpu },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/admin', label: 'Admin', icon: ShieldCheck },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function AppLayout() {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[250px_1fr] bg-slate-50">
      <aside className="bg-white border-r border-slate-200 p-5 md:h-screen md:sticky md:top-0">
        <div className="pb-5 mb-4 border-b border-slate-100"><Brand /></div>
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium whitespace-nowrap transition ${
                  isActive ? 'bg-aqua-lightblue text-aqua-blue' : 'text-aqua-grey hover:bg-aqua-lightblue'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="p-6"><Outlet /></main>
      <AquaButton />
    </div>
  )
}