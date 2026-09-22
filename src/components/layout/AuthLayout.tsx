import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, CheckCircleIcon } from '../ui/icons'
import { Logo, LogoMark } from '../ui/Logo'
import { MEDIA, MEDIA_ALT } from '../../data/media'

const HIGHLIGHTS = [
  'Subvention non remboursable jusqu’à 650 000 €',
  'Évaluation en 3 sessions chronométrées (J0, J+2, J+4)',
  'Suivi de votre dossier en temps réel dans votre espace',
]

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1fr_minmax(0,34rem)]">
      {/* Panneau de marque — masqué sur mobile pour laisser la place au formulaire */}
      <aside className="relative hidden overflow-hidden bg-brand-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <img
          src={MEDIA.authPanel}
          alt={MEDIA_ALT.authPanel}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Voile : le texte du panneau reste lisible quelle que soit l'image */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,7,0.92)_0%,rgba(5,5,7,0.68)_34%,rgba(19,14,77,0.38)_66%,rgba(19,14,77,0.3)_100%)]" />
        <div className="grid-motif absolute inset-0 opacity-20" aria-hidden />

        <Link to="/" className="relative inline-flex items-center gap-2 text-white">
          <LogoMark />
          <span className="text-[1.35rem] font-extrabold leading-none tracking-[-0.045em]">
            INNOVA<span className="font-medium"> FUND</span>
          </span>
        </Link>

        <div className="relative max-w-md">
          <p className="text-[2.6rem] leading-[0.98] font-extrabold tracking-[-0.035em] text-white">
            Soyez le moteur de ce qui vient ensuite.
          </p>
          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-brand-100">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-white" aria-hidden />
                <span className="text-[0.98rem] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-brand-200">
          Édition 2026 — programme d’appui au financement des projets à fort impact.
        </p>
      </aside>

      <main className="flex min-h-screen flex-col bg-white px-4 py-8 sm:px-8 lg:min-h-0 lg:justify-center lg:px-12 lg:py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center justify-between lg:hidden">
            <Link to="/" aria-label="INNOVA FUND — accueil">
              <Logo />
            </Link>
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition hover:text-brand-600 lg:mt-0"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden />
            Retour à l’accueil
          </Link>

          <h1 className="mt-6 text-3xl text-ink-900 sm:text-4xl">{title}</h1>
          <p className="mt-2 text-ink-600">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 border-t border-ink-100 pt-6 text-sm text-ink-600">{footer}</div>
        </div>
      </main>
    </div>
  )
}
