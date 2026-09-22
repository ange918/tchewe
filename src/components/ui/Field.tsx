import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { useId } from 'react'
import { cn } from '../../lib/utils'

const control =
  'w-full rounded-button border border-ink-200 bg-white px-3.5 py-2.5 text-[0.95rem] text-ink-900 ' +
  'placeholder:text-ink-400 transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 ' +
  'focus:outline-none disabled:bg-ink-50 disabled:text-ink-400'

function Shell({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label?: string
  hint?: string
  error?: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-bold text-ink-800">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-sm font-medium text-rose-600">{error}</p>
      ) : hint ? (
        <p className="text-sm text-ink-500">{hint}</p>
      ) : null}
    </div>
  )
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  suffix?: string
}

export function Input({ label, hint, error, suffix, className, id, ...props }: InputProps) {
  const generated = useId()
  const inputId = id ?? generated
  return (
    <Shell label={label} hint={hint} error={error} htmlFor={inputId}>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={cn(control, error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15', suffix && 'pr-12', className)}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm font-bold text-ink-400">
            {suffix}
          </span>
        )}
      </div>
    </Shell>
  )
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export function Textarea({ label, hint, error, className, id, ...props }: TextareaProps) {
  const generated = useId()
  const inputId = id ?? generated
  return (
    <Shell label={label} hint={hint} error={error} htmlFor={inputId}>
      <textarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cn(control, 'min-h-32 resize-y', error && 'border-rose-300', className)}
        {...props}
      />
    </Shell>
  )
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  hint?: string
  error?: string
}

export function Select({ label, hint, error, className, id, children, ...props }: SelectProps) {
  const generated = useId()
  const inputId = id ?? generated
  return (
    <Shell label={label} hint={hint} error={error} htmlFor={inputId}>
      <select id={inputId} className={cn(control, 'appearance-none pr-10', className)} {...props}>
        {children}
      </select>
    </Shell>
  )
}

export function Checkbox({
  checked,
  onChange,
  children,
  error,
  id,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
  error?: string
  id?: string
}) {
  const generated = useId()
  const inputId = id ?? generated
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          className={cn(
            'mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-[0.35rem] border-ink-300 text-brand-600',
            'focus:ring-4 focus:ring-brand-500/20',
            error && 'border-rose-400',
          )}
        />
        <label htmlFor={inputId} className="cursor-pointer text-sm leading-relaxed text-ink-700">
          {children}
        </label>
      </div>
      {error && <p className="mt-1.5 pl-8 text-sm font-medium text-rose-600">{error}</p>}
    </div>
  )
}
