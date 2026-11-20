import { useMemo, useState } from 'react'
import { DoorOpen, Plus } from 'lucide-react'
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
const ROOM_TYPES = ['Classroom', 'Computer Lab', 'Science Lab', 'Library', 'Office', 'Meeting Room']
const ROOM_STATUSES = ['Available', 'Occupied', 'Maintenance']

export default function RoomsPage({ role, t }) {
  const isAdmin = role === 'admin'
  const toast = useToast()
  const rooms = useResource('rooms', role)
  const floors = useResource('floors', role)
  const buildings = useResource('buildings', role)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [buildingFilter, setBuildingFilter] = useState('')
  const [floorFilter, setFloorFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [values, setValues] = useState(emptyForm())

  const buildingMap = useMemo(() => Object.fromEntries(buildings.rows.map((b) => [b.building_id, b])), [buildings.rows])
  const floorMap = useMemo(() => Object.fromEntries(floors.rows.map((f) => [f.floor_id, f])), [floors.rows])
  const rows = useMemo(() => rooms.rows.map((row) => ({
    ...row,
    buildingName: row.buildingName || buildingMap[row.building_id]?.name || '—',
    floorName: row.floorName || floorMap[row.floor_id]?.name || '—',
    currentUsage: row.currentUsage ?? 0,
  })), [rooms.rows, buildingMap, floorMap])

  const floorOptionsForFilter = buildingFilter ? floors.rows.filter((f) => f.building_id === buildingFilter) : floors.rows
  const filtered = rows.filter((row) => {
    const needle = query.trim().toLowerCase()
    const text = `${row.name || ''} ${row.code || ''} ${row.buildingName || ''} ${row.floorName || ''} ${row.room_type || ''}`.toLowerCase()
    return (!needle || text.includes(needle))
      && (!status || row.status === status)
      && (!buildingFilter || row.building_id === buildingFilter)
      && (!floorFilter || row.floor_id === floorFilter)
      && (!typeFilter || row.room_type === typeFilter)
  })
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openCreate = () => { setEditing(null); setValues({ ...emptyForm(), building_id: buildingFilter || '' }); setCreating(true) }
  const openEdit = (row) => { setEditing(row); setValues({ ...emptyForm(), ...row, capacity: String(row.capacity ?? ''), currentUsage: String(row.currentUsage ?? 0) }); setCreating(true) }
  const closeForm = () => { if (!saving) { setCreating(false); setEditing(null) } }

  const formFloors = values.building_id ? floors.rows.filter((f) => f.building_id === values.building_id) : []

  const save = async (event) => {
    event.preventDefault()
    const payload = normalize(values, buildingMap, floorMap)
    if (!payload.name || !payload.code || !payload.building_id || !payload.floor_id || !payload.room_type || !payload.status) { toast.error(t('saveError')); return }
    if (!Number.isFinite(payload.capacity) || payload.capacity <= 0) { toast.error(t('capacityPositive')); return }
    if (floorMap[payload.floor_id]?.building_id !== payload.building_id) { toast.error(t('invalidFloorForBuilding')); return }
    const all = await dataService.list('rooms', 'admin')
    const duplicate = all.some((row) => String(row.code || '').toLowerCase() === payload.code.toLowerCase() && rooms.idOf(row) !== rooms.idOf(editing))
    if (duplicate) { toast.error(t('duplicateRoomCode')); return }
    setSaving(true)
    try {
      if (editing) await rooms.update(rooms.idOf(editing), payload)
      else await rooms.create(payload)
      toast.success(t(editing ? 'updatedSuccessfully' : 'createdSuccessfully'))
      closeForm()
    } catch {
      toast.error(t('saveError'))
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setSaving(true)
    try {
      await rooms.remove(rooms.idOf(deleting))
      toast.success(t('deletedSuccessfully'))
      setDeleting(null)
      setPage((current) => Math.min(current, Math.max(1, Math.ceil((filtered.length - 1) / PAGE_SIZE))))
    } catch {
      toast.error(t('deleteError'))
    } finally {
      setSaving(false)
    }
  }

  const loading = rooms.loading || floors.loading || buildings.loading
  const error = rooms.error || floors.error || buildings.error

  return (
    <>
      <PageHeader eyebrow={`${t('workspace')} / ${t('schoolBuildings')}`} title={t('rooms')} description={t('roomsDescription')} action={isAdmin ? <button className="button primary" onClick={openCreate}><Plus size={17} />{t('add')} {t('roomName').split(' ')[0] || t('rooms')}</button> : null} />
      {loading ? <><LoadingSkeleton variant="cards" count={4} /><LoadingSkeleton rows={7} columns={7} /></> : null}
      {!loading && error ? <ErrorState t={t} onRetry={() => { rooms.reload(); floors.reload(); buildings.reload() }} /> : null}
      {!loading && !error ? (
        <section className="card list-card">
          <div className="list-toolbar">
            <SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1) }} placeholder={`${t('search')} ${t('rooms').toLowerCase()}…`} label={t('search')} />
            <FilterDropdown label={t('allBuildings')} value={buildingFilter} onChange={(value) => { setBuildingFilter(value); setFloorFilter(''); setPage(1) }} options={buildings.rows.map((b) => ({ value: b.building_id, label: b.name }))} />
            <FilterDropdown label={t('allFloors')} value={floorFilter} onChange={(value) => { setFloorFilter(value); setPage(1) }} options={floorOptionsForFilter.map((f) => ({ value: f.floor_id, label: `${f.name} · ${buildingMap[f.building_id]?.name || ''}` }))} />
            <FilterDropdown label={t('allRoomTypes')} value={typeFilter} onChange={(value) => { setTypeFilter(value); setPage(1) }} options={ROOM_TYPES.map((value) => ({ value, label: t(value) || value }))} />
            <FilterDropdown label={t('allStatuses')} value={status} onChange={(value) => { setStatus(value); setPage(1) }} options={ROOM_STATUSES.map((value) => ({ value, label: t(value) || value }))} />
          </div>
          <DataTable
            rows={pageRows}
            columns={[
              { key: 'code', label: 'roomCode' },
              { key: 'name', label: 'roomName', render: (_, row) => <div className="person-cell"><div className="building-visual"><DoorOpen size={17} /></div><span><b>{row.name}</b><small>{row.code}</small></span></div> },
              { key: 'buildingName', label: 'building' },
              { key: 'floorName', label: 'floor' },
              { key: 'room_type', label: 'room_type', render: (value) => t(value) || value },
              { key: 'capacity', label: 'capacity', render: (_, row) => `${row.currentUsage ?? 0} / ${row.capacity ?? '—'}` },
              { key: 'status', label: 'status' },
            ]}
            rowId={rooms.idOf}
            onView={setViewing}
            onEdit={isAdmin ? openEdit : undefined}
            onDelete={isAdmin ? setDeleting : undefined}
            t={t}
            emptyTitle={t('noRooms')}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} t={t} />
        </section>
      ) : null}

      {creating ? (
        <FormModal title={`${editing ? t('edit') : t('add')} ${t('rooms').replace(/s$/, '')}`} description={t('formDescription')} onClose={closeForm} onSubmit={save} saving={saving} submitLabel={{ save: t('save'), saving: t('loading'), cancel: t('cancel') }} wide>
          <div className="form-grid">
            <label>{t('roomName')}<input value={values.name} onChange={(e) => setValues((c) => ({ ...c, name: e.target.value }))} required /></label>
            <label>{t('roomCode')}<input value={values.code} onChange={(e) => setValues((c) => ({ ...c, code: e.target.value }))} required /></label>
            <label>{t('building')}<select value={values.building_id} onChange={(e) => setValues((c) => ({ ...c, building_id: e.target.value, floor_id: '' }))} required><option value="">{t('selectBuilding')}</option>{buildings.rows.map((b) => <option key={b.building_id} value={b.building_id}>{b.name}</option>)}</select></label>
            <label>{t('floor')}<select value={values.floor_id} onChange={(e) => setValues((c) => ({ ...c, floor_id: e.target.value }))} required disabled={!values.building_id}><option value="">{values.building_id ? t('selectFloor') : t('selectBuildingFirst')}</option>{formFloors.map((f) => <option key={f.floor_id} value={f.floor_id}>{f.name}</option>)}</select></label>
            <label>{t('room_type')}<select value={values.room_type} onChange={(e) => setValues((c) => ({ ...c, room_type: e.target.value }))} required><option value="">{t('allRoomTypes')}</option>{ROOM_TYPES.map((type) => <option key={type} value={type}>{t(type)}</option>)}</select></label>
            <label>{t('capacity')}<input type="number" min="1" value={values.capacity} onChange={(e) => setValues((c) => ({ ...c, capacity: e.target.value }))} required /></label>
            <label>{t('currentUsage')}<input type="number" min="0" value={values.currentUsage} onChange={(e) => setValues((c) => ({ ...c, currentUsage: e.target.value }))} /></label>
            <label>{t('status')}<select value={values.status} onChange={(e) => setValues((c) => ({ ...c, status: e.target.value }))}>{ROOM_STATUSES.map((s) => <option key={s} value={s}>{t(s)}</option>)}</select></label>
            <label style={{ gridColumn: '1 / -1' }}>{t('description')}<textarea value={values.description} onChange={(e) => setValues((c) => ({ ...c, description: e.target.value }))} /></label>
          </div>
          {values.capacity && Number(values.capacity) > 0 ? <p className="form-note">{t('roomUsage')}: {values.currentUsage || 0} / {values.capacity}</p> : null}
        </FormModal>
      ) : null}

      {viewing ? <DetailsModal title={viewing.name} subtitle={`${t('rooms').replace(/s$/, '')} · ${rooms.idOf(viewing) || ''}`} sections={[{ title: t('details'), fields: [{ label: t('roomName'), value: viewing.name }, { label: t('roomCode'), value: viewing.code }, { label: t('building'), value: viewing.buildingName }, { label: t('floor'), value: viewing.floorName }, { label: t('room_type'), value: t(viewing.room_type) || viewing.room_type }, { label: t('capacity'), value: viewing.capacity }, { label: t('currentUsage'), value: viewing.currentUsage ?? 0 }, { label: t('status'), value: t(viewing.status) || viewing.status }, { label: t('description'), value: viewing.description || '—' }] }]} onClose={() => setViewing(null)} t={t} /> : null}
      {deleting ? <ConfirmDialog title={t('confirmDelete')} description={t('confirmDeleteDescription')} confirmLabel={t('delete')} cancelLabel={t('cancel')} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} /> : null}
    </>
  )
}

function emptyForm() { return { name: '', code: '', building_id: '', floor_id: '', room_type: 'Classroom', capacity: '', currentUsage: '0', description: '', status: 'Available' } }
function normalize(values, buildingMap, floorMap) {
  return {
    name: values.name.trim(),
    code: values.code.trim(),
    building_id: values.building_id,
    floor_id: values.floor_id,
    buildingName: buildingMap[values.building_id]?.name || '',
    floorName: floorMap[values.floor_id]?.name || '',
    room_type: values.room_type,
    capacity: Number(values.capacity),
    currentUsage: Number(values.currentUsage || 0),
    description: values.description?.trim() || '',
    status: values.status,
  }
}
