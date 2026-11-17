const ACTIVE = ['Active', 'Paid', 'Present', 'Published', 'Read', 'Ready', 'Pass', 'Yes']
const INACTIVE = ['Absent', 'Inactive', 'Unpaid', 'Fail', 'No']

export default function StatusPill({ value, t }) {
  const type = ACTIVE.includes(value) ? 'active' : INACTIVE.includes(value) ? 'inactive' : 'pending'
  return <span className={`status-pill ${type}`}><i />{t(value) || value}</span>
}
