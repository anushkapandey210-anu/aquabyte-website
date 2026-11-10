// While USE_MOCK is true, the app uses sample data.
// When the backend is ready: set USE_MOCK = false and put your server address in BASE_URL.
const USE_MOCK = true
const BASE_URL = 'https://your-backend-address.com'

const DAYS = { '7d': 7, '30d': 30, '90d': 90 }
const wait = ms => new Promise(r => setTimeout(r, ms))
const seeded = seed => { let x = seed; return () => (x = (x * 9301 + 49297) % 233280) / 233280 }
const dayLabel = daysAgo => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return { label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), weekend: [0, 6].includes(d.getDay()) }
}

const mock = {
  // GET /api/v1/analytics/consumption?range=30d
  consumption(range) {
    const n = DAYS[range], r = seeded(n * 7 + 1)
    return Array.from({ length: n }, (_, i) => {
      const { label, weekend } = dayLabel(n - 1 - i)
      return {
        date: label,
        litres: Math.round(11200 + Math.sin(i / 4) * 900 + (weekend ? -1400 : 0) + r() * 1100),
        previous: Math.round(11900 + Math.sin(i / 4 + 1) * 800 + (weekend ? -1300 : 0) + r() * 1000),
      }
    })
  },
  // GET /api/v1/analytics/devices?range=30d
  devices() {
    return [
      { id: 'AB-02', name: 'Main inlet', share: 41 },
      { id: 'AB-01', name: 'Hostel Block A', share: 22 },
      { id: 'AB-04', name: 'Canteen kitchen', share: 14 },
      { id: 'AB-06', name: 'Garden irrigation', share: 11 },
      { id: 'AB-03', name: 'Library washrooms', share: 8 },
      { id: 'AB-05', name: 'Lab RO feed', share: 4 },
    ]
  },
  // GET /api/v1/analytics/quality?range=30d
  quality(range) {
    const n = DAYS[range], r = seeded(n * 3 + 5)
    return Array.from({ length: n }, (_, i) => ({
      date: dayLabel(n - 1 - i).label,
      inlet: +(0.6 + r() * 0.5).toFixed(2),
      library: +(1.2 + r() * 1.2 + (i > n - 6 ? i - (n - 6) : 0)).toFixed(2),
    }))
  },
  // GET /api/v1/analytics/hourly?range=30d
  hourly(range) {
    const r = seeded(DAYS[range] + 11)
    return Array.from({ length: 24 }, (_, h) => ({
      hour: `${String(h).padStart(2, '0')}:00`,
      weekday: Math.round(120 + 1350 * Math.exp(-((h - 8) ** 2) / 4) + 520 * Math.exp(-((h - 13) ** 2) / 5) + 880 * Math.exp(-((h - 20) ** 2) / 6) + r() * 80),
      weekend: Math.round(110 + 980 * Math.exp(-((h - 10) ** 2) / 6) + 600 * Math.exp(-((h - 14) ** 2) / 6) + 760 * Math.exp(-((h - 20) ** 2) / 7) + r() * 80),
    }))
  },
}

export async function getAnalytics(name, range) {
  if (USE_MOCK) {
    await wait(400 + Math.random() * 400) // pretend network delay
    return mock[name](range)
  }
  const res = await fetch(`${BASE_URL}/api/v1/analytics/${name}?range=${range}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
  })
  if (!res.ok) throw new Error(`Couldn't load ${name} (error ${res.status})`)
  return res.json()
}