import { useEffect, useMemo, useState } from 'react'
import { Check, ClipboardCheck, Printer, Users } from 'lucide-react'
import PageHeader from '../components/common/PageHeader.jsx'
import DataTable from '../components/common/DataTable.jsx'
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import { useResource } from '../hooks/useResource.js'
import { useToast } from '../hooks/useToast.js'
import { dataService } from '../services/dataService.js'

function getLocalDate() {
  const now = new Date()
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-')
}

export default function AttendancePage({ role, t }) {
  const toast = useToast()
  const classesResource = useResource(role === 'student' ? 'myclasses' : role === 'teacher' ? 'myclasses' : 'classes', role)
  const rosterResource = useResource('students', role)
  const attendance = useResource('attendance', role)
  const classes = classesResource.rows
  const roster = rosterResource.rows
  const classOptions = classes.map((row) => ({ id: row.class_id, name: row.name }))
  const [classId, setClassId] = useState(classOptions[0]?.id || '')
  const [date, setDate] = useState(getLocalDate)
  const [marked, setMarked] = useState({})
  const [saving, setSaving] = useState(false)

  const className = classOptions.find((option) => option.id === classId)?.name || ''
  const students = roster.filter((row) => row.class === className)

  useEffect(() => {
    if (!classId && classOptions[0]) setClassId(classOptions[0].id)
  }, [classId, classOptions])

  useEffect(() => {
    setMarked(readMarked(attendance.rows, students, date))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, date, attendance.rows, rosterResource.rows])

  const counts = useMemo(() => students.reduce((result, student) => {
    const status = marked[student.student_id] || 'Present'
    result[status] = (result[status] || 0) + 1
    return result
  }, {}), [students, marked])

  const history = attendance.rows.filter((row) => row.class === className).slice(0, 8)

  const save = async () => {
    setSaving(true)
    try {
      const allRecords = await dataService.list('attendance', 'admin')
      const idByStudent = new Map(allRecords.filter((row) => row.date === date && row.class === className).map((row) => [row.student_id, row.attendance_id]))
      const kept = allRecords.filter((row) => !(row.date === date && row.class === className && students.some((student) => student.student_id === row.student_id)))
      const records = students.map((student) => ({
        attendance_id: idByStudent.get(student.student_id) || `ATT-${date}-${student.student_id}`,
        student_id: student.student_id,
        name: student.name,
        class_id: classId,
        class: className,
        date,
        status: marked[student.student_id] || 'Present',
      }))
      // Keep other classes' records when the role view is scoped.
      await attendance.saveAll([...records, ...kept])
      toast.success(t('attendanceSaved'))
    } catch {
      toast.error(t('attendanceSaveError'))
    } finally {
      setSaving(false)
    }
  }

  const setAll = (status) => setMarked(Object.fromEntries(students.map((student) => [student.student_id, status])))
  const updateStatus = (studentId, status) => setMarked((current) => ({ ...current, [studentId]: status }))

  const columns = [
    { key: 'student_id' },
    { key: 'name', label: 'fullName' },
    { key: 'class' },
    {
      key: 'status',
      render: (status, student) => (role === 'student'
        ? status
        : (
          <select aria-label={`${t('attendanceStatus')} ${student.name}`} value={status} onChange={(event) => updateStatus(student.student_id, event.target.value)}>
            {['Present', 'Absent', 'Late', 'Permission'].map((value) => <option key={value} value={value}>{t(value)}</option>)}
          </select>
        )),
    },
  ]

  if (classesResource.loading || rosterResource.loading || attendance.loading) {
    return <><PageHeader eyebrow={`${t('workspace')} / ${t('attendance')}`} title={t('attendance')} description={t('attendanceDescription')} /><LoadingSkeleton rows={6} columns={4} /></>
  }
  if (classesResource.error || rosterResource.error || attendance.error) {
    return <ErrorState t={t} onRetry={() => { classesResource.reload(); rosterResource.reload(); attendance.reload() }} />
  }

  return (
    <>
      <PageHeader
        eyebrow={`${t('workspace')} / ${t('attendance')}`}
        title={t('attendance')}
        description={t('attendanceDescription')}
        action={
          <div className="header-actions">
            <button className="button secondary export-btn" onClick={() => window.print()}><Printer size={16} />{t('print')}</button>
            {role !== 'student' && <button className="button primary" onClick={save} disabled={!classId || !students.length || saving}><Check size={16} />{saving ? t('loading') : t('saveAttendance')}</button>}
          </div>
        }
      />

      <section className="attendance-controls card">
        <label>{t('class')}<select value={classId} onChange={(event) => setClassId(event.target.value)}><option value="">{t('selectClass')}</option>{classOptions.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</select></label>
        <label>{t('date')}<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <div className="attendance-count"><Users size={16} /><span><b>{students.length}</b><small>{t('students')}</small></span></div>
      </section>

      <div className="attendance-summary">
        {[['Present', counts.Present || 0, 'present'], ['Absent', counts.Absent || 0, 'absent'], ['Late', counts.Late || 0, 'late'], ['Permission', counts.Permission || 0, 'permission']].map(([status, count, tone]) => (
          <div className={`attendance-stat ${tone}`} key={status}><span>{t(status)}</span><b>{count}</b></div>
        ))}
      </div>

      <section className="card attendance-list">
        <div className="attendance-list-head">
          <div><b>{className || t('class')}</b><small>{t('attendanceRoster')}</small></div>
          {role !== 'student' && (
            <div className="quick-mark">
              <button className="button secondary" disabled={!students.length} onClick={() => setAll('Present')}>{t('markAllPresent')}</button>
              <button className="button secondary" disabled={!students.length} onClick={() => setAll('Absent')}>{t('markAllAbsent')}</button>
            </div>
          )}
        </div>
        {students.length
          ? <DataTable rows={students.map((student) => ({ ...student, status: marked[student.student_id] || 'Present' }))} columns={columns} rowId={(student) => student.student_id} t={t} />
          : <div className="empty-state"><ClipboardCheck size={22} /><b>{t('noStudentsForClass')}</b><span>{t('selectDifferentClass')}</span></div>}
      </section>

      <section className="card attendance-history">
        <div className="card-heading"><div><h3>{t('attendanceHistory')}</h3><p>{className}</p></div></div>
        <DataTable rows={history} columns={[{ key: 'date' }, { key: 'name', label: 'fullName' }, { key: 'class' }, { key: 'status' }]} rowId={(row) => row.attendance_id} t={t} emptyTitle={t('noAttendanceHistory')} emptyDescription={t('selectDifferentClass')} />
      </section>
    </>
  )
}

function readMarked(records, students, date) {
  return Object.fromEntries(students.map((student) => [
    student.student_id,
    records.find((record) => record.student_id === student.student_id && record.date === date)?.status || 'Present',
  ]))
}
