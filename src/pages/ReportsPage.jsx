import { useMemo, useState } from 'react'
import { FileBarChart, Printer } from 'lucide-react'
import PageHeader from '../components/common/PageHeader.jsx'
import DataTable from '../components/common/DataTable.jsx'
import FilterDropdown from '../components/common/FilterDropdown.jsx'
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import AttendanceChart from '../components/charts/AttendanceChart.jsx'
import PerformanceChart from '../components/charts/PerformanceChart.jsx'
import { useDashboard } from '../hooks/useDashboard.js'
import { useResource } from '../hooks/useResource.js'

const REPORT_TYPES = [
  ['students', 'studentReport'], ['teachers', 'teacherReport'], ['attendance', 'attendanceReport'],
  ['exams', 'examReport'], ['performance', 'performanceReport'], ['payments', 'paymentReport'],
]

export default function ReportsPage({ role, t }) {
  const [type, setType] = useState('students')
  const [classFilter, setClassFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [period, setPeriod] = useState('')

  const students = useResource('students', role)
  const teachers = useResource('teachers', role)
  const attendance = useResource('attendance', role)
  const grades = useResource('grades', role)
  const payments = useResource('payments', role)
  const dashboardResource = useDashboard(role)
  const resources = [students, teachers, attendance, grades, payments, dashboardResource]
  const loading = resources.some((resource) => resource.loading)
  const error = resources.find((resource) => resource.error)?.error

  const emptyDashboard = useMemo(() => ({
    grades: [], attendance: [], performance: [], attendanceAverage: '—',
  }), [])
  const dashboard = dashboardResource.data || emptyDashboard
  const classOptions = [...new Set([...students.rows, ...attendance.rows].map((row) => row.class).filter(Boolean))]

  const report = useMemo(() => buildReport(type, { students: students.rows, teachers: teachers.rows, attendance: attendance.rows, grades: grades.rows, payments: payments.rows, dashboard, classFilter, statusFilter, t }), [type, students.rows, teachers.rows, attendance.rows, grades.rows, payments.rows, dashboard, classFilter, statusFilter, t])

  return (
    <>
      <PageHeader
        eyebrow={`${t('workspace')} / ${t('reports')}`}
        title={t('reports')}
        description={t('reportsDescription')}
        action={<button className="button primary" onClick={() => window.print()}><Printer size={16} />{t('print')}</button>}
      />

      <section className="card report-tabs-card">
        <div className="report-tabs" role="tablist">
          {REPORT_TYPES.map(([key, label]) => (
            <button key={key} role="tab" aria-selected={type === key} className={`report-tab ${type === key ? 'active' : ''}`} onClick={() => { setType(key); setClassFilter(''); setStatusFilter('') }}>
              <FileBarChart size={16} />{t(label)}
            </button>
          ))}
        </div>
        <div className="list-toolbar report-filters">
          <FilterDropdown label={t('allClasses')} value={classFilter} onChange={setClassFilter} options={classOptions.map((value) => ({ value, label: value }))} icon={null} />
          <FilterDropdown label={t('allStatuses')} value={statusFilter} onChange={setStatusFilter} options={report.statuses.map((value) => ({ value, label: t(value) || value }))} icon={null} />
          <FilterDropdown label={t('reportPeriod')} value={period} onChange={setPeriod} options={[{ value: 'term', label: t('term1') }, { value: 'year', label: t('yearLabel') }]} icon={null} />
        </div>
      </section>

      {loading && <LoadingSkeleton rows={6} columns={5} />}
      {!loading && error && <ErrorState t={t} onRetry={() => resources.forEach((resource) => resource.reload())} />}
      {!loading && !error && (
        <div className="report-layout">
          <div className="report-stats">
            {report.stats.map((stat) => (
              <section className="card stat-card report-stat" key={stat.label}>
                <p>{stat.label}</p><strong>{stat.value}</strong><small>{stat.hint || ''}</small>
              </section>
            ))}
          </div>
          <section className="card report-chart-card">
            <div className="card-heading"><div><h3>{report.chartTitle}</h3><p>{t('reportSummary')}</p></div></div>
            {report.chart}
          </section>
          <section className="card report-table-card">
            <div className="card-heading"><div><h3>{t(report.titleKey)}</h3><p>{t('reportNote')}</p></div></div>
            <DataTable rows={report.rows.slice(0, 12)} columns={report.columns} rowId={(row) => row[report.idKey] || row.name} t={t} />
          </section>
        </div>
      )}
    </>
  )
}

function filtered(rows, classFilter, statusFilter) {
  return rows.filter((row) => (!classFilter || row.class === classFilter) && (!statusFilter || row.status === statusFilter))
}

function buildReport(type, ctx) {
  const { students, teachers, attendance, grades, payments, dashboard, classFilter, statusFilter, t } = ctx
  const base = { classFilter, statusFilter, t }

  if (type === 'students') {
    const rows = filtered(students, classFilter, statusFilter)
    const byClass = groupCount(rows, 'class')
    return {
      ...base,
      titleKey: 'studentReport', chartTitle: t('studentsByClass'),
      statuses: [...new Set(students.map((row) => row.status).filter(Boolean))],
      stats: [
        { label: t('totalStudents'), value: rows.length },
        { label: t('Active'), value: rows.filter((row) => row.status === 'Active').length, hint: t('Active') },
        { label: t('allClasses'), value: new Set(rows.map((row) => row.class)).size },
      ],
      chart: <PerformanceChart data={byClass} t={t} height="report-chart" />,
      rows, idKey: 'student_id',
      columns: [{ key: 'student_id' }, { key: 'name', label: 'fullName' }, { key: 'gender' }, { key: 'class' }, { key: 'status' }],
    }
  }

  if (type === 'teachers') {
    const rows = filtered(teachers.map((row) => ({ ...row, class: row.class || row.classAssignments })), classFilter, statusFilter)
    const bySubject = groupCount(rows, 'specialization')
    return {
      ...base,
      titleKey: 'teacherReport', chartTitle: t('scoresBySubject'),
      statuses: [...new Set(teachers.map((row) => row.status).filter(Boolean))],
      stats: [
        { label: t('totalTeachers'), value: rows.length },
        { label: t('Active'), value: rows.filter((row) => row.status === 'Active').length },
        { label: t('specialization'), value: new Set(rows.map((row) => row.specialization)).size },
      ],
      chart: <PerformanceChart data={bySubject} t={t} height="report-chart" />,
      rows, idKey: 'teacher_id',
      columns: [{ key: 'teacher_id' }, { key: 'name', label: 'fullName' }, { key: 'specialization' }, { key: 'email' }, { key: 'status' }],
    }
  }

  if (type === 'attendance') {
    const rows = filtered(attendance, classFilter, statusFilter)
    return {
      ...base,
      titleKey: 'attendanceReport', chartTitle: t('attendanceByDay'),
      statuses: ['Present', 'Absent', 'Late', 'Permission'],
      stats: [
        { label: t('totalStudents'), value: rows.length },
        { label: t('Present'), value: rows.filter((row) => row.status === 'Present').length, hint: t('Present') },
        { label: t('Absent'), value: rows.filter((row) => row.status === 'Absent').length, hint: t('Absent') },
        { label: t('attendanceRate'), value: dashboard.attendanceAverage },
      ],
      chart: <AttendanceChart data={dashboard.attendance} t={t} height="report-chart" />,
      rows, idKey: 'attendance_id',
      columns: [{ key: 'date' }, { key: 'name', label: 'fullName' }, { key: 'class' }, { key: 'status' }],
    }
  }

  if (type === 'exams') {
    const rows = filtered(grades.map((row) => ({ ...row, status: row.status || 'Published' })), classFilter, statusFilter)
    const bySubject = groupCount(rows, 'subject')
    const average = rows.length ? Math.round(rows.reduce((sum, row) => sum + Number(row.score || 0), 0) / rows.length) : 0
    return {
      ...base,
      titleKey: 'examReport', chartTitle: t('scoresBySubject'),
      statuses: ['Published'],
      stats: [
        { label: t('exams'), value: new Set(rows.map((row) => row.examName)).size },
        { label: t('averageScore'), value: `${average}%` },
        { label: t('Pass'), value: rows.filter((row) => Number(row.score) >= 50).length },
      ],
      chart: <PerformanceChart data={bySubject} t={t} height="report-chart" />,
      rows, idKey: 'result_id',
      columns: [{ key: 'name', label: 'fullName' }, { key: 'class' }, { key: 'subject' }, { key: 'amount', label: 'score' }, { key: 'grade' }],
    }
  }

  if (type === 'performance') {
    const rows = dashboard.grades
    return {
      ...base,
      titleKey: 'performanceReport', chartTitle: t('scoresBySubject'),
      statuses: ['Published'],
      stats: [
        { label: t('averageScore'), value: '84.8%' },
        { label: t('Pass'), value: `${rows.filter((row) => Number(row.score) >= 50).length}/${rows.length}` },
        { label: t('gradeClassification'), value: 'A−' },
      ],
      chart: <PerformanceChart data={dashboard.performance} t={t} height="report-chart" />,
      rows, idKey: 'result_id',
      columns: [{ key: 'name', label: 'fullName' }, { key: 'class' }, { key: 'subject' }, { key: 'amount', label: 'score' }, { key: 'grade' }],
    }
  }

  const rows = filtered(payments, classFilter, statusFilter)
  const paid = rows.filter((row) => row.status === 'Paid')
  return {
    ...base,
    titleKey: 'paymentReport', chartTitle: t('revenueByStatus'),
    statuses: ['Paid', 'Unpaid', 'Partial'],
    stats: [
      { label: t('payment'), value: rows.length },
      { label: t('Paid'), value: paid.length },
      { label: t('Unpaid'), value: rows.filter((row) => row.status === 'Unpaid').length },
      { label: t('amount'), value: `$${paid.reduce((sum, row) => sum + Number(String(row.amount).replace(/[^\d.]/g, '') || 0), 0).toFixed(2)}` },
    ],
    chart: <PerformanceChart data={['Paid', 'Unpaid', 'Partial'].map((status) => ({ subject: t(status), score: rows.filter((row) => row.status === status).length }))} t={t} height="report-chart" />,
    rows, idKey: 'payment_id',
    columns: [{ key: 'payment_id' }, { key: 'name', label: 'fullName' }, { key: 'class' }, { key: 'amount' }, { key: 'date' }, { key: 'status' }],
  }
}

function groupCount(rows, key) {
  const counts = rows.reduce((result, row) => {
    const name = row[key] || '—'
    result[name] = (result[name] || 0) + 1
    return result
  }, {})
  return Object.entries(counts).map(([subject, score]) => ({ subject, score }))
}
