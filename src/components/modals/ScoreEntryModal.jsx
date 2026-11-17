import { useState } from 'react'
import { X } from 'lucide-react'
import { classifyScore } from '../../utils/grades.js'
import StatusPill from '../ui/StatusPill.jsx'

export default function ScoreEntryModal({ students, exam, initialRows = [], onSave, onClose, t, saving }) {
  const total = Number(exam?.totalMarks) || 100
  const [scores, setScores] = useState(() => {
    const seed = {}
    students.forEach((student) => {
      const existing = initialRows.find((row) => row.student_id === student.student_id && (!exam?.subject || row.subject === exam.subject))
      seed[student.student_id] = existing?.score ?? ''
    })
    return seed
  })

  const results = students.map((student) => {
    const score = scores[student.student_id]
    return { student, score, ...classifyScore(score === '' ? 0 : score, total) }
  })

  const submit = (event) => {
    event.preventDefault()
    const records = results
      .filter((row) => row.score !== '')
      .map(({ student, score, grade, status }) => ({
        student_id: student.student_id,
        name: student.name,
        class: student.class,
        subject: exam?.subject || '',
        examName: exam?.name || '',
        exam_id: exam?.exam_id || '',
        score: Number(score),
        totalMarks: total,
        amount: `${score} / ${total}`,
        grade,
        status,
        resultStatus: 'Published',
      }))
    onSave(records)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal modal-wide" onClick={(event) => event.stopPropagation()} onSubmit={submit}>
        <div className="modal-head">
          <div><h2>{t('scoreEntry')}</h2><p>{t('scoreEntryDescription')}</p></div>
          <button type="button" className="icon-btn" aria-label={t('close')} onClick={onClose}><X size={18} /></button>
        </div>
        <div className="score-meta">
          <span><b>{t('examName')}</b> {exam?.name || '—'}</span>
          <span><b>{t('subject')}</b> {exam?.subject || '—'}</span>
          <span><b>{t('class')}</b> {exam?.class || students[0]?.class || '—'}</span>
          <span><b>{t('totalMarks')}</b> {total}</span>
        </div>
        <div className="modal-body-scroll">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t('studentName')}</th>
                  <th>{t('score')}</th>
                  <th>{t('averageScore')}</th>
                  <th>{t('gradeClassification')}</th>
                  <th>{t('passFail')}</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const result = results.find((row) => row.student.student_id === student.student_id)
                  return (
                    <tr key={student.student_id}>
                      <td>{student.name}</td>
                      <td>
                        <input
                          className="score-input"
                          type="number"
                          min="0"
                          max={total}
                          value={scores[student.student_id]}
                          onChange={(event) => setScores((current) => ({ ...current, [student.student_id]: event.target.value }))}
                          aria-label={`${t('score')} ${student.name}`}
                        />
                      </td>
                      <td>{result.score === '' ? '—' : `${result.percentage}%`}</td>
                      <td><span className="grade-chip">{result.score === '' ? '—' : result.grade}</span></td>
                      <td>{result.score === '' ? '—' : <StatusPill value={result.status} t={t} />}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onClose}>{t('cancel')}</button>
          <button type="submit" className="button primary" disabled={saving || !students.length}>{saving ? t('loading') : t('save')}</button>
        </div>
      </form>
    </div>
  )
}
