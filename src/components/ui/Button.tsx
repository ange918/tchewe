import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-bold tracking-[-0.01em] transition ' +
  'disabled:pointer-events-none disabled:opacity-50 active:translate-y-px select-none'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/25',
  secondary: 'bg-white text-brand-600 ring-1 ring-inset ring-brand-200 hover:bg-brand-50',
  ghost: 'text-ink-700 hover:bg-ink-100',
  dark: 'bg-ink-900 text-white hover:bg-ink-800',
  danger: 'bg-white text-rose-600 ring-1 ring-inset ring-rose-200 hover:bg-rose-50',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-[0.5rem]',
  md: 'h-11 px-5 text-[0.95rem] rounded-button',
  lg: 'h-13 px-7 text-base rounded-button',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  pill?: boolean
  loading?: boolean
  full?: boolean
  children?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  pill,
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
        pill && 'rounded-full',
        full && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  pill,
  full,
  className,
  children,
  external,
}: {
  to: string
  variant?: Variant
  size?: Size
  pill?: boolean
  full?: boolean
  className?: string
  children: ReactNode
  external?: boolean
}) {
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    pill && 'rounded-full',
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
