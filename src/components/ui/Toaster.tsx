import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AlertIcon, CheckCircleIcon, CloseIcon, InfoIcon } from './icons'
import { cn } from '../../lib/utils'
import { useToastStore, type Toast, type ToastTone } from '../../lib/toast'

const tones: Record<ToastTone, { ring: string; icon: typeof InfoIcon; color: string }> = {
  success: { ring: 'ring-emerald-200', icon: CheckCircleIcon, color: 'text-emerald-600' },
  error: { ring: 'ring-rose-200', icon: AlertIcon, color: 'text-rose-600' },
  info: { ring: 'ring-brand-200', icon: InfoIcon, color: 'text-brand-600' },
}

function ToastItem({ toast: item }: { toast: Toast }) {
  const dismiss = useToastStore((state) => state.dismiss)
  const reduced = useReducedMotion()
  const { ring, icon: Icon, color } = tones[item.tone]

  useEffect(() => {
    const timeout = setTimeout(() => dismiss(item.id), 5000)
    return () => clearTimeout(timeout)
  }, [dismiss, item.id])

  return (
    <motion.div
      layout
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'pointer-events-auto flex w-full items-start gap-3 rounded-2xl bg-white p-4 shadow-lg shadow-ink-900/10 ring-1',
        ring,
      )}
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', color)} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink-900">{item.title}</p>
        {item.description && <p className="mt-0.5 text-sm text-ink-500">{item.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => dismiss(item.id)}
        aria-label="Fermer la notification"
        className="rounded-full p-1 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
      >
        <CloseIcon className="h-4 w-4" aria-hidden />
      </button>
    </motion.div>
  )
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-100 flex flex-col gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-90"
    >
      <AnimatePresence initial={false}>
        {toasts.map((item) => (
          <ToastItem key={item.id} toast={item} />
        ))}
      </AnimatePresence>
    </div>
  )
}
