import { Link } from 'react-router-dom'
import logo from '../assets/aquabyte-logo.png'

export default function Footer() {
  return (
    <footer className="bg-aqua-slate text-slate-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 pt-14 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="bg-white rounded-2xl p-4 inline-block">
              <img src={logo} alt="AquaByte IoT Solutions" className="h-24" />
            </div>
            <p className="text-sm mt-4 max-w-xs">Smart water monitoring with real-time insights.</p>
          </div>
          <div>
            <h5 className="text-white text-xs font-semibold tracking-widest uppercase mb-3">Product</h5>
            {['Dashboard', 'Analytics', 'Devices', 'Alerts'].map(p => (
              <Link key={p} to={`/${p.toLowerCase()}`} className="block py-1 text-sm hover:text-white">{p}</Link>
            ))}
          </div>
          <div>
            <h5 className="text-white text-xs font-semibold tracking-widest uppercase mb-3">Company</h5>
            <Link to="/team" className="block py-1 text-sm hover:text-white">Our team</Link>
            <Link to="/signup" className="block py-1 text-sm hover:text-white">Get started</Link>
          </div>
          <div>
            <h5 className="text-white text-xs font-semibold tracking-widest uppercase mb-3">Contact</h5>
            <a href="mailto:aquabyteiotsolutions@gmail.com" className="block text-sm hover:text-white break-all select-all">aquabyteiotsolutions@gmail.com</a>
            <p className="text-sm mt-1">India</p>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-10 pt-5 flex flex-wrap justify-between gap-2 text-sm">
          <span>© 2026 <b className="text-white">AquaByte IoT Solutions Pvt. Ltd.</b> All rights reserved.</span>
          <span>Privacy · Terms</span>
        </div>
      </div>
    </footer>
  )
}