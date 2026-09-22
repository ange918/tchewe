import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LoaderIcon } from './icons'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-[-0.01em] transition ' +
  'disabled:pointer-events-none disabled:opacity-50 active:translate-y-px select-none'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/25',
  secondary: 'bg-white text-brand-600 ring-1 ring-inset ring-brand-200 hover:bg-brand-50',
  ghost: 'text-ink-700 hover:bg-ink-100',
  dark: 'bg-ink-900 text-white hover:bg-ink-800',
  danger: 'bg-white text-rose-600 ring-1 ring-inset ring-rose-200 hover:bg-rose-50',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
}

// Tous les boutons sont entièrement arrondis : c'est la forme de la charte.
const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[0.95rem]',
  lg: 'h-13 px-8 text-base',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  full?: boolean
  children?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  full,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        full && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoaderIcon className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  full,
  className,
  children,
  external,
}: {
  to: string
  variant?: Variant
  size?: Size
  full?: boolean
  className?: string
  children: ReactNode
  external?: boolean
}) {
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    full && 'w-full',
    className,
  )

  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer noopener" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  )
}
