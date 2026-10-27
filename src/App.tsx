import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { RequireRole } from './components/layout/RouteGuards'
import { AuthLinkNotice } from './components/layout/AuthLinkNotice'
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
const AdminHome = lazy(() => import('./pages/admin/Home').then((m) => ({ default: m.Home })))
const Stage = lazy(() => import('./pages/admin/Stage').then((m) => ({ default: m.Stage })))
const Accounts = lazy(() =>
  import('./pages/admin/Accounts').then((m) => ({ default: m.Accounts })),
)
const Terms = lazy(() => import('./pages/Terms').then((m) => ({ default: m.Terms })))

const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <AuthLinkNotice />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route index element={<Landing />} />
            <Route path="a-propos" element={<About />} />
            <Route path="conditions" element={<Terms />} />
          </Route>

          {/* La console Supreme a été retirée : elle dupliquait les décisions du
              back-office sans rien y ajouter. L'adresse reste redirigée pour les
              signets existants. */}
          <Route path="supreme" element={<Navigate to="/admin/dossiers" replace />} />

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

          {/* Anciennes adresses du back-office, conservées pour les signets. */}
          <Route path="admin/dossiers" element={<Navigate to="/admin/nouveaux" replace />} />
          <Route path="admin/verifications" element={<Navigate to="/admin/preuves" replace />} />

          {/* Back-office administrateur */}
          <Route
            path="admin"
            element={
              <RequireRole role="admin">
                <AdminLayout />
              </RequireRole>
            }
          >
            <Route index element={<AdminHome />} />
            {/* Déclarée avant la route dynamique, qui sinon l'absorberait. */}
            <Route path="comptes" element={<Accounts />} />
            {/* Une seule route pour toutes les étapes : leur liste vit dans
                lib/pipeline.ts, et l'ajout d'une étape ne touche pas au routage. */}
            <Route path=":slug" element={<Stage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  )
}
