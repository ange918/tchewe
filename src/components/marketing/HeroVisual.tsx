import { ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import { Arch } from '../ui/Card'
import { LogoMark } from '../ui/Logo'

/**
 * Visuel principal en arche : la forme signature de la charte.
 * Aucun asset externe — le motif est dessiné en CSS/SVG pour rester léger.
 */
export function HeroVisual() {
  return (
    <div className="relative">
      <Arch className="relative aspect-4/3 w-full bg-brand-600 sm:aspect-16/10 lg:aspect-4/3">
        <div className="absolute inset-0 bg-linear-to-br from-brand-500 via-brand-600 to-brand-800" />
        <div className="grid-motif absolute inset-0 opacity-40" />

        {/* Anneaux concentriques, écho de la marque */}
        <svg
          viewBox="0 0 400 400"
          aria-hidden
          className="absolute -right-16 -bottom-20 h-[115%] w-auto text-white/15"
        >
          <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="110" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="30" fill="currentColor" />
        </svg>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-inset ring-white/25">
            <LogoMark className="h-4 w-4" />
            Édition 2026 · dossiers ouverts
          </span>
          <p className="max-w-sm text-lg leading-snug font-extrabold tracking-[-0.02em] text-white sm:text-xl">
            Une évaluation en trois sessions, puis le virement de votre subvention.
          </p>
        </div>
      </Arch>

      {/* Cartes flottantes : preuve de traction */}
      <div className="pointer-events-none absolute -top-4 -left-3 hidden rounded-2xl bg-white p-3.5 shadow-xl shadow-ink-900/10 ring-1 ring-ink-100 sm:block">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-extrabold text-ink-900">10 000 €</p>
            <p className="text-xs text-ink-500">subvention maximale</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-3 bottom-16 hidden rounded-2xl bg-white p-3.5 shadow-xl shadow-ink-900/10 ring-1 ring-ink-100 sm:block lg:bottom-24">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-extrabold text-ink-900">Non remboursable</p>
            <p className="text-xs text-ink-500">sous conditions du programme</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute top-1/3 -left-6 hidden rounded-2xl bg-ink-900 p-3.5 shadow-xl shadow-ink-900/20 lg:block">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-extrabold text-white">3 phases</p>
            <p className="text-xs text-ink-400">J0 · J+2 · J+4</p>
          </div>
        </div>
      </div>
    </div>
  )
}
