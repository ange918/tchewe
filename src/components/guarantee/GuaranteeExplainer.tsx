import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { InstitutionIcon, ShieldIcon, UploadIcon, WalletIcon } from '../ui/icons'
import { GUARANTEE_FAQ, GUARANTEE_REMINDER, GUARANTEE_STEPS } from '../../lib/guarantee'
import { cn } from '../../lib/utils'

const ICONS = [InstitutionIcon, WalletIcon, UploadIcon] as const

/**
 * Le rappel qui lève l'ambiguïté : les 30 % restent sur le compte du porteur.
 * Trois gestes, puis la question que tout le monde se pose.
 */
export function GuaranteeExplainer({
  amountLabel,
  heading,
  compact = false,
  className,
}: {
  /** Montant déjà calculé, par exemple « 3 000 € ». */
  amountLabel?: string
  heading?: string
  compact?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <section
      className={cn(
        'grain overflow-hidden rounded-3xl border border-brass-100 bg-brass-50',
        compact ? 'p-4 sm:p-6' : 'p-6 sm:p-8',
        className,
      )}
      aria-label="Garantie de 30 %"
    >
      <div className="relative">
        <p className="text-sm font-bold tracking-[0.08em] text-brass-800 uppercase">
          Votre argent, votre compte
        </p>
        {heading && (
          <h2 className="mt-3 max-w-xl text-3xl leading-[1.05] text-ink-900 sm:text-4xl">{heading}</h2>
        )}
        <p className={cn('max-w-2xl text-base leading-relaxed text-ink-700', heading ? 'mt-4' : 'mt-3')}>
          Ces {amountLabel ? <strong className="font-extrabold text-ink-900">{amountLabel}</strong> : '30 %'}{' '}
          ne sont pas payés à la plateforme, ni à personne d’autre. Vous les déposez sur un compte
          ouvert <strong className="font-extrabold text-ink-900">à votre nom</strong>, dans une banque
          agréée de votre choix. {GUARANTEE_REMINDER}
        </p>

        <ol className={cn('grid gap-4', compact ? 'mt-4 sm:grid-cols-3' : 'mt-6 sm:grid-cols-3')}>
          {GUARANTEE_STEPS.map((step, index) => {
            const Icon = ICONS[index] ?? ShieldIcon
            return (
              <li key={step.title} className="rounded-2xl bg-white/90 p-4 ring-1 ring-brass-100">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="font-mono text-sm font-bold text-brass-800">0{index + 1}</span>
                </div>
                <h3 className="mt-4 text-base text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.text}</p>
              </li>
            )
          })}
        </ol>

        <div className="mt-4 rounded-2xl bg-white ring-1 ring-brass-100">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-4 text-left transition duration-200 active:scale-[0.97]"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="text-base font-bold text-ink-900">{GUARANTEE_FAQ.question}</span>
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition duration-200',
                open ? 'bg-brand-600 text-white' : 'bg-brass-100 text-brass-800',
              )}
              aria-hidden
            >
              {open ? '–' : '+'}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 320, damping: 28 }}
                className="overflow-hidden"
              >
                <p className="px-4 pb-4 text-base leading-relaxed text-ink-700">{GUARANTEE_FAQ.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
