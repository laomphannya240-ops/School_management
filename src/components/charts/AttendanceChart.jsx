import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { chartTooltipProps } from './ChartTooltip.js'

export default function AttendanceChart({ data, t, height = 'attendance-chart' }) {
  const rows = data.map((row) => ({ ...row, day: t?.(row.day) || row.day }))
  return (
    <div className={`chart ${height}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} barSize={20}>
          <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="var(--line)" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} />
          <YAxis hide domain={[70, 100]} />
          <Tooltip {...chartTooltipProps} />
          <Bar dataKey="attendance" name={t?.('attendanceRate')} radius={[5, 5, 0, 0]} fill="#56bd91" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
