import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pageSize, total, onChange, t }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const first = total ? (page - 1) * pageSize + 1 : 0
  const last = Math.min(page * pageSize, total)
  return (
    <div className="pagination">
      <span>{t('showing')} {first}–{last} {t('of')} {total} {t('entries')}</span>
      <div>
        <button className="icon-btn" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label={t('previous')}><ChevronLeft size={17} /></button>
        <span className="page-number" aria-current="page">{page} / {pages}</span>
        <button className="icon-btn" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label={t('next')}><ChevronRight size={17} /></button>
      </div>
    </div>
  )
}
