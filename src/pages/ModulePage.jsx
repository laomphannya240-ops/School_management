import { useEffect, useMemo, useState } from 'react'
import { Plus, Printer, SquarePen } from 'lucide-react'
import { useForm } from 'react-hook-form'
import PageHeader from '../components/common/PageHeader.jsx'
import DataTable from '../components/common/DataTable.jsx'
import Pagination from '../components/common/Pagination.jsx'
import ConfirmDialog from '../components/common/ConfirmDialog.jsx'
import SearchInput from '../components/common/SearchInput.jsx'
import FilterDropdown from '../components/common/FilterDropdown.jsx'
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import FormModal from '../components/modals/FormModal.jsx'
import DetailsModal from '../components/modals/DetailsModal.jsx'
import ScoreEntryModal from '../components/modals/ScoreEntryModal.jsx'
import ModuleFormFields from '../components/forms/ModuleFormFields.jsx'
import { moduleSchemas } from '../constants/moduleSchemas.js'
import { useResource } from '../hooks/useResource.js'
import { useToast } from '../hooks/useToast.js'
import { dataService } from '../services/dataService.js'
import { buildDetailSections } from '../utils/details.js'

const PAGE_SIZE = 6
const ADMIN_MODULES = new Set([
  'students', 'teachers', 'classes', 'subjects', 'academicyears', 'exams', 'grades',
  'payments', 'notifications', 'schedules', 'users', 'settings', 'reports',
])

function normalizeValues(module, values) {
  if (module === 'students') return { ...values, nameKh: values.fullNameKh || values.nameKh || '' }
  if (module === 'teachers') return { ...values, subject: values.subjectAssignments || values.specialization || '', class: values.classAssignments || '' }
  if (module === 'classes') return { ...values, teacherName: values.homeroomTeacher || '' }
  if (module === 'grades') return { ...values, name: values.studentName || values.name, amount: `${values.score ?? ''} / ${values.totalMarks ?? ''}` }
  return values
}

function columnLabel(key, t, module) {
  if (key === 'name' || key === 'nameKh') return t('fullName')
  if (key === 'amount') return module === 'grades' ? t('score') : t('amount')
  return t(key) || key
}

export default function ModulePage({ module, role, t }) {
  const toast = useToast()
  const { rows, loading, error, reload, create, update, remove, idOf } = useResource(module, role || 'admin')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [scoreModal, setScoreModal] = useState(false)
  const [scoreExam, setScoreExam] = useState('')
  const [examOptions, setExamOptions] = useState([])
  const [scoreRoster, setScoreRoster] = useState([])
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const schema = moduleSchemas[module] || { columns: Object.keys(rows[0] || {}), fields: [] }
  const columns = schema.columns.map((key) => ({ key, label: columnLabel(key, t, module) }))
  const statuses = [...new Set(rows.map((row) => row.status).filter(Boolean))]
  const classes = [...new Set(rows.map((row) => row.class).filter(Boolean))]
  const genders = [...new Set(rows.map((row) => row.gender).filter(Boolean))]
  const hasStatus = statuses.length > 0
  const hasClass = classes.length > 0 && ['students', 'mystudents', 'teachers', 'classes', 'grades', 'exams', 'attendance', 'schedules', 'myschedule'].includes(module)
  const hasGender = genders.length > 0 && ['students', 'mystudents'].includes(module)

  const canCreate = role === 'admin' && ADMIN_MODULES.has(module)
  const canManage = canCreate || module === 'profile'
  const canEnterScores = module === 'grades' && ['admin', 'teacher'].includes(role)

  useEffect(() => {
    if (!canEnterScores) return undefined
    let active = true
    Promise.all([dataService.list('exams', role), dataService.list('students', role)])
      .then(([exams, students]) => {
        if (active) {
          setExamOptions(Array.isArray(exams) ? exams : [])
          setScoreRoster(Array.isArray(students) ? students : [])
        }
      })
      .catch(() => {
        if (active) {
          setExamOptions([])
          setScoreRoster([])
        }
      })
    return () => { active = false }
  }, [canEnterScores, role])

  const exams = useMemo(() => (canEnterScores ? examOptions : []), [canEnterScores, examOptions])
  const selectedExam = useMemo(() => exams.find((item) => item.exam_id === scoreExam) || exams[0] || null, [exams, scoreExam])
  const scoreStudents = useMemo(() => {
    if (!canEnterScores) return []
    return selectedExam?.class ? scoreRoster.filter((student) => student.class === selectedExam.class) : scoreRoster
  }, [canEnterScores, selectedExam, scoreRoster])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      const matchesQuery = !needle || Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(needle))
      const matchesStatus = !statusFilter || row.status === statusFilter
      const matchesClass = !classFilter || row.class === classFilter
      const matchesGender = !genderFilter || row.gender === genderFilter
      return matchesQuery && matchesStatus && matchesClass && matchesGender
    })
  }, [rows, query, statusFilter, classFilter, genderFilter])

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const resetPage = (setter) => (value) => { setter(value); setPage(1) }

  const openAdd = () => { setEditing(null); reset({}); setModal(true) }
  const openEdit = (row) => { setEditing(row); reset(row); setModal(true) }

  const save = async (formValues) => {
    setSaving(true)
    try {
      const values = normalizeValues(module, formValues)
      if (editing) await update(idOf(editing), values)
      else await create({ ...values, status: values.status || 'Active' })
      toast.success(t(editing ? 'updatedSuccessfully' : 'createdSuccessfully'))
      setModal(false)
    } catch {
      toast.error(t('saveError'))
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setSaving(true)
    try {
      await remove(idOf(deleting))
      const remaining = Math.max(1, Math.ceil((filtered.length - 1) / PAGE_SIZE))
      setPage((current) => Math.min(current, remaining))
      toast.success(t('deletedSuccessfully'))
      setDeleting(null)
    } catch {
      toast.error(t('deleteError'))
    } finally {
      setSaving(false)
    }
  }

  const saveScores = async (records) => {
    setSaving(true)
    try {
      for (const record of records) {
        const existing = rows.find((row) => row.student_id === record.student_id && row.subject === record.subject)
        if (existing) await update(idOf(existing), record)
        else await create({ ...record, status: 'Published' })
      }
      toast.success(t('scoresSaved'))
      setScoreModal(false)
    } catch {
      toast.error(t('saveError'))
    } finally {
      setSaving(false)
    }
  }

  const exportRecords = () => window.print()

  return (
    <>
      <PageHeader
        eyebrow={`${t('workspace')} / ${t(module)}`}
        title={t(module)}
        description={t(`${module}Description`)}
        action={(
          <div className="header-actions">
            {canEnterScores && <button className="button secondary" onClick={() => setScoreModal(true)}><SquarePen size={16} />{t('inputScores')}</button>}
            <button className="button secondary export-btn" onClick={exportRecords}><Printer size={16} />{t('print')}</button>
            {canCreate && <button className="button primary" onClick={openAdd}><Plus size={17} />{t('add')} {t(module).replace(/s$/, '')}</button>}
          </div>
        )}
      />

      {loading && <><LoadingSkeleton variant="cards" count={4} /><LoadingSkeleton rows={6} columns={columns.length} /></>}
      {!loading && error && <ErrorState t={t} onRetry={reload} />}
      {!loading && !error && (
        <section className="card list-card">
          <div className="list-toolbar">
            <SearchInput value={query} onChange={resetPage(setQuery)} placeholder={`${t('search')} ${t(module).toLowerCase()}…`} label={t('search')} />
            {canEnterScores && exams.length > 0 && (
              <select className="filter-select compact-filter" aria-label={t('examName')} value={selectedExam?.exam_id || ''} onChange={(event) => setScoreExam(event.target.value)}>
                {exams.map((exam) => <option key={exam.exam_id} value={exam.exam_id}>{exam.name}</option>)}
              </select>
            )}
            {hasClass && <FilterDropdown label={t('allClasses')} value={classFilter} onChange={resetPage(setClassFilter)} options={classes.map((value) => ({ value, label: value }))} icon={null} />}
            {hasGender && <FilterDropdown label={t('allGenders')} value={genderFilter} onChange={resetPage(setGenderFilter)} options={genders.map((value) => ({ value, label: t(value) || value }))} icon={null} />}
            {hasStatus && <FilterDropdown label={t('allStatuses')} value={statusFilter} onChange={resetPage(setStatusFilter)} options={statuses.map((value) => ({ value, label: t(value) || value }))} icon={null} />}
          </div>
          <DataTable
            rows={pageRows}
            columns={columns}
            rowId={(row) => idOf(row)}
            onView={setViewing}
            onEdit={canManage ? openEdit : undefined}
            onDelete={canCreate ? setDeleting : undefined}
            t={t}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} t={t} />
        </section>
      )}

      {modal && (
        <FormModal
          title={`${editing ? t('edit') : t('add')} ${t(module).replace(/s$/, '')}`}
          description={t('formDescription')}
          onClose={() => setModal(false)}
          onSubmit={handleSubmit(save)}
          saving={saving}
          submitLabel={{ save: t('save'), saving: t('loading'), cancel: t('cancel') }}
        >
          <ModuleFormFields fields={schema.fields} register={register} errors={errors} t={t} editing={editing} />
        </FormModal>
      )}

      {viewing && (
        <DetailsModal
          title={viewing.name || viewing.title || t('details')}
          subtitle={`${t(module)} · ${idOf(viewing) || ''}`}
          sections={buildDetailSections(module, viewing, t)}
          onClose={() => setViewing(null)}
          t={t}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={t('confirmDelete')}
          description={t('confirmDeleteDescription')}
          confirmLabel={t('delete')}
          cancelLabel={t('cancel')}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}

      {scoreModal && (
        <ScoreEntryModal
          students={scoreStudents}
          exam={selectedExam}
          initialRows={rows}
          onSave={saveScores}
          onClose={() => setScoreModal(false)}
          t={t}
          saving={saving}
        />
      )}
    </>
  )
}
