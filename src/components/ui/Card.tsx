import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('rounded-2xl border border-ink-200/80 bg-white', className)}>{children}</div>
  )
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-ink-100 p-5 sm:p-6', className)}>
      <div className="space-y-1">
        <h2 className="text-lg font-extrabold tracking-[-0.02em] text-ink-900">{title}</h2>
        {description && <p className="text-sm text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('p-5 sm:p-6', className)}>{children}</div>
}

/** Conteneur en arche — forme signature de la direction artistique. */
export function Arch({
  className,
  flat,
  children,
}: {
  className?: string
  flat?: boolean
  children?: ReactNode
}) {
  return (
    <div className={cn('overflow-hidden', flat ? 'arch-sm' : 'arch', className)}>{children}</div>
  )
}
