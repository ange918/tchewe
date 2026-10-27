import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Field'
import { toast } from '../../lib/toast'
import { useAuth } from '../../store/auth'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuth((state) => state.login)
  const user = useAuth((state) => state.user)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string } | null)?.from

  // Le lien de confirmation d'e-mail aboutit ici avec une session déjà ouverte
  // dans l'adresse : inutile de redemander un mot de passe à quelqu'un qui
  // vient d'être authentifié.
  if (user) {
    return <Navigate to={from ?? (user.role === 'admin' ? '/admin' : '/dashboard')} replace />
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    const result = await login(email, password)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    toast.success(`Bienvenue, ${result.user.firstName}`)
    const fallback = result.user.role === 'admin' ? '/admin' : '/dashboard'
    navigate(from ?? fallback, { replace: true })
  }

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Accédez à votre espace pour suivre l’avancement de votre dossier."
      footer={
        <>
          Pas encore inscrit ?{' '}
          <Link to="/auth/register" className="font-bold text-brand-600 hover:underline">
            Créer un compte
          </Link>
        </>
      }
    >
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

        <Input
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setError(undefined)
          }}
        />

        <div className="-mt-2 text-right">
          <Link
            to="/auth/mot-de-passe-oublie"
            className="text-sm font-bold text-brand-600 hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <Button type="submit" size="lg" full loading={submitting}>
          Se connecter
        </Button>


      </form>
    </AuthLayout>
  )
}
