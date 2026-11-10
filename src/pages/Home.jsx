import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Check, LineChart, Waves, Droplet, ShieldCheck, Factory, GraduationCap, House, Building2 } from 'lucide-react'
import WaveBackground from '../components/WaveBackground'
import LiveCard from '../components/LiveCard'

const benefits = [
  { icon: Waves, title: 'See usage live', text: 'Track flow and consumption second by second, across every tank and pipeline.' },
  { icon: Droplet, title: 'Catch quality issues', text: 'Get alerted the moment water stops being safe to use.' },
  { icon: ShieldCheck, title: 'Never lose a reading', text: "Data keeps recording through network outages and syncs when you're back online." },
]

const uses = [
  { icon: Factory, title: 'Industries', text: 'Track process water and spot waste early.' },
  { icon: GraduationCap, title: 'Institutions', text: 'Monitor hostels, labs and canteens on one screen.' },
  { icon: House, title: 'Residential societies', text: 'Fair usage per block and safe drinking water.' },
  { icon: Building2, title: 'Smart cities', text: 'A scalable base for city-wide water networks.' },
]

export default function Home() {
  const { hash } = useLocation()

  // Makes "Product" and "Solutions" in the navbar scroll to their sections
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo(0, 0)
  }, [hash])

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-aqua-lightblue">
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-40 grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="animate-enter">
            <span className="inline-flex items-center gap-2 bg-white border border-blue-100 rounded-full pl-2 pr-3 py-1.5 text-sm mb-6">
              <span className="bg-aqua-lightteal text-aqua-teal font-bold text-[11px] tracking-wider rounded-full px-2 py-0.5">NEW</span>
              Offline-ready logging with adaptive sync
            </span>
            <h1 className="font-display font-extrabold text-5xl md:text-6xl leading-[1.02] tracking-tight">
              Every litre, measured.{' '}
              <span className="bg-gradient-to-r from-aqua-blue to-aqua-teal bg-clip-text text-transparent">
                Even when the Wi-Fi drops.
              </span>
            </h1>
            <p className="text-lg text-aqua-grey mt-5 max-w-xl">
              AquaByte tracks water flow, usage and quality in real time, and brings every device onto one live dashboard.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/dashboard" className="inline-flex items-center gap-2 bg-aqua-blue text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-blue-500/40 hover:-translate-y-0.5 transition">
                Open live dashboard <LineChart size={16} />
              </Link>
              <Link to="/signup" className="bg-white border border-slate-200 font-semibold px-5 py-3 rounded-xl hover:border-aqua-blue hover:text-aqua-blue transition">
                Create free account
              </Link>
            </div>
            <div className="flex flex-wrap gap-5 mt-8 text-sm text-aqua-grey">
              {['Real-time data', 'Works offline', 'Multi-device'].map(t => (
                <span key={t} className="flex items-center gap-1.5"><Check size={16} className="text-aqua-teal" />{t}</span>
              ))}
            </div>
          </div>
          <LiveCard />
        </div>
        <WaveBackground />
      </section>

      {/* WHY AQUABYTE */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-24 scroll-mt-20">
        <span className="text-xs font-semibold tracking-[0.14em] uppercase text-aqua-teal">Why AquaByte</span>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mt-3 max-w-2xl leading-[1.08]">
          Know your water. Act before it becomes a problem.
        </h2>
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {benefits.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="group border border-slate-200 rounded-2xl p-7 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 transition duration-300">
              <div className={`w-12 h-12 rounded-xl grid place-items-center mb-5 group-hover:scale-110 group-hover:-rotate-3 transition ${i % 2 ? 'bg-aqua-lightteal text-aqua-teal' : 'bg-aqua-lightblue text-aqua-blue'}`}>
                <Icon size={22} />
              </div>
              <h3 className="font-display font-bold text-xl">{title}</h3>
              <p className="text-aqua-grey mt-2">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section id="uses" className="bg-aqua-lightblue scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <span className="text-xs font-semibold tracking-[0.14em] uppercase text-aqua-teal">Who it's for</span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mt-3 max-w-xl leading-[1.08]">
            Built for anyone responsible for water
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {uses.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 hover:bg-aqua-lightteal hover:-translate-y-1 transition duration-300">
                <Icon size={26} className="text-aqua-blue" />
                <h4 className="font-display font-bold text-lg mt-3">{title}</h4>
                <p className="text-sm text-aqua-grey mt-1.5">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + QUOTE */}
      <section className="max-w-6xl mx-auto px-4 pt-24">
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-r from-aqua-blue to-aqua-teal text-white flex flex-wrap items-center justify-between gap-6">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border-[40px] border-white/10" />
          <div className="relative">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl">Want to see AquaByte on your site?</h2>
            <p className="opacity-90 mt-2">Book a demo and we'll walk you through it.</p>
          </div>
          <Link to="/signup" className="relative bg-white text-aqua-blue font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 transition">
            Get started
          </Link>
        </div>

        <figure className="text-center max-w-3xl mx-auto mt-16">
          <blockquote className="font-display font-bold text-3xl md:text-4xl tracking-tight leading-tight">
            <span className="text-aqua-teal">“</span>Every drop counts. So we made sure every drop gets counted.”
          </blockquote>
          <figcaption className="mt-4">
            <Link to="/team" className="font-semibold text-aqua-blue hover:underline">Meet the people behind AquaByte →</Link>
          </figcaption>
        </figure>
      </section>
    </>
  )
}