import { AlertCircle, RotateCcw } from 'lucide-react'

export default function ErrorState({ t, onRetry, title, description }) {
  return (
    <div className="card error-state" role="alert">
      <div className="error-icon"><AlertCircle size={24} /></div>
      <h3>{title || t?.('errorTitle') || 'Something went wrong'}</h3>
      <p>{description || t?.('errorDescription') || 'Please try again.'}</p>
      {onRetry && <button className="button secondary" onClick={onRetry}><RotateCcw size={15} />{t?.('retry') || 'Try again'}</button>}
    </div>
  )
}
