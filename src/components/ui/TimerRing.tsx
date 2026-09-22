import { cn } from '../../lib/utils'

/**
 * Anneau de progression du chrono. Le tracé est piloté par `strokeDashoffset`,
 * donc animé par le compositeur : pas de recalcul de layout à chaque frame.
 */
export function TimerRing({
  remainingMs,
  durationMs,
  className,
}: {
  remainingMs: number
  durationMs: number
  className?: string
}) {
  const ratio = durationMs > 0 ? Math.max(0, Math.min(1, remainingMs / durationMs)) : 0
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const seconds = Math.ceil(remainingMs / 1000)
  const urgent = remainingMs <= 3000

  return (
    <div className={cn('relative h-20 w-20 shrink-0', className)}>
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-ink-100" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className={cn('transition-colors', urgent ? 'text-rose-500' : 'text-brand-600')}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center"
        role="timer"
        aria-live="off"
        aria-label={`${seconds} secondes restantes`}
      >
        <span
          className={cn(
            'text-2xl font-extrabold tabular-nums tracking-[-0.04em]',
            urgent ? 'text-rose-600' : 'text-ink-900',
          )}
        >
          {seconds}
        </span>
      </div>
    </div>
  )
}
