import { Eye, Pencil, Trash2 } from 'lucide-react'
import EmptyState from './EmptyState.jsx'
import StatusPill from '../ui/StatusPill.jsx'

export default function DataTable({ rows, columns, rowId, onEdit, onDelete, onView, t, emptyTitle, emptyDescription }) {
  if (!rows.length) return <EmptyState title={emptyTitle || t('noResults')} description={emptyDescription || t('adjustSearch')} />
  const hasActions = onEdit || onDelete || onView
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => <th key={column.key}>{t(column.label || column.key) || column.label || column.key}</th>)}
            {hasActions && <th>{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={rowId?.(row) || index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : column.key === 'status'
                      ? <StatusPill value={row[column.key]} t={t} />
                      : row[column.key] ?? '—'}
                </td>
              ))}
              {hasActions && (
                <td>
                  <div className="row-actions">
                    {onView && <button className="icon-btn" title={t('details')} aria-label={`${t('details')} ${row.name || ''}`} onClick={() => onView(row)}><Eye size={15} /></button>}
                    {onEdit && <button className="icon-btn" title={t('edit')} aria-label={`${t('edit')} ${row.name || ''}`} onClick={() => onEdit(row)}><Pencil size={15} /></button>}
                    {onDelete && <button className="icon-btn danger-icon" title={t('delete')} aria-label={`${t('delete')} ${row.name || ''}`} onClick={() => onDelete(row)}><Trash2 size={15} /></button>}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
