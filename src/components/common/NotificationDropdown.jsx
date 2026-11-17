import { Bell, CheckCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useResource } from '../../hooks/useResource.js'
import { moduleIdentity } from '../../constants/moduleIdentity.js'
import EmptyState from './EmptyState.jsx'

export default function NotificationDropdown({ role, onClose, t }) {
  const { rows, loading, update } = useResource('notifications', role || 'admin')
  const idKey = moduleIdentity.notifications
  const unread = rows.filter((row) => row.status === 'New')
  const markRead = async (row) => { if (row.status === 'New') await update(row[idKey], { status: 'Read' }) }
  const markAll = async () => { await Promise.all(unread.map((row) => update(row[idKey], { status: 'Read' }))) }

  return (
    <div className="popover notification-popover" role="dialog">
      <div className="notification-head">
        <b>{t('notifications')}</b>
        <button className="link-button" disabled={!unread.length} onClick={markAll}>
          <CheckCheck size={14} /> {t('markAllRead')}
        </button>
      </div>
      {loading ? (
        <div className="notification-skeleton"><span className="skeleton skeleton-line" /><span className="skeleton skeleton-line short" /></div>
      ) : rows.length ? (
        <div className="notification-list">
          {rows.slice(0, 5).map((row) => (
            <button key={row[idKey]} className={`notification-item ${row.status === 'New' ? 'unread' : ''}`} onClick={() => markRead(row)}>
              <span className={`notification-dot ${row.type || row.status}`}><Bell size={14} /></span>
              <span>
                <b>{row.title}</b>
                <small>{row.message}</small>
                <time>{row.date}</time>
              </span>
            </button>
          ))}
        </div>
      ) : <EmptyState title={t('noNotifications')} description={t('noNotificationsDescription')} />}
      <Link className="notification-footer" to="/notifications" onClick={onClose}>{t('viewAll')}</Link>
    </div>
  )
}
