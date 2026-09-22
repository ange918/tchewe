import { cn } from '../../lib/utils'

/** Marque INNOVA FUND : anneaux concentriques et point central (cible / impact). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn('h-8 w-8', className)}>
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M16 6.5v4M16 21.5v4M6.5 16h4M21.5 16h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="3.4" fill="currentColor" />
    </svg>
  )
}

export function Logo({
  className,
  labelClassName,
}: {
  className?: string
  labelClassName?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-brand-600', className)}>
      <LogoMark />
      <span
        className={cn(
          'text-[1.35rem] font-extrabold leading-none tracking-[-0.045em]',
          labelClassName,
        )}
      >
        INNOVA<span className="font-medium"> FUND</span>
      </span>
    </span>
  )
}
