import { Lock, PartyPopper } from 'lucide-react'
import { Button } from '../ui/Button'
import { useDeadline } from '../../hooks/useCountdown'
import { splitDuration } from '../../lib/utils'
import { useApplication, type PhaseNumber } from '../../store/application'

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-3 text-center ring-1 ring-inset ring-white/15 sm:px-5">
      <p className="text-2xl font-extrabold tabular-nums tracking-[-0.04em] text-white sm:text-3xl">
        {String(value).padStart(2, '0')}
      </p>
      <p className="mt-0.5 text-[0.65rem] font-bold tracking-[0.1em] text-brand-200 uppercase">
        {label}
      </p>
    </div>
  )
}

/**
 * Écran de blocage entre deux phases : félicitations, compte à rebours de 48 h
 * et déverrouillage automatique de la session suivante.
 */
export function PhaseGate({
  completedPhase,
  nextPhase,
  unlockAt,
}: {
  completedPhase: PhaseNumber
  nextPhase: PhaseNumber
  unlockAt: number
}) {
  const unlockNow = useApplication((state) => state.unlockNow)
  const remaining = useDeadline(unlockAt)
  const { days, hours, minutes, seconds } = splitDuration(remaining)
  const ready = remaining <= 0

  return (
    <div className="overflow-hidden rounded-3xl bg-brand-600">
      <div className="relative px-6 py-10 sm:px-10 sm:py-14">
        <div className="grid-motif absolute inset-0 opacity-25" aria-hidden />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white ring-1 ring-inset ring-white/25">
            {ready ? <Lock className="h-3.5 w-3.5" aria-hidden /> : <PartyPopper className="h-3.5 w-3.5" aria-hidden />}
            Phase {completedPhase} validée
          </span>

          <h1 className="mt-5 max-w-2xl text-3xl leading-[1.05] text-white sm:text-4xl">
            {ready
              ? `La phase ${nextPhase} est déverrouillée.`
              : `Félicitations, vous avez réussi la phase ${completedPhase} !`}
          </h1>

          <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-brand-100">
            {ready
              ? 'Vous pouvez reprendre votre évaluation dès maintenant.'
              : `Veuillez revenir dans 48 heures pour débloquer la phase ${nextPhase}. Le compte à rebours ci-dessous vous indique le temps restant.`}
          </p>

          {!ready && (
            <div
              className="mt-8 grid max-w-md grid-cols-4 gap-2 sm:gap-3"
              role="timer"
              aria-label="Temps restant avant le déverrouillage de la phase suivante"
            >
              <Unit value={days} label="Jours" />
              <Unit value={hours} label="Heures" />
              <Unit value={minutes} label="Min" />
              <Unit value={seconds} label="Sec" />
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={unlockNow}
              className={ready ? '' : 'bg-white/10 text-white ring-white/25 hover:bg-white/20'}
            >
              {ready ? `Démarrer la phase ${nextPhase}` : `Débloquer maintenant (démo)`}
            </Button>
            {!ready && (
              <p className="text-xs text-brand-200">
                Raccourci de démonstration — en production, le déverrouillage est strictement
                calendaire.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
