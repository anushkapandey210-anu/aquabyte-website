// Sample data for building the UI.
// Later: replace these functions with real API calls.

const usageCurve = (h, amount) => {
  h = ((h % 24) + 24) % 24
  const curve =
    0.09 +
    Math.exp(-((h - 8) ** 2) / 4) +          // morning peak
    0.38 * Math.exp(-((h - 13) ** 2) / 5) +  // midday
    0.65 * Math.exp(-((h - 20) ** 2) / 6)    // evening peak
  return Math.round(amount * curve * (0.92 + Math.random() * 0.16))
}

// Litres per hour for the last 24 hours
export function getHourlyUsage() {
  const nowHour = new Date().getHours()
  const minutePart = Math.max(0.25, new Date().getMinutes() / 60)
  return Array.from({ length: 24 }, (_, i) => {
    const h = (nowHour - 23 + i + 24) % 24
    const isNow = i === 23
    return {
      hour: isNow ? 'Now' : `${String(h).padStart(2, '0')}:00`,
      inlet: Math.round(usageCurve(h, 1400) * (isNow ? minutePart : 1)),
      hostel: Math.round(usageCurve(h + 1, 680) * (isNow ? minutePart : 1)),
    }
  })
}

// Litres per day for the last 7 days
export function getWeeklyUsage() {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const litres = [10420, 12980, 11760, 12310, 11290, 13140, 12846]
  return litres.map((value, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return { day: i === 6 ? 'Today' : names[d.getDay()], litres: value }
  })
}

export const recentAlerts = [
  { id: 1, level: 'critical', title: 'Turbidity above safe limit', device: 'AB-03', time: '10:42' },
  { id: 2, level: 'warning', title: 'Usage above normal', device: 'AB-02', time: 'Yesterday' },
  { id: 3, level: 'info', title: 'Device offline, logging locally', device: 'AB-04', time: '09:58' },
  { id: 4, level: 'resolved', title: 'Backlog synced', device: 'AB-06', time: '09:31' },
]
// Small wave for each device card
export function getSparkline(seed) {
  let v = 10
  return Array.from({ length: 24 }, (_, i) => {
    v += Math.sin(i * seed) * 2 + (Math.random() - 0.5) * 2
    v = Math.max(2, Math.min(20, v))
    return { i, v }
  })
}

export const devices = [
  { id: 'AB-01', name: 'Hostel Block A · Overhead tank', status: 'online', flow: 12.1, ntu: 0.72, signal: -58, lastSync: '2 s ago' },
  { id: 'AB-02', name: 'Main inlet · Pump house', status: 'online', flow: 24.6, ntu: 0.81, signal: -49, lastSync: '1 s ago' },
  { id: 'AB-03', name: 'Library washrooms', status: 'warning', flow: 6.2, ntu: 6.2, signal: -66, lastSync: '4 s ago' },
  { id: 'AB-04', name: 'Canteen kitchen line', status: 'offline', flow: null, ntu: null, signal: null, lastSync: '38 min ago',
    note: '1,284 readings stored on the device. They will upload when Wi-Fi returns.' },
  { id: 'AB-05', name: 'Lab building · RO feed', status: 'online', flow: 3.4, ntu: 0.21, signal: -61, lastSync: '3 s ago' },
  { id: 'AB-06', name: 'Garden irrigation line', status: 'online', flow: 8.9, ntu: 1.4, signal: -72, lastSync: 'just now',
    note: 'Back online. 212 stored readings synced.', noteOk: true },
]
export const allAlerts = [
  { id: 1, level: 'critical', type: 'quality', title: 'Turbidity above safe limit', device: 'AB-03', time: '10:42',
    detail: 'Library washrooms reads 6.2 NTU, above the 5 NTU permissible limit.' },
  { id: 2, level: 'warning', type: 'usage', title: 'Usage above normal', device: 'AB-02', time: 'Yesterday',
    detail: 'Main inlet used 18% more than its 7-day average.' },
  { id: 3, level: 'info', type: 'offline', title: 'Device offline, logging locally', device: 'AB-04', time: '09:58',
    detail: 'Canteen kitchen line lost Wi-Fi. 1,284 readings stored on the device so far.' },
  { id: 4, level: 'resolved', type: 'sync', title: 'Backlog synced', device: 'AB-06', time: '09:31',
    detail: 'Garden irrigation line reconnected and uploaded 212 stored readings.' },
]