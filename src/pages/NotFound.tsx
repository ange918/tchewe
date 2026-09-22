import { ButtonLink } from '../components/ui/Button'
import { LogoMark } from '../components/ui/Logo'

export function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <LogoMark className="h-12 w-12 text-brand-600" />
      <div>
        <p className="text-sm font-bold tracking-[0.12em] text-ink-400 uppercase">Erreur 404</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-4xl">
          Cette page n’existe pas.
        </h1>
        <p className="mt-2 text-ink-600">
          Le lien est peut-être obsolète ou la page a été déplacée.
        </p>
      </div>
      <ButtonLink to="/" size="lg">
        Retour à l’accueil
      </ButtonLink>
    </main>
  )
}
