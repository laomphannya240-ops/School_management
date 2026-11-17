import { useCallback, useRef, useState } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { ToastContext } from './ToastContextObject.js'

const ICONS = { success: CheckCircle2, error: XCircle, info: Info }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)
  const dismiss = useCallback((id) => setToasts((current) => current.filter((item) => item.id !== id)), [])

  const push = useCallback((message, type = 'success') => {
    const id = ++counter.current
    setToasts((current) => [...current, { id, message, type }].slice(-4))
    setTimeout(() => dismiss(id), 4000)
  }, [dismiss])

  const toast = {
    success: (message) => push(message, 'success'),
    error: (message) => push(message, 'error'),
    info: (message) => push(message, 'info'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map(({ id, message, type }) => {
          const Icon = ICONS[type] || Info
          return (
            <div key={id} className={`toast toast-${type}`} role={type === 'error' ? 'alert' : 'status'}>
              <Icon size={18} />
              <span>{message}</span>
              <button className="toast-close" onClick={() => dismiss(id)} aria-label="Close"><X size={15} /></button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
