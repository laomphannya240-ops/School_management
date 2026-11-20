import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { usePreferences } from '../hooks/usePreferences.js'
import Dashboard from '../pages/DashboardPage.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
import ModulePage from '../pages/ModulePage.jsx'
import AttendancePage from '../pages/AttendancePage.jsx'
import ReportsPage from '../pages/ReportsPage.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
import BuildingOverviewPage from '../pages/BuildingOverviewPage.jsx'
import BuildingsPage from '../pages/BuildingsPage.jsx'
import FloorsPage from '../pages/FloorsPage.jsx'
import RoomsPage from '../pages/RoomsPage.jsx'
import RoomAssignmentsPage from '../pages/RoomAssignmentsPage.jsx'
import AuthLayout from '../layouts/AuthLayout.jsx'
import RoleLayout from '../layouts/RoleLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

function ModuleRoute() {
  const { module } = useParams()
  const { user } = useAuth()
  const { t } = usePreferences()
  if (module === 'attendance') return <AttendancePage key={module} role={user.role} t={t} />
  if (module === 'building-overview') return <BuildingOverviewPage key={module} role={user.role} t={t} />
  if (module === 'buildings') return <BuildingsPage key={module} role={user.role} t={t} />
  if (module === 'floors') return <FloorsPage key={module} role={user.role} t={t} />
  if (module === 'rooms') return <RoomsPage key={module} role={user.role} t={t} />
  if (module === 'room-assignments') return <RoomAssignmentsPage key={module} role={user.role} t={t} />
  return <ModulePage key={module} module={module} role={user.role} t={t} />
}
function DashboardRoute() {
  const { user } = useAuth()
  const { t } = usePreferences()
  return <Dashboard role={user.role} t={t} />
}
function ReportsRoute() {
  const { user } = useAuth()
  const { t } = usePreferences()
  return <ReportsPage role={user.role} t={t} />
}
function SettingsRoute() {
  const { t } = usePreferences()
  return <SettingsPage t={t} />
}
function UnknownRoute() {
  const { user } = useAuth()
  return <Navigate to={user ? '/' : '/login'} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleLayout />}>
          <Route index element={<DashboardRoute />} />
          <Route path="reports" element={<ReportsRoute />} />
          <Route path="settings" element={<SettingsRoute />} />
          <Route path=":module" element={<ModuleRoute />} />
        </Route>
      </Route>
      <Route path="*" element={<UnknownRoute />} />
    </Routes>
  )
}
