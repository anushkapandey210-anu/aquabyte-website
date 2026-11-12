import { useEffect, useRef, useState } from 'react'
import { ArrowDown, Check, Copy, ExternalLink, Trophy } from 'lucide-react'
import { COMPANY_EMAIL } from '../services/auth'
import './team.css'

// ---------- EDIT YOUR CONTENT HERE ----------
// Photos go in public/team/. If a photo is missing, initials show instead.
const TEAM = [
  {
    name: 'Nishant Kumar', short: 'Nishant', role: 'Founder', tone: 'blue',
    label: 'Founder · The spark behind AquaByte',
    photo: '/team/nishant.jpg',
    bio: [
      "AquaByte started with a single visit. During an internship, Nishant saw a problem at an industry firm that most people had stopped noticing. Where others saw \"the way it's always done\", he saw room to do better.",
      'He took the idea to his friends. One conversation turned into research, planning and a shared goal: to build something of their own.',
      "Since then he has led AquaByte's research, planning and execution, turning a passing thought into the foundation of a startup.",
    ],
    quote: 'Sometimes all it takes is the ambition to build something from scratch.',
    focus: ['Vision', 'Research', 'Execution'],
    linkedin: 'https://www.linkedin.com/in/kumar-nishant-ds', // leave empty to hide the button
  },
  {
    name: 'Bhavya Singhal', short: 'Bhavya', role: 'Co-founder', tone: 'teal',
    label: 'Co-founder · The strategist',
    photo: '/team/bhavya.jpg',
    bio: [
      "Bhavya believed in the idea from the very first conversation and has been part of AquaByte's journey since day one.",
      "She is the team's strategist and thinker. She helps decide where AquaByte is heading, brings people and ideas together, and makes sure every big decision has a clear reason behind it.",
    ],
    focus: ['Strategy', 'Collaboration', 'Big-picture thinking'],
    linkedin: 'https://www.linkedin.com/in/bhavya-singhal-a0b485381',
  },
  {
    name: 'Anushka Pandey', short: 'Anushka', role: 'Core Team Member', tone: 'sky',
    label: 'Core Team Member',
    photo: '/team/anushka.jpg',
    inHero: false, // not shown in the top water drops (founders only)
    bio: [
      "Anushka designed and developed the AquaByte website, from the home page to the live dashboard, analytics charts and the Aqua assistant. She turned the team's ideas into a clean, responsive site that works on every screen.",
    ],
    focus: ['Web development', 'UI design', 'React'],
    linkedin: 'https://www.linkedin.com/in/anushka-pandey-83b570381',
  },
]

const ACHIEVEMENT = {
  event: 'IDEAS 4.0 · 27 Oct 2026',
  title: 'Recognised on stage at IDEAS 4.0',
  text: 'We presented AquaByte at IDEAS 4.0, the innovation and entrepreneurship event by KEIC at K.R. Mangalam University, and were awarded certificates on stage. A moment that pushed us to keep building.',
  // Photos live in public/achievements/
  photos: [
    { src: '/achievements/ideas-1.jpg', alt: 'The AquaByte team receiving their certificate on stage at IDEAS 4.0' },
    { src: '/achievements/ideas-2.jpg', alt: 'The AquaByte team receiving the certificate on stage at IDEAS 4.0' },
    { src: '/achievements/ideas-3.jpg', alt: 'Being congratulated on stage at IDEAS 4.0, K.R. Mangalam University' },
  ],
}

const VALUES = [
  { title: 'Every drop counts', text: 'Water is too valuable to manage by guesswork.' },
  { title: 'Data you can trust', text: "Readings are kept safe, even when the network isn't." },
  { title: 'Simple by design', text: 'Clear screens anyone on a campus or in a society can use.' },
]
// --------------------------------------------

const ROTATE_MS = 7000
const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Photo, or initials if the photo is missing
function Photo({ person }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className={`tm-ph ${person.tone}`}>
      {person.photo && !failed
        ? <img src={person.photo} alt={person.name} onError={() => setFailed(true)} />
        : initials(person.name)}
    </span>
  )
}

// Water ripples that follow the cursor in the hero
function useRipples(heroRef, canvasRef) {
  useEffect(() => {
    const hero = heroRef.current, cv = canvasRef.current
    if (!hero || !cv) return
    const cx = cv.getContext('2d')
    let W = 0, H = 0, rings = [], last = 0, raf = 0

    const size = () => {
      const d = window.devicePixelRatio || 1
      W = cv.clientWidth; H = cv.clientHeight
      cv.width = W * d; cv.height = H * d
      cx.setTransform(d, 0, 0, d, 0, 0)
    }
    const add = (x, y, strong) => rings.push({ x, y, r: 2, a: strong ? 0.9 : 0.55, w: strong ? 2.2 : 1.4, s: strong ? 2.6 : 1.8 })
    const onMove = e => {
      const now = performance.now()
      if (now - last < 45) return
      last = now
      const b = cv.getBoundingClientRect()
      add(e.clientX - b.left, e.clientY - b.top, false)
    }
    const onDown = e => {
      const b = cv.getBoundingClientRect()
      for (let k = 0; k < 3; k++) setTimeout(() => add(e.clientX - b.left, e.clientY - b.top, true), k * 140)
    }
    const frame = t => {
      cx.clearRect(0, 0, W, H)
      for (let i = 0; i < 40; i++) {
        const tw = 0.25 + 0.25 * Math.sin(t / 700 + i)
        cx.fillStyle = `rgba(37,99,235,${tw * 0.22})`
        cx.fillRect((i * 397) % W, (i * 211) % H, 1.6, 1.6)
      }
      if (Math.random() < 0.025) add(Math.random() * W, Math.random() * H * 0.85, false)
      rings = rings.filter(g => g.a > 0.01)
      for (const g of rings) {
        g.r += g.s; g.a *= 0.972
        cx.beginPath(); cx.ellipse(g.x, g.y, g.r, g.r * 0.55, 0, 0, Math.PI * 2)
        cx.strokeStyle = `rgba(13,148,136,${g.a * 0.6})`; cx.lineWidth = g.w; cx.stroke()
        cx.beginPath(); cx.ellipse(g.x, g.y, g.r * 0.7, g.r * 0.38, 0, 0, Math.PI * 2)
        cx.strokeStyle = `rgba(37,99,235,${g.a * 0.4})`; cx.lineWidth = 1; cx.stroke()
      }
      raf = requestAnimationFrame(frame)
    }

    size()
    window.addEventListener('resize', size)
    if (reducedMotion()) return () => { window.removeEventListener('resize', size) }

    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerdown', onDown)
    raf = requestAnimationFrame(frame)
    const intro = [[0.62, 0.35], [0.3, 0.7], [0.82, 0.62]].map(([fx, fy], k) =>
      setTimeout(() => add(W * fx, H * fy, true), 300 + k * 500))

    return () => {
      cancelAnimationFrame(raf)
      intro.forEach(clearTimeout)
      window.removeEventListener('resize', size)
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerdown', onDown)
    }
  }, [heroRef, canvasRef])
}

// Adds "inview" once the element scrolls into view
function useInView() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); io.disconnect() }
    }, { threshold: 0.25 })
    io.observe(el)
    return () => { io.disconnect() }
  }, [])
  return [ref, seen]
}

export default function Team() {
  const heroRef = useRef(null)
  const canvasRef = useRef(null)
  const spotRef = useRef(null)
  const photoRef = useRef(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [copied, setCopied] = useState(false)
  const [photo, setPhoto] = useState(0)
  const [bandRef, bandSeen] = useInView()

  useRipples(heroRef, canvasRef)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // Show the next person every 7 seconds unless paused
  useEffect(() => {
    if (paused || reducedMotion()) return
    const t = setTimeout(() => setActive(i => (i + 1) % TEAM.length), ROTATE_MS)
    return () => { clearTimeout(t) }
  }, [active, paused])

  function showPerson(i) {
    setActive(i)
    spotRef.current?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' })
  }

  // Slight 3D tilt on the big photo
  function tilt(e) {
    const el = photoRef.current
    if (!el || reducedMotion()) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(COMPANY_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Copy isn't allowed here, so the email stays visible to copy by hand
    }
  }

  const p = TEAM[active]

  return (
    <div className="tm">
      {/* ---------- Hero ---------- */}
      <section className="tm-hero" ref={heroRef}>
        <canvas ref={canvasRef} aria-hidden="true" />
        <div className="tm-hero-inner">
          <div className="animate-enter">
            <span className="tm-eyebrow"><i />The people behind AquaByte</span>
            <h1>Two friends.<br /><span className="tm-outline">One question.</span><br /><span className="tm-grad">A mission to make every drop count.</span></h1>
            <p>It started as a conversation between friends. Today it's AquaByte. Move your cursor over the water and meet the team.</p>
            <button className="tm-cta" onClick={() => showPerson(active)}>Meet the team <ArrowDown size={16} /></button>
          </div>

          <div className="tm-drops" aria-label="Team members">
            {TEAM.filter(person => person.inHero !== false).map((person, i) => (
              <button key={person.name} className={`tm-drop d${i + 1}`} onClick={() => showPerson(i)}>
                <span className="tm-drop-shape"><Photo person={person} /></span>
                <span className="tm-drop-label"><b>{person.short}</b>{person.role}</span>
              </button>
            ))}
          </div>
        </div>
        <svg className="tm-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path className="w1" d="M0,64 C240,112 480,16 720,56 C960,96 1200,24 1440,60 L1440,120 L0,120 Z" />
          <path className="w2" d="M0,80 C260,40 520,110 780,74 C1040,38 1260,96 1440,70 L1440,120 L0,120 Z" />
        </svg>
      </section>

      {/* ---------- Meet the team ---------- */}
      <section className="tm-section">
        <span className="tm-kicker">Meet the team</span>
        <h2>The people behind AquaByte</h2>
        <p>Pick a person to see their story and what they focus on.</p>

        <div ref={spotRef} className={`tm-spot ${paused ? 'paused' : ''}`}
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div>
            <div className="tm-tabs" role="tablist" aria-label="Team members">
              {TEAM.map((person, i) => (
                <button key={person.name} role="tab" aria-selected={i === active}
                  className={`tm-tab ${i === active ? 'on' : ''}`} onClick={() => setActive(i)}>
                  <span className="tm-tab-photo"><Photo person={person} /></span>
                  <span><b>{person.short}</b><small>{person.role}</small></span>
                  {/* key restarts the progress bar for each person */}
                  {i === active && <i key={active} className="tm-tab-bar" />}
                </button>
              ))}
            </div>
            <p className="tm-hint">Changes every few seconds · hover to pause</p>
          </div>

          {/* key={active} replays all the entry animations when the person changes */}
          <div className="tm-card" role="tabpanel" key={active}>
            <div className="tm-card-photo" ref={photoRef} onMouseMove={tilt}
              onMouseLeave={() => { if (photoRef.current) photoRef.current.style.transform = '' }}>
              <span className="tm-splash" aria-hidden="true">
                <svg viewBox="0 0 400 60" preserveAspectRatio="none"><path d="M0,30 C60,0 120,60 200,30 C280,0 340,60 400,30 L400,60 L0,60 Z" /></svg>
              </span>
              <Photo person={p} />
              <span className="tm-role-badge">{p.role}</span>
            </div>
            <div className="tm-info">
              <span className="tm-kicker">{p.label}</span>
              <h3>{p.name}</h3>
              {p.bio.map(text => <p key={text} className="tm-bio">{text}</p>)}
              {p.quote && <blockquote className="tm-quote">{p.quote}</blockquote>}
              <span className="tm-label">Focus</span>
              <div className="tm-tags">{p.focus.map(f => <span key={f}>{f}</span>)}</div>
              {p.linkedin && (
                <a className="tm-link" href={p.linkedin} target="_blank" rel="noreferrer">LinkedIn <ExternalLink size={13} /></a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Achievements ---------- */}
      <section className="tm-section">
        <span className="tm-kicker">Achievements</span>
        <h2>Recognition so far</h2>
        <div className="tm-ach">
          <div className="tm-ac big tm-ac-feature">
            <div className="tm-gallery">
              <img key={photo} className="tm-gallery-main" src={ACHIEVEMENT.photos[photo].src} alt={ACHIEVEMENT.photos[photo].alt} />
              <div className="tm-gallery-thumbs">
                {ACHIEVEMENT.photos.map((ph, i) => (
                  <button key={ph.src} className={i === photo ? 'on' : ''} onClick={() => setPhoto(i)} aria-label={`Show photo ${i + 1}`}>
                    <img src={ph.src} alt="" />
                  </button>
                ))}
              </div>
            </div>
            <div className="tm-ac-text">
              <span className="tm-ac-icon"><Trophy size={24} /></span>
              <span className="tm-ac-event">{ACHIEVEMENT.event}</span>
              <h3>{ACHIEVEMENT.title}</h3>
              <p>{ACHIEVEMENT.text}</p>
            </div>
          </div>
          <div className="tm-ac">
            <span className="tm-ac-icon"><Check size={22} /></span>
            <span className="tm-ac-event">Milestone</span>
            <h3>Working prototype</h3>
            <p>Live flow and quality readings on one dashboard.</p>
          </div>
          <div className="tm-ac next">
            <span className="tm-ac-icon"><Trophy size={22} /></span>
            <h3 style={{ fontSize: 17 }}>Next achievement</h3>
            <p>Space for the next win.</p>
          </div>
        </div>

        {/* ---------- Values band ---------- */}
        <div ref={bandRef} className={`tm-band ${bandSeen ? 'inview' : ''}`}>
          <svg className="tm-level" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
            <path className="l1" d="M0,40 C200,0 400,80 600,40 C800,0 1000,80 1200,40 L1200,200 L0,200 Z" />
            <path className="l2" d="M0,60 C220,100 420,20 640,60 C860,100 1040,30 1200,60 L1200,200 L0,200 Z" />
          </svg>
          <div>
            <h2>Started with curiosity.<br />Built for the real world.</h2>
            <p style={{ marginTop: 18, fontSize: 14 }}>Want to work with us or bring AquaByte to your campus?</p>
            <div className="tm-mail">
              <span>{COMPANY_EMAIL}</span>
              <button onClick={copyEmail}>{copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}</button>
            </div>
          </div>
          <div className="tm-values">
            {VALUES.map(v => <div key={v.title}><b>{v.title}</b><span>{v.text}</span></div>)}
          </div>
        </div>
      </section>
    </div>
  )
}