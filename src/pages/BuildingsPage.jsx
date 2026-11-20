import { useMemo, useState } from 'react'
import { Building2, Plus } from 'lucide-react'
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

const PAGE_SIZE = 6

export default function BuildingsPage({ role, t }) {
  const isAdmin = role === 'admin'
  const toast = useToast()
  const buildings = useResource('buildings', role)
  const floors = useResource('floors', role)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)
  const [values, setValues] = useState(emptyForm())

  const floorCounts = useMemo(() => countBy(floors.rows, 'building_id'), [floors.rows])
  const rows = useMemo(() => buildings.rows.map((row) => ({
    ...row,
    numberOfFloors: row.numberOfFloors ?? floorCounts[row.building_id] ?? 0,
  })), [buildings.rows, floorCounts])

  const filtered = rows.filter((row) => {
    const needle = query.trim().toLowerCase()
    const text = `${row.name || ''} ${row.code || ''} ${row.description || ''}`.toLowerCase()
    return (!needle || text.includes(needle)) && (!status || row.status === status)
  })
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const statuses = [...new Set(rows.map((row) => row.status).filter(Boolean))]

  const openCreate = () => { setEditing(null); setValues(emptyForm()); setCreating(true) }
  const openEdit = (row) => { setEditing(row); setValues({ ...emptyForm(), ...row, numberOfFloors: String(row.numberOfFloors ?? '') }); setCreating(true) }
  const closeForm = () => { if (!saving) { setCreating(false); setEditing(null) } }

  const save = async (event) => {
    event.preventDefault()
    const payload = normalize(values)
    if (!payload.name || !payload.code || !payload.status || !Number.isFinite(payload.numberOfFloors) || payload.numberOfFloors < 0) {
      toast.error(t('saveError'))
      return
    }
    const all = await dataService.list('buildings', 'admin')
    const codeTaken = all.some((row) => String(row.code || '').toLowerCase() === payload.code.toLowerCase() && buildings.idOf(row) !== buildings.idOf(editing))
    if (codeTaken) { toast.error(t('duplicateRoomCode')); return }
    setSaving(true)
    try {
      if (editing) await buildings.update(buildings.idOf(editing), payload)
      else await buildings.create(payload)
      toast.success(t(editing ? 'updatedSuccessfully' : 'createdSuccessfully'))
      setCreating(false)
      setEditing(null)
    } catch {
      toast.error(t('saveError'))
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setSaving(true)
    try {
      await buildings.remove(buildings.idOf(deleting))
      toast.success(t('deletedSuccessfully'))
      setDeleting(null)
      setPage((current) => Math.min(current, Math.max(1, Math.ceil((filtered.length - 1) / PAGE_SIZE))))
    } catch {
      toast.error(t('deleteError'))
    } finally {
      setSaving(false)
    }
  }

  const loading = buildings.loading || floors.loading
  const error = buildings.error || floors.error

  return (
    <>
      <PageHeader
        eyebrow={`${t('workspace')} / ${t('schoolBuildings')}`}
        title={t('buildings')}
        description={t('buildingsDescription')}
        action={isAdmin ? <button className="button primary" onClick={openCreate}><Plus size={17} />{t('add')} {t('building')}</button> : null}
      />
      {loading ? <><LoadingSkeleton variant="cards" count={4} /><LoadingSkeleton rows={6} columns={5} /></> : null}
      {!loading && error ? <ErrorState t={t} onRetry={() => { buildings.reload(); floors.reload() }} /> : null}
      {!loading && !error ? (
        <section className="card list-card">
          <div className="list-toolbar">
            <SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1) }} placeholder={`${t('search')} ${t('buildings').toLowerCase()}…`} label={t('search')} />
            <FilterDropdown label={t('allStatuses')} value={status} onChange={(value) => { setStatus(value); setPage(1) }} options={statuses.map((value) => ({ value, label: t(value) || value }))} />
          </div>
          <DataTable
            rows={pageRows}
            columns={[
              { key: 'code', label: 'buildingCode' },
              { key: 'name', label: 'buildingName', render: (_, row) => <div className="person-cell"><div className="building-visual"><Building2 size={18} /></div><span><b>{row.name}</b><small>{row.code}</small></span></div> },
              { key: 'numberOfFloors', label: 'numberOfFloors' },
              { key: 'status', label: 'status' },
              { key: 'description', label: 'description' },
            ]}
            rowId={buildings.idOf}
            onView={setViewing}
            onEdit={isAdmin ? openEdit : undefined}
            onDelete={isAdmin ? setDeleting : undefined}
            t={t}
            emptyTitle={t('noBuildings')}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} t={t} />
        </section>
      ) : null}

      {creating ? (
        <FormModal title={`${editing ? t('edit') : t('add')} ${t('building')}`} description={t('formDescription')} onClose={closeForm} onSubmit={save} saving={saving} submitLabel={{ save: t('save'), saving: t('loading'), cancel: t('cancel') }}>
          <div className="form-grid">
            <label>{t('buildingName')}<input value={values.name} onChange={(e) => setValues((c) => ({ ...c, name: e.target.value }))} required /></label>
            <label>{t('buildingCode')}<input value={values.code} onChange={(e) => setValues((c) => ({ ...c, code: e.target.value }))} required /></label>
            <label>{t('numberOfFloors')}<input type="number" min="0" value={values.numberOfFloors} onChange={(e) => setValues((c) => ({ ...c, numberOfFloors: e.target.value }))} required /></label>
            <label>{t('status')}<select value={values.status} onChange={(e) => setValues((c) => ({ ...c, status: e.target.value }))}><option value="Active">{t('Active')}</option><option value="Inactive">{t('Inactive')}</option></select></label>
            <label style={{ gridColumn: '1 / -1' }}>{t('description')}<textarea value={values.description} onChange={(e) => setValues((c) => ({ ...c, description: e.target.value }))} /></label>
          </div>
        </FormModal>
      ) : null}

      {viewing ? <DetailsModal title={viewing.name} subtitle={`${t('building')} · ${buildings.idOf(viewing) || ''}`} sections={[{ title: t('buildingDetails'), fields: [{ label: t('buildingName'), value: viewing.name }, { label: t('buildingCode'), value: viewing.code }, { label: t('numberOfFloors'), value: viewing.numberOfFloors ?? floorCounts[viewing.building_id] ?? 0 }, { label: t('status'), value: t(viewing.status) || viewing.status }, { label: t('description'), value: viewing.description || '—' }] }]} onClose={() => setViewing(null)} t={t} /> : null}
      {deleting ? <ConfirmDialog title={t('confirmDelete')} description={t('confirmDeleteDescription')} confirmLabel={t('delete')} cancelLabel={t('cancel')} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} /> : null}
    </>
  )
}

function emptyForm() { return { name: '', code: '', numberOfFloors: '', description: '', status: 'Active' } }
function normalize(values) { return { name: values.name.trim(), code: values.code.trim(), description: values.description?.trim() || '', status: values.status, numberOfFloors: Number(values.numberOfFloors) } }
function countBy(rows, key) { return rows.reduce((acc, row) => { const value = row[key]; if (value) acc[value] = (acc[value] || 0) + 1; return acc }, {}) }
