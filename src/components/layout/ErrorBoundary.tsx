import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Sans ce filet, la moindre exception pendant le rendu vide la page et
 * n'affiche rien : ni message, ni moyen de repartir. Le porteur comme
 * l'administrateur se retrouvent devant un écran blanc muet.
 *
 * Le détail technique est affiché volontairement : la plateforme est jeune, et
 * une erreur lisible vaut mieux qu'un blanc à signaler de mémoire.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erreur de rendu :', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50 p-6">
        <div className="w-full max-w-lg rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-extrabold tracking-[-0.02em] text-ink-900">
            Cette page n’a pas pu s’afficher
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Une erreur est survenue pendant l’affichage. Rechargez la page ; si elle revient,
            transmettez le message ci-dessous.
          </p>

          <pre className="mt-4 max-h-48 overflow-auto rounded-xl bg-ink-900 p-3.5 text-xs leading-relaxed whitespace-pre-wrap text-ink-100">
            {error.message}
          </pre>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Recharger la page
            </button>
            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-bold text-ink-700 transition hover:bg-ink-100"
            >
              Retour à l’accueil
            </button>
          </div>
        </div>
      </div>
    )
  }
}
