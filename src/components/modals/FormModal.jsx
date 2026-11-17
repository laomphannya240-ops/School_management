import { X } from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner.jsx'

export default function FormModal({ title, description, onClose, onSubmit, children, submitLabel, saving, wide }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className={`modal ${wide ? 'modal-wide' : ''}`} onClick={(event) => event.stopPropagation()} onSubmit={onSubmit}>
        <div className="modal-head">
          <div><h2>{title}</h2><p>{description}</p></div>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body-scroll">{children}</div>
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onClose}>{submitLabel?.cancel}</button>
          <button type="submit" className="button primary" disabled={saving}>{saving ? <LoadingSpinner label={submitLabel?.saving} /> : submitLabel?.save}</button>
        </div>
      </form>
    </div>
  )
}
