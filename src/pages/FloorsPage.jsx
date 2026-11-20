import { useMemo, useState } from 'react'
import { Layers, Plus } from 'lucide-react'
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

export default function FloorsPage({ role, t }) {
  const isAdmin = role === 'admin'
  const toast = useToast()
  const floors = useResource('floors', role)
  const buildings = useResource('buildings', role)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [buildingFilter, setBuildingFilter] = useState('')
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [values, setValues] = useState(emptyForm())

  const buildingMap = useMemo(() => Object.fromEntries(buildings.rows.map((b) => [b.building_id, b])), [buildings.rows])
  const rows = useMemo(() => floors.rows.map((row) => ({
    ...row,
    buildingName: row.buildingName || buildingMap[row.building_id]?.name || '—',
  })), [floors.rows, buildingMap])

  const filtered = rows.filter((row) => {
    const needle = query.trim().toLowerCase()
    const text = `${row.name || ''} ${row.buildingName || ''} ${row.description || ''} ${row.floor_number ?? ''}`.toLowerCase()
    return (!needle || text.includes(needle)) && (!status || row.status === status) && (!buildingFilter || row.building_id === buildingFilter)
  })
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const statuses = [...new Set(rows.map((row) => row.status).filter(Boolean))]

  const openCreate = () => { setEditing(null); setValues({ ...emptyForm(), building_id: buildingFilter || '' }); setCreating(true) }
  const openEdit = (row) => { setEditing(row); setValues({ ...emptyForm(), ...row, floor_number: String(row.floor_number ?? '') }); setCreating(true) }
  const closeForm = () => { if (!saving) { setCreating(false); setEditing(null) } }

  const save = async (event) => {
    event.preventDefault()
    const payload = normalize(values, buildingMap)
    if (!payload.building_id || !payload.name || !payload.status || !Number.isInteger(payload.floor_number)) {
      toast.error(t('saveError'))
      return
    }
    const all = await dataService.list('floors', 'admin')
    const duplicate = all.some((row) => row.building_id === payload.building_id && Number(row.floor_number) === payload.floor_number && floors.idOf(row) !== floors.idOf(editing))
    if (duplicate) { toast.error(t('duplicateFloorNumber')); return }
    setSaving(true)
    try {
      if (editing) await floors.update(floors.idOf(editing), payload)
      else await floors.create(payload)
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
      await floors.remove(floors.idOf(deleting))
      toast.success(t('deletedSuccessfully'))
      setDeleting(null)
      setPage((current) => Math.min(current, Math.max(1, Math.ceil((filtered.length - 1) / PAGE_SIZE))))
    } catch {
      toast.error(t('deleteError'))
    } finally {
      setSaving(false)
    }
  }

  const loading = floors.loading || buildings.loading
  const error = floors.error || buildings.error

  return (
    <>
      <PageHeader eyebrow={`${t('workspace')} / ${t('schoolBuildings')}`} title={t('floors')} description={t('floorsDescription')} action={isAdmin ? <button className="button primary" onClick={openCreate}><Plus size={17} />{t('add')} {t('floor')}</button> : null} />
      {loading ? <><LoadingSkeleton variant="cards" count={3} /><LoadingSkeleton rows={6} columns={5} /></> : null}
      {!loading && error ? <ErrorState t={t} onRetry={() => { floors.reload(); buildings.reload() }} /> : null}
      {!loading && !error ? (
        <section className="card list-card">
          <div className="list-toolbar">
            <SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1) }} placeholder={`${t('search')} ${t('floors').toLowerCase()}…`} label={t('search')} />
            <FilterDropdown label={t('allBuildings')} value={buildingFilter} onChange={(value) => { setBuildingFilter(value); setPage(1) }} options={buildings.rows.map((b) => ({ value: b.building_id, label: b.name }))} />
            <FilterDropdown label={t('allStatuses')} value={status} onChange={(value) => { setStatus(value); setPage(1) }} options={statuses.map((value) => ({ value, label: t(value) || value }))} />
          </div>
          <DataTable
            rows={pageRows}
            columns={[
              { key: 'buildingName', label: 'building' },
              { key: 'floor_number', label: 'floor_number' },
              { key: 'name', label: 'floorName', render: (_, row) => <div className="person-cell"><div className="building-visual"><Layers size={17} /></div><span><b>{row.name}</b><small>{row.buildingName}</small></span></div> },
              { key: 'status', label: 'status' },
              { key: 'description', label: 'description' },
            ]}
            rowId={floors.idOf}
            onView={setViewing}
            onEdit={isAdmin ? openEdit : undefined}
            onDelete={isAdmin ? setDeleting : undefined}
            t={t}
            emptyTitle={t('noFloors')}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} t={t} />
        </section>
      ) : null}

      {creating ? (
        <FormModal title={`${editing ? t('edit') : t('add')} ${t('floor')}`} description={t('formDescription')} onClose={closeForm} onSubmit={save} saving={saving} submitLabel={{ save: t('save'), saving: t('loading'), cancel: t('cancel') }}>
          <div className="form-grid">
            <label>{t('building')}<select value={values.building_id} onChange={(e) => setValues((c) => ({ ...c, building_id: e.target.value }))} required><option value="">{t('selectBuilding')}</option>{buildings.rows.map((b) => <option key={b.building_id} value={b.building_id}>{b.name}</option>)}</select></label>
            <label>{t('floorName')}<input value={values.name} onChange={(e) => setValues((c) => ({ ...c, name: e.target.value }))} required /></label>
            <label>{t('floor_number')}<input type="number" step="1" value={values.floor_number} onChange={(e) => setValues((c) => ({ ...c, floor_number: e.target.value }))} required /></label>
            <label>{t('status')}<select value={values.status} onChange={(e) => setValues((c) => ({ ...c, status: e.target.value }))}><option value="Active">{t('Active')}</option><option value="Inactive">{t('Inactive')}</option></select></label>
            <label style={{ gridColumn: '1 / -1' }}>{t('description')}<textarea value={values.description} onChange={(e) => setValues((c) => ({ ...c, description: e.target.value }))} /></label>
          </div>
        </FormModal>
      ) : null}

      {viewing ? <DetailsModal title={viewing.name} subtitle={`${t('floor')} · ${floors.idOf(viewing) || ''}`} sections={[{ title: t('details'), fields: [{ label: t('building'), value: viewing.buildingName }, { label: t('floorName'), value: viewing.name }, { label: t('floor_number'), value: viewing.floor_number }, { label: t('status'), value: t(viewing.status) || viewing.status }, { label: t('description'), value: viewing.description || '—' }] }]} onClose={() => setViewing(null)} t={t} /> : null}
      {deleting ? <ConfirmDialog title={t('confirmDelete')} description={t('confirmDeleteDescription')} confirmLabel={t('delete')} cancelLabel={t('cancel')} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} /> : null}
    </>
  )
}

function emptyForm() { return { building_id: '', name: '', floor_number: '', description: '', status: 'Active' } }
function normalize(values, buildingMap) {
  return {
    building_id: values.building_id,
    buildingName: buildingMap[values.building_id]?.name || '',
    name: values.name.trim(),
    floor_number: Number(values.floor_number),
    description: values.description?.trim() || '',
    status: values.status,
  }
}
