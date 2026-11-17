import { Activity, Bell, BookOpen, CalendarDays, ClipboardList, CreditCard, GraduationCap, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import DataTable from '../components/common/DataTable.jsx'
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import EnrollmentChart from '../components/charts/EnrollmentChart.jsx'
import GenderChart from '../components/charts/GenderChart.jsx'
import AttendanceChart from '../components/charts/AttendanceChart.jsx'
import PerformanceChart from '../components/charts/PerformanceChart.jsx'
import { useDashboard } from '../hooks/useDashboard.js'

const statIcons = [GraduationCap, Users, BookOpen, ClipboardList]

export default function Dashboard({ role, t }) {
  const { data, loading, error, reload } = useDashboard(role)
  const stats = data?.stats?.[role] || []

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t('welcome')}, {t(role)}</p>
          <h1>{t('dashboard')}</h1>
          <p className="muted">{t('overviewText')}</p>
        </div>
        <span className="reporting-period"><CalendarDays size={16} />{t('thisWeek')}</span>
      </div>

      {loading && <><LoadingSkeleton variant="cards" count={4} /><LoadingSkeleton rows={5} columns={4} /></>}
      {!loading && error && <ErrorState t={t} onRetry={reload} />}
      {!loading && !error && data && (
        <>
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const Icon = statIcons[index] || Activity
              return <StatCard key={stat.label} {...stat} Icon={Icon} t={t} />
            })}
          </div>

          {role === 'admin' && <AdminOverview data={data} t={t} />}
          {role === 'teacher' && <TeacherOverview data={data} t={t} />}
          {role === 'student' && <StudentOverview data={data} t={t} />}

          <section className="card exams-card dashboard-exams">
            <div className="card-heading">
              <div><h3>{t('upcomingExams')}</h3><p>{t('examSchedule')}</p></div>
              {role !== 'student' && <Link className="link-button" to="/exams">{t('viewAll')}</Link>}
            </div>
            <ExamList exams={data.exams} t={t} />
          </section>
        </>
      )}
    </>
  )
}

function StatCard({ label, value, change, Icon, tone = 'blue', t }) {
  return (
    <section className="card stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={19} /></div>
      <span className="stat-change">↗ {change}</span>
      <p>{t(label)}</p>
      <strong>{value}</strong>
      <small>↑ 8.2% <span>{t('fromLastMonth')}</span></small>
    </section>
  )
}

function CardHeading({ title, subtitle, children }) {
  return <div className="card-heading"><div><h3>{title}</h3><p>{subtitle}</p></div>{children}</div>
}

function AdminOverview({ data, t }) {
  return (
    <>
      <div className="dashboard-grid admin-dashboard-grid">
        <section className="card enrollment-card">
          <CardHeading title={t('enrollment')} subtitle={t('enrollmentSub')}>
            <span className="chart-range-label">2021 – 2025</span>
          </CardHeading>
          <div className="chart-legend">
            <span><i className="legend-dot blue" /> {t('students')}</span>
            <span><i className="legend-dot lightblue" /> {t('newEnrollments')}</span>
          </div>
          <EnrollmentChart data={data.enrollment} t={t} />
        </section>
        <section className="card gender-card">
          <CardHeading title={t('studentGender')} subtitle={t('studentDistribution')} />
          <GenderChart data={data.gender} total="1,248" t={t} />
        </section>
        <section className="card attendance-card">
          <CardHeading title={t('attendanceOverview')} subtitle={t('attendanceSub')}>
            <span className="trend positive">↑ 2.4%</span>
          </CardHeading>
          <div className="attendance-value">{data.attendanceAverage} <small>{t('average')}</small></div>
          <AttendanceChart data={data.attendance} t={t} />
        </section>
        <RecentActivity activities={data.activities} t={t} />
      </div>
      <div className="dashboard-grid secondary-dashboard-grid">
        <section className="card table-card">
          <CardHeading title={t('recentStudents')} subtitle={t('recentStudentsSub')}>
            <Link className="link-button" to="/students">{t('viewAll')}</Link>
          </CardHeading>
          <StudentTable students={data.students} t={t} />
        </section>
        <section className="card performance-card">
          <CardHeading title={t('academicPerformance')} subtitle={t('performanceSub')} />
          <PerformanceChart data={data.performance} t={t} />
        </section>
      </div>
      <NotificationsCard notifications={data.notifications} t={t} />
    </>
  )
}

function TeacherOverview({ data, t }) {
  const classColumns = [{ key: 'name', label: 'class' }, { key: 'grade' }, { key: 'room' }, { key: 'status' }]
  const scheduleColumns = [{ key: 'date' }, { key: 'name', label: 'subject' }, { key: 'class' }, { key: 'status' }]
  return (
    <>
      <div className="dashboard-grid role-dashboard-grid">
        <section className="card table-card">
          <CardHeading title={t('myClasses')} subtitle={t('myclassesDescription')} />
          <DataTable rows={data.classes} columns={classColumns} rowId={(row) => row.class_id} t={t} />
        </section>
        <section className="card table-card">
          <CardHeading title={t('myschedule')} subtitle={t('myscheduleDescription')} />
          <DataTable rows={data.schedule} columns={scheduleColumns} rowId={(row, index) => `${row.date}-${index}`} t={t} />
        </section>
        <section className="card table-card">
          <CardHeading title={t('myStudents')} subtitle={t('mystudentsDescription')}>
            <Link className="link-button" to="/mystudents">{t('viewAll')}</Link>
          </CardHeading>
          <StudentTable students={data.students} t={t} />
        </section>
        <section className="card attendance-card">
          <CardHeading title={t('attendanceOverview')} subtitle={t('classAttendanceSub')}>
            <span className="trend positive">↑ 2.4%</span>
          </CardHeading>
          <div className="attendance-value">{data.attendanceAverage} <small>{t('average')}</small></div>
          <AttendanceChart data={data.attendance} t={t} />
        </section>
      </div>
      <section className="card performance-card dashboard-wide-card">
        <CardHeading title={t('academicPerformance')} subtitle={t('performanceSub')} />
        <PerformanceChart data={data.performance} t={t} />
      </section>
      <NotificationsCard notifications={data.notifications} t={t} />
    </>
  )
}

function StudentOverview({ data, t }) {
  const resultColumns = [{ key: 'name', label: 'fullName' }, { key: 'class' }, { key: 'amount', label: 'score' }, { key: 'grade' }, { key: 'status' }]
  const paymentColumns = [{ key: 'name', label: 'fullName' }, { key: 'amount' }, { key: 'date' }, { key: 'status' }]
  const scheduleColumns = [{ key: 'date' }, { key: 'name', label: 'subject' }, { key: 'class' }, { key: 'status' }]
  return (
    <>
      <div className="dashboard-grid role-dashboard-grid">
        <section className="card table-card">
          <CardHeading title={t('myresults')} subtitle={t('gradesDescription')}>
            <Link className="link-button" to="/grades">{t('viewAll')}</Link>
          </CardHeading>
          <DataTable rows={data.grades} columns={resultColumns} rowId={(row) => row.result_id || row.record_id} t={t} />
        </section>
        <section className="card table-card">
          <CardHeading title={t('payment')} subtitle={t('paymentsDescription')}>
            <Link className="link-button" to="/payments">{t('viewAll')}</Link>
          </CardHeading>
          <DataTable rows={data.payments} columns={paymentColumns} rowId={(row) => row.payment_id} t={t} />
        </section>
        <section className="card table-card">
          <CardHeading title={t('myschedule')} subtitle={t('myscheduleDescription')}>
            <Link className="link-button" to="/myschedule">{t('viewAll')}</Link>
          </CardHeading>
          <DataTable rows={data.schedule} columns={scheduleColumns} rowId={(row, index) => `${row.date}-${index}`} t={t} />
        </section>
        <section className="card attendance-card">
          <CardHeading title={t('attendanceOverview')} subtitle={t('myAttendanceSub')}>
            <span className="trend positive">↑ 2.4%</span>
          </CardHeading>
          <div className="attendance-value">{data.attendanceAverage} <small>{t('average')}</small></div>
          <AttendanceChart data={data.attendance} t={t} />
        </section>
      </div>
      <NotificationsCard notifications={data.notifications} t={t} />
    </>
  )
}

function RecentActivity({ activities, t }) {
  return (
    <section className="card activity-card">
      <CardHeading title={t('recentActivity')} subtitle={t('latestUpdates')}>
        <Link className="link-button" to="/notifications">{t('viewAll')}</Link>
      </CardHeading>
      <div className="activity-list">
        {activities.map(({ type, title, description, time }, index) => (
          <div className="activity-row" key={title}>
            <div className={`activity-icon ${type}`}>
              {index === 0 ? <GraduationCap size={16} /> : index === 1 ? <CreditCard size={15} /> : <ClipboardList size={15} />}
            </div>
            <div className="activity-text"><b>{t(title)}</b><small>{t(description)}</small></div>
            <time>{t(time)}</time>
          </div>
        ))}
      </div>
    </section>
  )
}

function NotificationsCard({ notifications = [], t }) {
  return (
    <section className="card notifications-card dashboard-wide-card">
      <CardHeading title={t('recentNotifications')} subtitle={t('notificationSub')}>
        <Link className="link-button" to="/notifications">{t('viewAll')}</Link>
      </CardHeading>
      <div className="activity-list">
        {notifications.map((item) => (
          <div className="activity-row" key={item.notification_id || item.title}>
            <div className="activity-icon exam"><Bell size={15} /></div>
            <div className="activity-text"><b>{item.title}</b><small>{item.message}</small></div>
            <time>{item.date}</time>
          </div>
        ))}
      </div>
    </section>
  )
}

function StudentTable({ students, t }) {
  const columns = [{ key: 'name', label: 'fullName' }, { key: 'student_id' }, { key: 'class' }, { key: 'status' }]
  return <DataTable rows={students.slice(0, 5)} columns={columns} rowId={(row) => row.student_id} t={t} />
}

function ExamList({ exams, t }) {
  return (
    <div className="dashboard-exam-list">
      {exams.map((exam) => (
        <div className="exam-row" key={`${exam.month}-${exam.day}-${exam.name}`}>
          <div className="exam-date"><small>{t(exam.month)}</small><b>{exam.day}</b></div>
          <div><b>{exam.name}</b><small>{t(exam.description)}</small></div>
        </div>
      ))}
    </div>
  )
}
