import { NavLink, Outlet } from 'react-router-dom'
import { ClipboardIcon, LockIcon, LogOutIcon, TimerIcon, WalletIcon } from '../ui/icons'
import { Logo } from '../ui/Logo'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'
import { useAuth } from '../../store/auth'
import { STATUS_LABELS, useApplication, type DossierStatus } from '../../store/application'

const STEPS = [
  { to: '/dashboard/submission', label: 'Mon dossier', icon: ClipboardIcon },
  { to: '/dashboard/evaluation', label: 'Évaluation', icon: TimerIcon },
  { to: '/dashboard/funding', label: 'Financement', icon: WalletIcon },
] as const

/** Une étape n'est accessible que lorsque le dossier a atteint le statut requis. */
function isUnlocked(to: string, status: DossierStatus): boolean {
  if (to === '/dashboard/submission') return true
  if (to === '/dashboard/evaluation') {
    return ['approved', 'awaiting_next_phase', 'evaluated', 'proofs_submitted', 'financed'].includes(
      status,
    )
  }
  return ['evaluated', 'proofs_submitted', 'financed'].includes(status)
}

const STATUS_TONE: Record<DossierStatus, 'brand' | 'neutral' | 'success' | 'warning' | 'danger'> = {
  draft: 'neutral',
  submitted: 'warning',
  approved: 'brand',
  awaiting_next_phase: 'warning',
  evaluated: 'success',
  proofs_submitted: 'warning',
  financed: 'success',
  rejected: 'danger',
}

export function DashboardLayout() {
  const user = useAuth((state) => state.user)
  const logout = useAuth((state) => state.logout)
  const status = useApplication((state) => state.status)
  const reference = useApplication((state) => state.reference)

  function handleLogout() {
    logout()
    // Navigation complète plutôt que `navigate()` : une mise à jour de store
    // externe ne peut pas être différée par React, alors que celle du routeur
    // l'est. Router côté client ferait donc passer un rendu intermédiaire
    // « route protégée, plus d'utilisateur » par le garde, qui détourne vers
    // /auth/login. Le rechargement vide aussi l'état resté en mémoire.
    window.location.assign('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink-50/50">
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <NavLink to="/" aria-label="INNOVA FUND — accueil">
            <Logo />
          </NavLink>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-ink-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-ink-500">{reference ?? 'Dossier non déposé'}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full p-2 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
              aria-label="Se déconnecter"
            >
              <LogOutIcon className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-8 lg:py-10">
        {/* Navigation d'étapes — colonne sur desktop, rail scrollable sur mobile */}
        <nav aria-label="Étapes du dossier" className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-4 hidden lg:block">
            <Badge tone={STATUS_TONE[status]}>{STATUS_LABELS[status]}</Badge>
          </div>

          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {STEPS.map(({ to, label, icon: Icon }, index) => {
              const unlocked = isUnlocked(to, status)
              return (
                <li key={to} className="shrink-0 lg:shrink">
                  <NavLink
                    to={to}
                    aria-disabled={!unlocked}
                    onClick={(event) => {
                      if (!unlocked) event.preventDefault()
                    }}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition lg:w-full',
                        !unlocked && 'cursor-not-allowed text-ink-300',
                        unlocked && isActive
                          ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
                          : unlocked && 'bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50',
                      )
                    }
                  >
                    {unlocked ? (
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    ) : (
                      <LockIcon className="h-4 w-4 shrink-0" aria-hidden />
                    )}
                    <span className="whitespace-nowrap">
                      <span className="lg:hidden">{index + 1}. </span>
                      {label}
                    </span>
                  </NavLink>
                </li>
              )
            })}
          </ul>

          <div className="mt-3 lg:hidden">
            <Badge tone={STATUS_TONE[status]}>{STATUS_LABELS[status]}</Badge>
          </div>
        </nav>

        <main className="mt-6 lg:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
