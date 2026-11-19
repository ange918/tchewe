import { useState, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  BellIcon,
  CloseIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
} from '../ui/icons'
import { Logo } from '../ui/Logo'
import { cn } from '../../lib/utils'
import type { SidebarItem } from './SidebarShell'
import { AdminQueryContext } from './adminQuery'

const SPRING = { type: 'spring' as const, stiffness: 320, damping: 28 }

function SearchField({
  value,
  onChange,
  id,
}: {
  value: string
  onChange: (value: string) => void
  id: string
}) {
  return (
    <div className="relative">
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-500"
        aria-hidden
      />
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Rechercher un dossier…"
        aria-label="Rechercher un dossier"
        className="h-11 w-full rounded-full border border-ink-200 bg-ink-50 pr-4 pl-10 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
      />
    </div>
  )
}

/**
 * Coquille du back-office : barre fixe, en-tête court, tiroir sur téléphone
 * et barre du bas pour les trois tâches les plus fréquentes.
 */
export function AdminShell({
  items,
  firstName,
  email,
  pending,
  pendingTo,
  onLogout,
}: {
  items: SidebarItem[]
  firstName: string
  email?: string
  pending: number
  pendingTo: string
  onLogout: () => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const reduced = useReducedMotion()
  const { pathname } = useLocation()
  const initials = firstName.slice(0, 1).toUpperCase() || 'A'

  const panel = (
    <div className="flex h-full flex-col gap-6 p-5">
      <NavLink to="/admin" aria-label="Tableau de bord" onClick={() => setOpen(false)}>
        <Logo />
      </NavLink>
      <div>
        <p className="text-sm text-ink-600">Bon retour,</p>
        <p className="text-lg font-extrabold tracking-[-0.03em] text-ink-900">{firstName}</p>
      </div>
      <SearchField id="admin-search-side" value={query} onChange={setQuery} />
      <nav aria-label="Back-office" className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {items.map(({ to, label, icon: Icon, exact, count }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={exact}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-bold transition duration-200',
                    isActive ? 'bg-brand-600 text-white shadow-sm' : 'text-ink-700 hover:bg-ink-50',
                  )
                }
              >
                <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{label}</span>
                {count !== undefined && (
                  <span className="text-sm font-extrabold tabular-nums opacity-80">{count}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="rounded-2xl bg-brand-600 p-5 text-white shadow-[0_12px_30px_-16px_rgba(61,43,232,0.8)]">
        <p className="text-sm font-bold text-brand-100">À traiter</p>
        <p className="mt-1 text-3xl font-extrabold tracking-[-0.04em]">{pending}</p>
        <p className="mt-1 text-sm leading-relaxed text-brand-100">
          Nouveaux dossiers et preuves qui attendent une décision.
        </p>
        <NavLink
          to={pendingTo}
          onClick={() => setOpen(false)}
          className="mt-4 inline-flex h-10 items-center rounded-full bg-white px-4 text-sm font-bold text-brand-700 transition duration-200 active:scale-[0.97]"
        >
          Ouvrir la liste
        </NavLink>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-ink-600 transition duration-200 hover:bg-ink-50"
      >
        <LogOutIcon className="h-4 w-4" aria-hidden />
        Se déconnecter
      </button>
    </div>
  )

  return (
    <AdminQueryContext.Provider value={{ query, setQuery }}>
      <div className="min-h-screen bg-ink-50 lg:grid lg:grid-cols-[17rem_1fr]">
        <aside className="hidden border-r border-ink-100 bg-white lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto">
          {panel}
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-100/80 bg-ink-50/90 px-4 backdrop-blur-md sm:px-6">
            <button
              type="button"
              className="rounded-full p-2 text-ink-700 lg:hidden"
              aria-label="Ouvrir le menu"
              onClick={() => setOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <div className="min-w-0 flex-1 lg:hidden">
              <SearchField id="admin-search-top" value={query} onChange={setQuery} />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <NavLink
                to={pendingTo}
                aria-label={pending > 0 ? `${pending} éléments à traiter` : 'Aucune notification'}
                className="relative rounded-full p-2 text-ink-700 transition duration-200 hover:bg-white"
              >
                <BellIcon className="h-5 w-5" />
                {pending > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-brand-600" />
                )}
              </NavLink>
              <NavLink
                to="/admin/mot-de-passe"
                aria-label="Mot de passe"
                className="rounded-full p-2 text-ink-700 transition duration-200 hover:bg-white"
              >
                <SettingsIcon className="h-5 w-5" />
              </NavLink>
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white"
                title={email}
              >
                {initials}
              </span>
            </div>
          </header>

          <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={reduced ? { duration: 0.15 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <nav
          aria-label="Raccourcis"
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-ink-100 bg-white lg:hidden"
        >
          {['/admin', '/admin/nouveaux', '/admin/preuves']
            .map((to) => items.find((item) => item.to === to))
            .filter((item): item is SidebarItem => item !== undefined)
            .map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-2 py-2.5 text-sm font-bold',
                  isActive ? 'text-brand-700' : 'text-ink-600',
                )
              }
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="max-w-full truncate">{label.split(' ')[0]}</span>
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-1 px-2 py-2.5 text-sm font-bold text-ink-600"
          >
            <MenuIcon className="h-5 w-5" aria-hidden />
            Menu
          </button>
        </nav>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            <button
              type="button"
              aria-label="Fermer le menu"
              className="absolute inset-0 bg-ink-900/40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={reduced ? { opacity: 0 } : { x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={reduced ? { duration: 0.15 } : SPRING}
              className="relative h-full w-80 max-w-[88vw] overflow-y-auto bg-white shadow-2xl"
            >
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 rounded-full p-2 text-ink-600"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
              {panel}
            </motion.div>
          </div>
        )}
      </div>
    </AdminQueryContext.Provider>
  )
}

export function SoftCard({
  children,
  className,
  delay = 0,
  tone = 'paper',
}: {
  children: ReactNode
  className?: string
  delay?: number
  tone?: 'paper' | 'ink'
}) {
  const reduced = useReducedMotion()
  return (
    <motion.section
      className={cn(
        'rounded-2xl p-5 shadow-[0_12px_40px_-18px_rgba(11,11,15,0.18)] sm:p-6',
        tone === 'ink'
          ? 'border border-transparent bg-ink-900 text-white'
          : 'border border-ink-100/80 bg-white',
        className,
      )}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      whileHover={reduced ? undefined : { y: -5 }}
      transition={reduced ? { duration: 0.15 } : { ...SPRING, delay }}
    >
      {children}
    </motion.section>
  )
}
