import { useMemo, useState } from 'react'
import { ClipboardList, Plus } from 'lucide-react'
import PageHeader from '../components/common/PageHeader.jsx'
import DataTable from '../components/common/DataTable.jsx'
import Pagination from '../components/common/Pagination.jsx'
import SearchInput from '../components/common/SearchInput.jsx'
import FilterDropdown from '../components/common/FilterDropdown.jsx'
import ConfirmDialog from '../components/common/ConfirmDialog.jsx'
import FormModal from '../components/modals/FormModal.jsx'
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import DetailsModal from '../components/modals/DetailsModal.jsx'
import { useResource } from '../hooks/useResource.js'
import { useToast } from '../hooks/useToast.js'
import { dataService } from '../services/dataService.js'

const PAGE_SIZE = 8

export default function RoomAssignmentsPage({ role, t }) {
  const isAdmin = role === 'admin'
  const toast = useToast()
  const assignments = useResource('room-assignments', role)
  const rooms = useResource('rooms', role)
  const floors = useResource('floors', role)
  const buildings = useResource('buildings', role)
  const classes = useResource('classes', role)
  const years = useResource('academicyears', role)
  const [query, setQuery] = useState('')
  const [buildingFilter, setBuildingFilter] = useState('')
  const [roomFilter, setRoomFilter] = useState('')
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [values, setValues] = useState(emptyForm())

  const buildingMap = useMemo(() => Object.fromEntries(buildings.rows.map((b) => [b.building_id, b])), [buildings.rows])
  const floorMap = useMemo(() => Object.fromEntries(floors.rows.map((f) => [f.floor_id, f])), [floors.rows])
  const roomMap = useMemo(() => Object.fromEntries(rooms.rows.map((r) => [r.room_id, r])), [rooms.rows])
  const classMap = useMemo(() => Object.fromEntries(classes.rows.map((c) => [c.class_id, c])), [classes.rows])
  const yearMap = useMemo(() => Object.fromEntries(years.rows.map((y) => [y.academic_year_id, y])), [years.rows])

  const rows = useMemo(() => assignments.rows.map((row) => enrich(row, buildingMap, floorMap, roomMap, classMap, yearMap)), [assignments.rows, buildingMap, floorMap, roomMap, classMap, yearMap])
  const filtered = rows.filter((row) => {
    const needle = query.trim().toLowerCase()
    const text = `${row.className || ''} ${row.roomName || ''} ${row.buildingName || ''} ${row.floorName || ''} ${row.academicYear || ''}`.toLowerCase()
    return (!needle || text.includes(needle)) && (!buildingFilter || row.building_id === buildingFilter) && (!roomFilter || row.room_id === roomFilter)
  })
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const roomOptionsForFilter = buildingFilter ? rooms.rows.filter((r) => r.building_id === buildingFilter) : rooms.rows
  const formFloors = values.building_id ? floors.rows.filter((f) => f.building_id === values.building_id) : []
  const formRooms = values.floor_id ? rooms.rows.filter((r) => r.floor_id === values.floor_id) : (values.building_id ? rooms.rows.filter((r) => r.building_id === values.building_id) : [])

  const openCreate = () => { setEditing(null); setValues(emptyForm()); setCreating(true) }
  const openEdit = (row) => { setEditing(row); setValues({ ...emptyForm(), ...row }); setCreating(true) }
  const closeForm = () => { if (!saving) { setCreating(false); setEditing(null) } }

  const save = async (event) => {
    event.preventDefault()
    const payload = normalize(values, buildingMap, floorMap, roomMap, classMap, yearMap)
    if (!payload.class_id || !payload.building_id || !payload.floor_id || !payload.room_id || !payload.academic_year_id || !payload.start_date) {
      toast.error(t('saveError')); return
    }
    if (floorMap[payload.floor_id]?.building_id !== payload.building_id) { toast.error(t('invalidFloorForBuilding')); return }
    if (roomMap[payload.room_id]?.floor_id !== payload.floor_id || roomMap[payload.room_id]?.building_id !== payload.building_id) { toast.error(t('invalidFloorForBuilding')); return }
    const all = await dataService.list('room-assignments', 'admin')
    const conflict = all.some((row) => row.room_id === payload.room_id && assignments.idOf(row) !== assignments.idOf(editing) && rangesOverlap(row.start_date, row.end_date, payload.start_date, payload.end_date))
    if (conflict) { toast.error(t('conflictingAssignment')); return }
    setSaving(true)
    try {
      if (editing) await assignments.update(assignments.idOf(editing), payload)
      else await assignments.create(payload)
      toast.success(t(editing ? 'assignmentUpdated' : 'assignmentSaved'))
      closeForm()
    } catch {
      toast.error(t('assignmentSaveError'))
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setSaving(true)
    try {
      await assignments.remove(assignments.idOf(deleting))
      toast.success(t('assignmentDeleted'))
      setDeleting(null)
      setPage((current) => Math.min(current, Math.max(1, Math.ceil((filtered.length - 1) / PAGE_SIZE))))
    } catch {
      toast.error(t('assignmentDeleteError'))
    } finally {
      setSaving(false)
    }
  }

  const loading = assignments.loading || rooms.loading || floors.loading || buildings.loading || classes.loading || years.loading
  const error = assignments.error || rooms.error || floors.error || buildings.error || classes.error || years.error

  return (
    <>
      <PageHeader eyebrow={`${t('workspace')} / ${t('schoolBuildings')}`} title={t('room-assignments')} description={t('room-assignmentsDescription')} action={isAdmin ? <button className="button primary" onClick={openCreate}><Plus size={17} />{t('assignClassroom')}</button> : null} />
      {loading ? <><LoadingSkeleton variant="cards" count={3} /><LoadingSkeleton rows={7} columns={7} /></> : null}
      {!loading && error ? <ErrorState t={t} onRetry={() => { assignments.reload(); rooms.reload(); floors.reload(); buildings.reload(); classes.reload(); years.reload() }} /> : null}
      {!loading && !error ? (
        <section className="card list-card">
          <div className="list-toolbar">
            <SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1) }} placeholder={`${t('search')} ${t('room-assignments').toLowerCase()}…`} label={t('search')} />
            <FilterDropdown label={t('allBuildings')} value={buildingFilter} onChange={(value) => { setBuildingFilter(value); setRoomFilter(''); setPage(1) }} options={buildings.rows.map((b) => ({ value: b.building_id, label: b.name }))} />
            <FilterDropdown label={t('allRooms') || t('rooms')} value={roomFilter} onChange={(value) => { setRoomFilter(value); setPage(1) }} options={roomOptionsForFilter.map((r) => ({ value: r.room_id, label: r.name }))} />
          </div>
          <DataTable
            rows={pageRows}
            columns={[
              { key: 'className', label: 'className' },
              { key: 'buildingName', label: 'building' },
              { key: 'floorName', label: 'floor' },
              { key: 'roomName', label: 'assignedRoom' },
              { key: 'academicYear', label: 'academicYear' },
              { key: 'start_date', label: 'start_date' },
              { key: 'end_date', label: 'end_date' },
            ]}
            rowId={assignments.idOf}
            onView={setViewing}
            onEdit={isAdmin ? openEdit : undefined}
            onDelete={isAdmin ? setDeleting : undefined}
            t={t}
            emptyTitle={t('noAssignments')}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} t={t} />
        </section>
      ) : null}

      {creating ? (
        <FormModal title={`${editing ? t('changeAssignment') : t('assignClassroom')}`} description={t('formDescription')} onClose={closeForm} onSubmit={save} saving={saving} submitLabel={{ save: t('save'), saving: t('loading'), cancel: t('cancel') }} wide>
          <div className="form-grid">
            <label>{t('class')}<select value={values.class_id} onChange={(e) => setValues((c) => ({ ...c, class_id: e.target.value }))} required><option value="">{t('selectClass')}</option>{classes.rows.map((c) => <option key={c.class_id} value={c.class_id}>{c.name}</option>)}</select></label>
            <label>{t('academicYear')}<select value={values.academic_year_id} onChange={(e) => setValues((c) => ({ ...c, academic_year_id: e.target.value }))} required><option value="">{t('academicYear')}</option>{years.rows.map((y) => <option key={y.academic_year_id} value={y.academic_year_id}>{y.name}</option>)}</select></label>
            <label>{t('building')}<select value={values.building_id} onChange={(e) => setValues((c) => ({ ...c, building_id: e.target.value, floor_id: '', room_id: '' }))} required><option value="">{t('selectBuilding')}</option>{buildings.rows.map((b) => <option key={b.building_id} value={b.building_id}>{b.name}</option>)}</select></label>
            <label>{t('floor')}<select value={values.floor_id} onChange={(e) => setValues((c) => ({ ...c, floor_id: e.target.value, room_id: '' }))} required disabled={!values.building_id}><option value="">{values.building_id ? t('selectFloor') : t('selectBuildingFirst')}</option>{formFloors.map((f) => <option key={f.floor_id} value={f.floor_id}>{f.name}</option>)}</select></label>
            <label>{t('selectRoom')}<select value={values.room_id} onChange={(e) => setValues((c) => ({ ...c, room_id: e.target.value }))} required disabled={!values.floor_id}><option value="">{values.floor_id ? t('selectRoom') : t('selectFloorFirst')}</option>{formRooms.map((r) => <option key={r.room_id} value={r.room_id}>{r.name} ({r.code})</option>)}</select></label>
            <label>{t('start_date')}<input type="date" value={values.start_date} onChange={(e) => setValues((c) => ({ ...c, start_date: e.target.value }))} required /></label>
            <label>{t('end_date')}<input type="date" value={values.end_date || ''} onChange={(e) => setValues((c) => ({ ...c, end_date: e.target.value }))} /></label>
          </div>
          {values.room_id ? <p className="form-note">{t('usedBy')}: {currentUsers(rows, values.room_id, assignments.idOf(editing)).join(', ') || '—'}</p> : null}
        </FormModal>
      ) : null}

      {viewing ? <DetailsModal title={viewing.className} subtitle={`${t('room-assignments')} · ${assignments.idOf(viewing) || ''}`} sections={[{ title: t('details'), fields: [{ label: t('className'), value: viewing.className }, { label: t('building'), value: viewing.buildingName }, { label: t('floor'), value: viewing.floorName }, { label: t('assignedRoom'), value: viewing.roomName }, { label: t('academicYear'), value: viewing.academicYear }, { label: t('start_date'), value: viewing.start_date }, { label: t('end_date'), value: viewing.end_date || '—' }] }]} onClose={() => setViewing(null)} t={t} /> : null}
      {deleting ? <ConfirmDialog title={t('confirmDelete')} description={t('confirmDeleteDescription')} confirmLabel={t('delete')} cancelLabel={t('cancel')} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} /> : null}
    </>
  )
}

function emptyForm() { return { class_id: '', building_id: '', floor_id: '', room_id: '', academic_year_id: '', start_date: '', end_date: '' } }
function normalize(values, buildingMap, floorMap, roomMap, classMap, yearMap) {
  return {
    class_id: values.class_id,
    className: classMap[values.class_id]?.name || '',
    building_id: values.building_id,
    buildingName: buildingMap[values.building_id]?.name || '',
    floor_id: values.floor_id,
    floorName: floorMap[values.floor_id]?.name || '',
    room_id: values.room_id,
    roomName: roomMap[values.room_id]?.name || '',
    academic_year_id: values.academic_year_id,
    academicYear: yearMap[values.academic_year_id]?.name || '',
    start_date: values.start_date,
    end_date: values.end_date || '',
  }
}
function enrich(row, buildingMap, floorMap, roomMap, classMap, yearMap) {
  return {
    ...row,
    className: row.className || classMap[row.class_id]?.name || '—',
    buildingName: row.buildingName || buildingMap[row.building_id]?.name || '—',
    floorName: row.floorName || floorMap[row.floor_id]?.name || '—',
    roomName: row.roomName || roomMap[row.room_id]?.name || '—',
    academicYear: row.academicYear || yearMap[row.academic_year_id]?.name || '—',
  }
}
function rangesOverlap(startA, endA, startB, endB) {
  const aStart = new Date(startA).getTime()
  const aEnd = new Date(endA || '9999-12-31').getTime()
  const bStart = new Date(startB).getTime()
  const bEnd = new Date(endB || '9999-12-31').getTime()
  return aStart <= bEnd && bStart <= aEnd
}
function currentUsers(rows, roomId, editingId) {
  const today = new Date().toISOString().slice(0, 10)
  return rows.filter((row) => row.room_id === roomId && row.assignment_id !== editingId && rangesOverlap(row.start_date, row.end_date, today, today)).map((row) => row.className).filter(Boolean)
}
