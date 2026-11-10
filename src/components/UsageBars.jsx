import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import { getWeeklyUsage } from '../services/mockData'

const data = getWeeklyUsage()

export default function UsageBars() {
  return (
    <div className="h-60 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid stroke="#EEF2F7" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }}
            tickFormatter={v => `${v / 1000}k`} />
          <Tooltip cursor={{ fill: '#EFF6FF' }}
            formatter={v => [`${v.toLocaleString('en-IN')} L`, 'Used']}
            contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }} />
          <Bar dataKey="litres" radius={[6, 6, 0, 0]} animationDuration={900}>
            {data.map((d, i) => <Cell key={d.day} fill={i === data.length - 1 ? '#2563EB' : '#CFE0FB'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}