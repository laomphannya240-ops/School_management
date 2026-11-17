import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { chartTooltipProps } from './ChartTooltip.js'

export default function GenderChart({ data, total, t, centerLabel }) {
  return (
    <>
      <div className="gender-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={78} paddingAngle={4} startAngle={90} endAngle={-270}>
              {data.map((entry, index) => <Cell key={entry.name} fill={index ? '#f1b84c' : '#476bea'} />)}
            </Pie>
            <Tooltip {...chartTooltipProps} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <b>{total}</b>
          <small>{centerLabel || t?.('students')}</small>
        </div>
      </div>
      <div className="gender-legend">
        <span><i className="legend-dot blue" /> {t?.('male')} <b>54%</b></span>
        <span><i className="legend-dot amber" /> {t?.('female')} <b>46%</b></span>
      </div>
    </>
  )
}
