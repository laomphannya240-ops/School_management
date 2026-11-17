import { X } from 'lucide-react'

export default function DetailsModal({ title, subtitle, sections, onClose, t }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="modal modal-wide details-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
          <button type="button" className="icon-btn" aria-label={t('close')} onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body-scroll">
          {sections.map((section) => (
            <div className="detail-section" key={section.title}>
              <h4>{section.title}</h4>
              <div className="detail-grid">
                {section.fields.map((field) => (
                  <div className="detail-field" key={field.label}>
                    <span>{field.label}</span>
                    <strong>{field.value === '' || field.value === undefined || field.value === null ? '—' : field.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onClose}>{t('close')}</button>
        </div>
      </section>
    </div>
  )
}
