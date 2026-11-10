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