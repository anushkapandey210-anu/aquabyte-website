import { useEffect } from 'react'

const people = [
  { name: 'Nishant Kumar', role: 'Founder', initials: 'NK', photo: null,
    bio: 'Leads the product vision and how AquaByte works out in the field.',
    ring: 'text-aqua-blue', bg: 'bg-aqua-lightblue', pill: 'bg-aqua-lightblue text-aqua-blue' },
  { name: 'Bhavya Singhal', role: 'Co-founder', initials: 'BS', photo: null,
    bio: 'Shapes the platform and the experience behind every dashboard.',
    ring: 'text-aqua-teal', bg: 'bg-aqua-lightteal', pill: 'bg-aqua-lightteal text-aqua-teal' },
  { name: 'Anushka Pandey', role: 'Web Developer', initials: 'AP', photo: null,
    bio: 'Designs and builds the AquaByte website and web app.',
    ring: 'text-aqua-navy', bg: 'bg-aqua-lightblue', pill: 'bg-indigo-50 text-aqua-navy' },
]

const values = [
  { title: 'Every drop counts', text: 'Water is too valuable to manage by guesswork.' },
  { title: 'Data you can trust', text: "Readings are kept safe, even when the network isn't." },
  { title: 'Simple by design', text: 'Clear screens anyone on a campus or in a society can use.' },
]

export default function Team() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      {/* Heading */}
      <section className="bg-gradient-to-b from-white to-aqua-lightblue text-center px-4 pt-20 pb-16">
        <div className="animate-enter">
          <span className="text-xs font-semibold tracking-[0.14em] uppercase text-aqua-teal">Our team</span>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight leading-none mt-4">
            The people behind{' '}
            <span className="whitespace-nowrap">
              <span className="text-aqua-navy">Aqua</span><span className="text-aqua-teal">Byte</span>
            </span>
          </h1>
          <p className="text-lg text-aqua-grey max-w-xl mx-auto mt-5">
            We're a team of college students building smarter ways to measure and protect water.
          </p>
        </div>
      </section>

      {/* People */}
      <section className="max-w-6xl mx-auto px-4 pt-6">
        <div className="grid md:grid-cols-3 gap-5">
          {people.map((p, i) => (
            <article key={p.name}
              className="animate-enter text-center bg-white border border-slate-200 rounded-3xl px-6 py-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 transition duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}>

              {/* Photo or initials inside a spinning gradient ring */}
              <div className="relative w-32 h-32 mx-auto mb-5">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(#2563EB,#0D9488,#2563EB)] animate-spin [animation-duration:8s]" />
                <div className={`absolute inset-[5px] rounded-full border-4 border-white overflow-hidden grid place-items-center ${p.bg}`}>
                  {p.photo
                    ? <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                    : <span className={`font-display font-extrabold text-4xl ${p.ring}`}>{p.initials}</span>}
                </div>
              </div>

              <span className={`inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full ${p.pill}`}>{p.role}</span>
              <h3 className="font-display font-extrabold text-2xl mt-3">{p.name}</h3>
              <p className="text-aqua-grey mt-2">{p.bio}</p>
            </article>
          ))}
        </div>

        {/* Story + values */}
        <div className="mt-20 grid md:grid-cols-[1fr_1.2fr] gap-10 bg-aqua-slate text-slate-300 rounded-3xl p-8 md:p-11">
          <h2 className="font-display font-extrabold text-white text-3xl md:text-4xl leading-tight">
            Started in a classroom.<br />Built for the real world.
          </h2>
          <div className="grid gap-5">
            {values.map(v => (
              <div key={v.title} className="border-l-[3px] border-aqua-teal pl-4">
                <b className="block text-white font-display text-lg">{v.title}</b>
                <span className="text-sm">{v.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}