import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { RequireRole } from './components/layout/RouteGuards'
import { ScrollManager } from './components/layout/ScrollManager'
import { RouteFallback } from './components/layout/RouteFallback'
import { Toaster } from './components/ui/Toaster'
import { Landing } from './pages/Landing'

/**
 * Découpage du bundle.
 *
 * La landing page et l'authentification sont servies dans le chunk principal :
 * ce sont les seules pages qu'un visiteur non connecté atteint. L'espace porteur
 * et le back-office — avec leur moteur de QCM, leur visualiseur de documents et
 * leur pipeline — ne sont chargés qu'après connexion.
 */
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))
const Login = lazy(() => import('./pages/auth/Login').then((m) => ({ default: m.Login })))
const Register = lazy(() => import('./pages/auth/Register').then((m) => ({ default: m.Register })))

const DashboardLayout = lazy(() =>
  import('./components/layout/DashboardLayout').then((m) => ({ default: m.DashboardLayout })),
)
const Overview = lazy(() => import('./pages/dashboard/Overview').then((m) => ({ default: m.Overview })))
const Submission = lazy(() =>
  import('./pages/dashboard/Submission').then((m) => ({ default: m.Submission })),
)
const Evaluation = lazy(() =>
  import('./pages/dashboard/Evaluation').then((m) => ({ default: m.Evaluation })),
)
const Funding = lazy(() => import('./pages/dashboard/Funding').then((m) => ({ default: m.Funding })))

const AdminLayout = lazy(() =>
  import('./components/layout/AdminLayout').then((m) => ({ default: m.AdminLayout })),
)
const Dossiers = lazy(() => import('./pages/admin/Dossiers').then((m) => ({ default: m.Dossiers })))
const Verifications = lazy(() =>
  import('./pages/admin/Verifications').then((m) => ({ default: m.Verifications })),
)

const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
      <Toaster />
    </BrowserRouter>
  )
}
