import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckIcon } from '../../components/ui/icons'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Field'
import { useAuth } from '../../store/auth'

export function ForgotPassword() {
  const requestPasswordReset = useAuth((state) => state.requestPasswordReset)

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [envoyeA, setEnvoyeA] = useState<string>()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const adresse = email.trim()
    if (!adresse.includes('@')) {
      setError('Indiquez une adresse e-mail valide.')
      return
    }

    setSubmitting(true)
    const result = await requestPasswordReset(adresse)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      return
    }
    setEnvoyeA(adresse)
  }

  return (
    <AuthLayout
      title="Mot de passe oublié"
      subtitle="Indiquez votre adresse : nous vous enverrons un lien pour en choisir un nouveau."
      footer={
        <>
          Vous vous en souvenez ?{' '}
          <Link to="/auth/login" className="font-bold text-brand-600 hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      {envoyeA ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white"
              aria-hidden
            >
              <CheckIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-extrabold tracking-[-0.01em] text-ink-900">Message envoyé</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">
                Si un compte existe pour{' '}
                <strong className="font-bold break-all text-ink-900">{envoyeA}</strong>, un lien
                vient d’y être envoyé. Ouvrez-le pour choisir un nouveau mot de passe.
              </p>
            </div>
          </div>

          <p className="text-sm text-ink-500">
            Le message n’arrive pas ? Vérifiez vos courriers indésirables. Le lien n’est valable que
            pendant une heure.
          </p>
        </div>
      ) : (
        <form onSubmit={(event) => void handleSubmit(event)} noValidate className="space-y-5">
          <Input
            label="Adresse e-mail"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError(undefined)
            }}
            error={error}
          />

          <Button type="submit" size="lg" full loading={submitting}>
            Envoyer le lien
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
