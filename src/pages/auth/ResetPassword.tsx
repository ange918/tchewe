import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Field'
import { toast } from '../../lib/toast'
import { MOT_DE_PASSE_MINIMUM, useAuth } from '../../store/auth'

/**
 * Arrivée du lien de secours. Supabase a ouvert une session au passage : la
 * présence d'un utilisateur vaut donc preuve que le lien était valable, et son
 * absence que le lien a expiré ou a déjà servi.
 */
export function ResetPassword() {
  const navigate = useNavigate()
  const setPassword = useAuth((state) => state.setPassword)
  const user = useAuth((state) => state.user)
  const loading = useAuth((state) => state.loading)

  const [password, setPasswordValue] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const next: typeof errors = {}
    if (password.length < MOT_DE_PASSE_MINIMUM) {
      next.password = `${MOT_DE_PASSE_MINIMUM} caractères minimum.`
    }
    if (confirm !== password) next.confirm = 'Les deux saisies diffèrent.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    const result = await setPassword(password)
    setSubmitting(false)

    if (!result.ok) {
      setErrors({ password: result.error })
      return
    }

    toast.success('Mot de passe enregistré', 'Vous pouvez désormais vous connecter avec.')
    navigate(user?.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
  }

  if (loading) {
    return (
      <AuthLayout title="Nouveau mot de passe" subtitle="Vérification du lien…">
        <p className="text-sm text-ink-500">Un instant.</p>
      </AuthLayout>
    )
  }

  if (!user) {
    return (
      <AuthLayout
        title="Lien expiré"
        subtitle="Ce lien n’est plus valable."
        footer={
          <Link to="/auth/login" className="font-bold text-brand-600 hover:underline">
            Retour à la connexion
          </Link>
        }
      >
        <div className="space-y-5">
          <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-ink-700">
            Un lien de réinitialisation ne vaut qu’une heure, et ne sert qu’une fois. Demandez-en un
            nouveau pour continuer.
          </p>
          <Button type="button" size="lg" full onClick={() => navigate('/auth/mot-de-passe-oublie')}>
            Demander un nouveau lien
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Nouveau mot de passe"
      subtitle={`Choisissez le mot de passe du compte ${user.email}.`}
    >
      <form onSubmit={(event) => void handleSubmit(event)} noValidate className="space-y-5">
        <Input
          label="Nouveau mot de passe"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => {
            setPasswordValue(event.target.value)
            setErrors((current) => ({ ...current, password: undefined }))
          }}
          error={errors.password}
          hint={errors.password ? undefined : `${MOT_DE_PASSE_MINIMUM} caractères minimum`}
        />

        <Input
          label="Confirmation"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => {
            setConfirm(event.target.value)
            setErrors((current) => ({ ...current, confirm: undefined }))
          }}
          error={errors.confirm}
        />

        <Button type="submit" size="lg" full loading={submitting}>
          Enregistrer
        </Button>
      </form>
    </AuthLayout>
  )
}
