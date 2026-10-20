import { useEffect, useState, type ComponentType, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { CloseIcon, LockIcon, LogOutIcon, MenuIcon } from '../ui/icons'
import { Logo } from '../ui/Logo'
import { cn } from '../../lib/utils'

export interface SidebarItem {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
  /** Correspondance exacte : évite qu'une racine reste active sur ses enfants. */
  exact?: boolean
  /** Étape pas encore ouverte : visible, mais non cliquable. */
  locked?: boolean
}

interface Props {
  /** Mention sous le logo : « Back-office », « Espace candidat ». */
  section: string
  items: SidebarItem[]
  /** Encart libre au-dessus de la navigation : statut du dossier, raccourci. */
  aside?: ReactNode
  identity: { primary: string; secondary?: string }
  onLogout: () => void
  /** Le pipeline du back-office a besoin de toute la largeur disponible. */
  wide?: boolean
}

function Nav({ items, onNavigate }: { items: SidebarItem[]; onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {items.map(({ to, label, icon: Icon, exact, locked }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={exact}
            aria-disabled={locked}
            onClick={(event) => {
              if (locked) {
                event.preventDefault()
                return
              }
              onNavigate?.()
            }}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition',
                locked
                  ? 'cursor-not-allowed text-ink-300'
                  : isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
              )
            }
          >
            {locked ? (
              <LockIcon className="h-4.5 w-4.5 shrink-0" aria-hidden />
            ) : (
              <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden />
            )}
            <span className="truncate">{label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

/**
 * Coquille commune au back-office et à l'espace candidat : une barre latérale
 * fixe à partir du grand écran, un tiroir en dessous. Les deux espaces
 * partagent la même structure pour que passer de l'un à l'autre ne demande pas
 * de réapprendre où se trouvent les choses.
 */
export function SidebarShell({ section, items, aside, identity, onLogout, wide }: Props) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Le tiroir ne doit pas survivre à une navigation. Les clics sur ses liens le
  // referment déjà ; cet effet couvre ce qu'un gestionnaire de clic ne voit
  // pas — les boutons « Précédent » et « Suivant » du navigateur, qui changent
  // l'URL sans passer par l'interface. C'est bien une synchronisation avec un
  // système externe, l'historique.
  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const panel = (
    <div className="flex h-full flex-col gap-6 p-5">
      <div>
        <NavLink to="/" aria-label="INNOVA FUND — accueil" className="inline-block">
          <Logo />
        </NavLink>
        <p className="mt-2 text-[0.65rem] font-bold tracking-[0.12em] text-ink-400 uppercase">
          {section}
        </p>
      </div>

      {aside}

      <nav aria-label="Navigation principale" className="flex-1">
        <Nav items={items} onNavigate={() => setOpen(false)} />
      </nav>

      <div className="border-t border-ink-100 pt-4">
        <p className="truncate text-sm font-bold text-ink-900">{identity.primary}</p>
        {identity.secondary && (
          <p className="truncate text-xs font-semibold text-brand-600">{identity.secondary}</p>
        )}
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-bold text-ink-600 transition hover:bg-ink-100 hover:text-ink-900"
        >
          <LogOutIcon className="h-4.5 w-4.5 shrink-0" aria-hidden />
          Se déconnecter
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ink-50/60 lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Barre latérale fixe — à partir de lg */}
      <aside className="hidden border-r border-ink-100 bg-white lg:sticky lg:top-0 lg:block lg:h-screen">
        {panel}
      </aside>

      {/* Barre compacte — en dessous de lg */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-ink-100 bg-white/90 px-4 backdrop-blur-md lg:hidden">
        <NavLink to="/" aria-label="INNOVA FUND — accueil">
          <Logo />
        </NavLink>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          className="rounded-xl p-2 text-ink-600 transition hover:bg-ink-100 hover:text-ink-900"
        >
          <MenuIcon className="h-6 w-6" aria-hidden />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]"
          />
          <div className="relative h-full w-72 max-w-[85vw] bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="absolute top-4 right-4 rounded-full p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900"
            >
              <CloseIcon className="h-5 w-5" aria-hidden />
            </button>
            {panel}
          </div>
        </div>
      )}

      <main className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className={cn('mx-auto w-full', wide ? 'max-w-7xl' : 'max-w-5xl')}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
