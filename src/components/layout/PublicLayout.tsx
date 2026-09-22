import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo, LogoMark } from '../ui/Logo'
import { ButtonLink } from '../ui/Button'
import { useAuth } from '../../store/auth'
import { cn } from '../../lib/utils'

const LINKS = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Comment ça marche', to: '/#processus' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const user = useAuth((state) => state.user)
  const { pathname, hash } = useLocation()

  const memberLink = user
    ? { to: user.role === 'admin' ? '/admin/dossiers' : '/dashboard', label: 'Mon espace' }
    : { to: '/auth/login', label: 'Connexion / Espace Membre' }

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-18">
        <Link to="/" className="shrink-0" aria-label="INNOVA FUND — accueil">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const active = link.to.includes('#')
              ? pathname === '/' && hash === '#processus'
              : pathname === link.to
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={cn(
                    'rounded-lg px-3.5 py-2 text-[0.95rem] font-semibold transition',
                    active ? 'text-brand-600' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
                  )}
                >
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>

        <div className="hidden lg:block">
          <ButtonLink to={memberLink.to} size="sm" pill>
            {memberLink.label}
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="rounded-lg p-2 text-ink-700 transition hover:bg-ink-100 lg:hidden"
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-100 bg-white px-4 pt-2 pb-4 lg:hidden">
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 font-semibold text-ink-700 transition hover:bg-ink-50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3" onClick={() => setOpen(false)}>
            <ButtonLink to={memberLink.to} full pill>
              {memberLink.label}
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  )
}

const FOOTER_GROUPS = [
  {
    title: 'Programme',
    links: [
      { label: 'Le dispositif', to: '/a-propos' },
      { label: 'Comment ça marche', to: '/#processus' },
      { label: 'Critères d’éligibilité', to: '/a-propos#eligibilite' },
      { label: 'Présenter mon projet', to: '/auth/register' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Questions fréquentes', to: '/a-propos#faq' },
      { label: 'Espace membre', to: '/auth/login' },
      { label: 'Nos bailleurs', to: '/a-propos#bailleurs' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Conditions générales', to: '/a-propos#cgu' },
      { label: 'Charte de confidentialité', to: '/a-propos#confidentialite' },
      { label: 'Mentions légales', to: '/a-propos#mentions' },
    ],
  },
]

function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm space-y-4">
            <span className="inline-flex items-center gap-2 text-white">
              <LogoMark className="h-8 w-8" />
              <span className="text-[1.35rem] font-extrabold leading-none tracking-[-0.045em]">
                INNOVA<span className="font-medium"> FUND</span>
              </span>
            </span>
            <p className="text-sm leading-relaxed text-ink-400">
              Programme d’appui au financement des projets à fort impact social et environnemental.
              Subventions non remboursables jusqu’à 10 000 €, édition 2026.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-extrabold tracking-[-0.01em] text-white">{group.title}</h3>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-ink-400 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 INNOVA FUND — Programme financé par ses bailleurs institutionnels et privés.</p>
          <p>
            La subvention est non remboursable. Un apport de garantie de 30 % et un engagement de
            reversement de dividendes aux ONG partenaires conditionnent le versement.
          </p>
        </div>
      </div>
    </footer>
  )
}

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
