import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { PreferencesProvider } from './context/PreferencesContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PreferencesProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </PreferencesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
