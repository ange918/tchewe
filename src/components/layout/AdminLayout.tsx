import { NavLink, Outlet } from 'react-router-dom'
import { FolderKanban, LogOut, ReceiptText } from 'lucide-react'
import { LogoMark } from '../ui/Logo'
import { cn } from '../../lib/utils'
import { useAuth } from '../../store/auth'

const LINKS = [
  { to: '/admin/dossiers', label: 'Dossiers', icon: FolderKanban },
  { to: '/admin/verifications', label: 'Vérifications', icon: ReceiptText },
]

export function AdminLayout() {
  const user = useAuth((state) => state.user)
  const logout = useAuth((state) => state.logout)

  return (
    <div className="flex min-h-screen flex-col bg-ink-50/60">
      <header className="sticky top-0 z-40 bg-ink-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <NavLink to="/admin/dossiers" className="flex items-center gap-2.5 text-white">
            <LogoMark className="h-7 w-7" />
            <span className="text-lg font-extrabold tracking-[-0.04em]">
              INNOVA<span className="font-medium"> FUND</span>
            </span>
            <span className="ml-1 rounded-md bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold tracking-[0.1em] text-brand-200 uppercase">
              Back-office
            </span>
          </NavLink>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-semibold text-ink-300 sm:block">{user?.email}</span>
            <button
              type="button"
              onClick={() => {
                // Voir DashboardLayout : navigation complète à la déconnexion.
                logout()
                window.location.assign('/')
              }}
              aria-label="Se déconnecter"
              className="rounded-lg p-2 text-ink-400 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        <nav className="border-t border-white/10">
          <ul className="mx-auto flex max-w-7xl gap-1 px-2 sm:px-4">
            {LINKS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 border-b-2 px-3.5 py-3 text-sm font-bold transition',
                      isActive
                        ? 'border-brand-400 text-white'
                        : 'border-transparent text-ink-400 hover:text-white',
                    )
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  )
}
