import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { chartTooltipProps } from './ChartTooltip.js'

export default function PerformanceChart({ data, t, height = 'performance-chart' }) {
  return (
    <div className={`chart ${height}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -22, right: 4, top: 8 }} barSize={18}>
          <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="var(--line)" />
          <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={48} />
          <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: 'var(--muted)', fontSize: 10 }} />
          <Tooltip {...chartTooltipProps} />
          <Bar dataKey="score" name={t?.('averageScore')} radius={[5, 5, 0, 0]}>
            {data.map((entry, index) => <Cell key={entry.subject} fill={['#476bea', '#6d86f0', '#8873df', '#56bd91', '#e6a43a', '#5cb8c7'][index % 6]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
