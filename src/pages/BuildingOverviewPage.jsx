import { useMemo } from 'react'
import { Building2, DoorOpen, Layers, Wrench } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PageHeader from '../components/common/PageHeader.jsx'
import LoadingSkeleton from '../components/common/LoadingSkeleton.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import StatusPill from '../components/ui/StatusPill.jsx'
import { useResource } from '../hooks/useResource.js'

const COLORS = ['#45af81', '#4a67d6', '#e6a43a', '#d27068']

export default function BuildingOverviewPage({ role, t }) {
  const buildings = useResource('buildings', role)
  const floors = useResource('floors', role)
  const rooms = useResource('rooms', role)
  const assignments = useResource('room-assignments', role)

  const loading = buildings.loading || floors.loading || rooms.loading || assignments.loading
  const error = buildings.error || floors.error || rooms.error || assignments.error

  const buildingMap = useMemo(() => Object.fromEntries(buildings.rows.map((b) => [b.building_id, b])), [buildings.rows])
  const floorMap = useMemo(() => Object.fromEntries(floors.rows.map((f) => [f.floor_id, f])), [floors.rows])
  const floorsByBuilding = useMemo(() => groupBy(floors.rows, 'building_id'), [floors.rows])
  const roomsByFloor = useMemo(() => groupBy(rooms.rows, 'floor_id'), [rooms.rows])
  const assignmentsByRoom = useMemo(() => groupBy(assignments.rows, 'room_id'), [assignments.rows])

  const totals = useMemo(() => {
    const totalRooms = rooms.rows.length
    const available = rooms.rows.filter((r) => r.status === 'Available').length
    const occupied = rooms.rows.filter((r) => r.status === 'Occupied').length
    const maintenance = rooms.rows.filter((r) => r.status === 'Maintenance').length
    return { buildings: buildings.rows.length, floors: floors.rows.length, rooms: totalRooms, available, occupied, maintenance }
  }, [buildings.rows, floors.rows, rooms.rows])

  const occupancyData = [
    { name: t('Available'), value: totals.available, color: '#45af81' },
    { name: t('Occupied'), value: totals.occupied, color: '#4a67d6' },
    { name: t('Maintenance'), value: totals.maintenance, color: '#e6a43a' },
  ].filter((item) => item.value > 0)

  const roomsPerBuilding = buildings.rows.map((b) => ({
    name: b.name,
    rooms: rooms.rows.filter((r) => r.building_id === b.building_id).length,
    floors: floors.rows.filter((f) => f.building_id === b.building_id).length,
  }))

  if (loading) return <><PageHeader eyebrow={`${t('workspace')} / ${t('schoolBuildings')}`} title={t('building-overview')} description={t('building-overviewDescription')} /><LoadingSkeleton variant="cards" count={6} /><LoadingSkeleton rows={6} columns={4} /></>
  if (error) return <><PageHeader eyebrow={`${t('workspace')} / ${t('schoolBuildings')}`} title={t('building-overview')} description={t('building-overviewDescription')} /><ErrorState t={t} onRetry={() => { buildings.reload(); floors.reload(); rooms.reload(); assignments.reload() }} /></>

  return (
    <>
      <PageHeader eyebrow={`${t('workspace')} / ${t('schoolBuildings')}`} title={t('building-overview')} description={t('building-overviewDescription')} />

      <div className="building-stats-grid">
        <StatCard icon={Building2} label={t('totalBuildings')} value={totals.buildings} />
        <StatCard icon={Layers} label={t('totalFloors')} value={totals.floors} tone="purple" />
        <StatCard icon={DoorOpen} label={t('totalRooms')} value={totals.rooms} tone="amber" />
        <StatCard icon={DoorOpen} label={t('availableRooms')} value={totals.available} tone="green" />
        <StatCard icon={DoorOpen} label={t('occupiedRooms')} value={totals.occupied} />
        <StatCard icon={Wrench} label={t('maintenanceRooms')} value={totals.maintenance} tone="amber" />
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 14 }}>
        <section className="card enrollment-card">
          <div className="card-heading"><div><h3>{t('roomOccupancy')}</h3><p>{t('building-overviewDescription')}</p></div></div>
          {occupancyData.length ? (
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={occupancyData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                    {occupancyData.map((entry, index) => <Cell key={entry.name} fill={entry.color || COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState title={t('noRooms')} description={t('adjustSearch')} />}
          <div className="tag-row" style={{ marginTop: 8 }}>
            {occupancyData.map((item) => <span key={item.name} className="tag"><i className="legend-dot" style={{ background: item.color }} />{item.name}: <b>{item.value}</b></span>)}
          </div>
        </section>

        <section className="card gender-card">
          <div className="card-heading"><div><h3>{t('roomsByFloor')}</h3><p>{t('totalRooms')}</p></div></div>
          {roomsPerBuilding.length ? (
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roomsPerBuilding}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="rooms" fill="#4a67d6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState title={t('noBuildings')} description={t('adjustSearch')} />}
        </section>
      </div>

      <div className="building-sections">
        {buildings.rows.length === 0 ? <section className="card building-card"><EmptyState title={t('noBuildings')} description={t('buildingsDescription')} /></section> : buildings.rows.map((building) => {
          const buildingFloors = floorsByBuilding[building.building_id] || []
          const buildingRooms = rooms.rows.filter((r) => r.building_id === building.building_id)
          const occ = buildingRooms.filter((r) => r.status === 'Occupied').length
          const total = buildingRooms.length || 1
          return (
            <section key={building.building_id} className="card building-card">
              <div className="building-card-head">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div className="building-visual"><Building2 size={20} /></div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 13 }}>{building.name}</h3>
                    <p className="muted" style={{ margin: '3px 0 0' }}>{building.code} · {t(building.status) || building.status}</p>
                  </div>
                </div>
                <StatusPill value={building.status} t={t} />
              </div>
              <div className="building-meta-grid">
                <div className="meta-item"><span>{t('numberOfFloors')}</span><b>{buildingFloors.length || building.numberOfFloors || 0}</b></div>
                <div className="meta-item"><span>{t('totalRooms')}</span><b>{buildingRooms.length}</b></div>
                <div className="meta-item"><span>{t('occupiedRooms')}</span><b>{occ}</b></div>
              </div>
              <div className="occupancy-bar occupied" style={{ marginTop: 12 }}><span style={{ width: `${Math.round((occ / total) * 100)}%` }} /></div>
              <p className="muted" style={{ marginTop: 8 }}>{building.description || '—'}</p>

              <div className="nested-list">
                <div className="section-title-row"><h3>{t('floorsByBuilding')}</h3></div>
                {buildingFloors.length === 0 ? <p className="muted">{t('noFloors')}</p> : buildingFloors.map((floor) => {
                  const floorRooms = roomsByFloor[floor.floor_id] || []
                  return (
                    <div key={floor.floor_id} className="nested-item">
                      <h4>{floor.name} ({t('floor_number')} {floor.floor_number})</h4>
                      <div className="tag-row" style={{ marginBottom: floorRooms.length ? 8 : 0 }}>
                        <span className="tag">{t('totalRooms')}: {floorRooms.length}</span>
                        <span className="tag">{t(floor.status) || floor.status}</span>
                      </div>
                      {floorRooms.length ? (
                        <div className="nested-list">
                          {floorRooms.map((room) => {
                            const usedBy = (assignmentsByRoom[room.room_id] || []).map((a) => a.className).filter(Boolean)
                            return (
                              <div key={room.room_id} className="nested-item" style={{ background: 'var(--surface)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                                  <h5>{room.name} <small className="muted">({room.code})</small></h5>
                                  <span className={`tag ${String(room.status).toLowerCase()}`}>{t(room.status) || room.status}</span>
                                </div>
                                <div className="tag-row">
                                  <span className="tag">{t(room.room_type) || room.room_type}</span>
                                  <span className="tag">{t('capacity')}: {room.currentUsage ?? 0}/{room.capacity ?? '—'}</span>
                                  <span className="tag">{t('usedBy')}: {usedBy.join(', ') || '—'}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : <p className="muted">{t('noRooms')}</p>}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}

function StatCard({ icon: Icon, label, value, tone = 'blue' }) {
  return (
    <div className="card stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={18} /></div>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  )
}

function groupBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unknown'
    if (!acc[value]) acc[value] = []
    acc[value].push(row)
    return acc
  }, {})
}
