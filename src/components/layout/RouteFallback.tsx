import { LogoMark } from '../ui/Logo'

/** Attente de chargement d'une route différée. */
export function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white" role="status">
      <span className="flex flex-col items-center gap-3 text-brand-600">
        <LogoMark className="h-10 w-10 animate-pulse" />
        <span className="sr-only">Chargement en cours</span>
      </span>
    </div>
  )
}
