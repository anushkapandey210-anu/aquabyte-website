import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import icon from '../assets/aquabyte-icon.png'

export function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <img src={icon} alt="AquaByte logo" className="h-9 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
      <span className="leading-none">
        <span className="font-display text-xl font-extrabold">
          <span className="text-aqua-navy">Aqua</span><span className="text-aqua-teal">Byte</span>
        </span>
        <span className="block text-[9px] font-semibold tracking-[0.3em] text-aqua-navy mt-1">IOT SOLUTIONS</span>
      </span>
    </Link>
  )
}

const links = [
  { label: 'Product', to: '/#features' },
  { label: 'Solutions', to: '/#uses' },
  { label: 'Our team', to: '/team' },
  { label: 'Dashboard', to: '/dashboard' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-[70px] flex items-center justify-between">
        <Brand />
        <nav className="hidden md:flex gap-7">
          {links.map(l => (
            <NavLink key={l.label} to={l.to} className="text-aqua-grey font-medium hover:text-aqua-slate transition">
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex gap-2">
          <Link to="/login" className="px-4 py-2 rounded-lg border border-slate-200 font-semibold text-sm hover:border-aqua-blue hover:text-aqua-blue transition">Log in</Link>
          <Link to="/signup" className="px-4 py-2 rounded-lg bg-aqua-blue text-white font-semibold text-sm shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition">Get started</Link>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-white">
          {links.map(l => (
            <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="text-aqua-grey font-medium">{l.label}</Link>
          ))}
          <Link to="/signup" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-aqua-blue text-white font-semibold text-center">Get started</Link>
        </div>
      )}
    </header>
  )
}