import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { chartTooltipProps } from './ChartTooltip.js'

export default function EnrollmentChart({ data, t }) {
  return (
    <div className="chart enrollment-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -20, right: 6, top: 8 }}>
          <defs>
            <linearGradient id="enrollFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4468e8" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#4468e8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="var(--line)" />
          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} />
          <Tooltip {...chartTooltipProps} />
          <Area type="monotone" dataKey="students" name={t?.('students')} stroke="#4468e8" fill="url(#enrollFill)" strokeWidth={2.5} />
          <Area type="monotone" dataKey="new" name={t?.('newEnrollments')} stroke="#9bb0ff" fill="transparent" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
