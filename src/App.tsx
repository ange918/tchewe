import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { RequireRole } from './components/layout/RouteGuards'
import { ScrollManager } from './components/layout/ScrollManager'
import { Toaster } from './components/ui/Toaster'
import { Landing } from './pages/Landing'
import { About } from './pages/About'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { Overview } from './pages/dashboard/Overview'
import { Submission } from './pages/dashboard/Submission'
import { Evaluation } from './pages/dashboard/Evaluation'
import { Funding } from './pages/dashboard/Funding'
import { Dossiers } from './pages/admin/Dossiers'
import { Verifications } from './pages/admin/Verifications'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="a-propos" element={<About />} />
        </Route>

        {/* Authentification */}
        <Route path="auth">
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Espace porteur de projet */}
        <Route
          path="dashboard"
          element={
            <RequireRole role="candidate">
              <DashboardLayout />
            </RequireRole>
          }
        >
          <Route index element={<Overview />} />
          <Route path="submission" element={<Submission />} />
          <Route path="evaluation" element={<Evaluation />} />
          <Route path="funding" element={<Funding />} />
        </Route>

        {/* Back-office administrateur */}
        <Route
          path="admin"
          element={
            <RequireRole role="admin">
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="/admin/dossiers" replace />} />
          <Route path="dossiers" element={<Dossiers />} />
          <Route path="verifications" element={<Verifications />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}
