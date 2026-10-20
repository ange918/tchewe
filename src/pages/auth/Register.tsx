import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckIcon, ShieldIcon } from '../../components/ui/icons'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { Button } from '../../components/ui/Button'
import { Checkbox, Input } from '../../components/ui/Field'
import { toast } from '../../lib/toast'
import { useAuth } from '../../store/auth'

interface FormState {
  lastName: string
  firstName: string
  email: string
  birthDate: string
  password: string
  confirm: string
}

const EMPTY: FormState = {
  lastName: '',
  firstName: '',
  email: '',
  birthDate: '',
  password: '',
  confirm: '',
}

/** Rappels contractuels que le candidat doit accepter explicitement. */
const TERMS = [
  'La subvention accordée est non remboursable, sous réserve du respect des conditions du programme.',
  'Je m’engage à reverser une part de mes dividendes aux ONG partenaires du programme.',
  'Je devrai déposer un apport de garantie équivalent à 30 % du montant sollicité avant le virement.',
]

const MIN_AGE = 18

export function Register() {
  const navigate = useNavigate()
  const register = useAuth((state) => state.register)

  const [form, setForm] = useState<FormState>(EMPTY)
  const [accepted, setAccepted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'terms', string>>>({})
  /** Adresse à confirmer : renseignée quand le compte est créé sans session. */
  const [awaitingConfirmation, setAwaitingConfirmation] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function validate() {
    const next: Partial<Record<keyof FormState | 'terms', string>> = {}

    if (!form.lastName.trim()) next.lastName = 'Indiquez votre nom.'
    if (!form.firstName.trim()) next.firstName = 'Indiquez votre prénom.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      next.email = 'Adresse e-mail invalide.'
    }

    if (!form.birthDate) {
      next.birthDate = 'Indiquez votre date de naissance.'
    } else {
      const birth = new Date(form.birthDate)
      const limit = new Date()
      limit.setFullYear(limit.getFullYear() - MIN_AGE)
      if (Number.isNaN(birth.getTime())) next.birthDate = 'Date invalide.'
      else if (birth > limit) next.birthDate = `Vous devez avoir au moins ${MIN_AGE} ans pour candidater.`
    }

    if (form.password.length < 8) {
      next.password = 'Le mot de passe doit contenir au moins 8 caractères.'
    }
    if (form.confirm !== form.password) {
      next.confirm = 'Les deux mots de passe ne correspondent pas.'
    }
    if (!accepted) {
      next.terms = 'Vous devez lire et accepter les conditions générales pour continuer.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      birthDate: form.birthDate,
      password: form.password,
    })
    setSubmitting(false)

    // Compte créé mais session non ouverte : la confirmation par e-mail est
    // active. C'est un succès — il ne doit pas atterrir dans le champ e-mail.
    if (result.ok === 'confirm-email') {
      setAwaitingConfirmation(form.email.trim())
      return
    }

    if (!result.ok) {
      setErrors({ email: result.error })
      return
    }

    const isAdmin = result.user.role === 'admin'
    toast.success(
      'Compte créé',
      isAdmin
        ? 'Vous accédez au back-office d’instruction des dossiers.'
        : 'Vous pouvez maintenant présenter votre projet.',
    )
    navigate(isAdmin ? '/admin/dossiers' : '/dashboard/submission')
  }

  return (
    <AuthLayout
      title="Créer mon compte"
      subtitle="Quelques informations suffisent pour ouvrir votre dossier de candidature."
      footer={
        <>
          Vous avez déjà un compte ?{' '}
          <Link to="/auth/login" className="font-bold text-brand-600 hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      {awaitingConfirmation ? (
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white"
              aria-hidden
            >
              <CheckIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-extrabold tracking-[-0.01em] text-ink-900">Compte créé</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">
                Un lien de confirmation vient d’être envoyé à{' '}
                <strong className="font-bold break-all text-ink-900">{awaitingConfirmation}</strong>.
                Ouvrez-le pour activer votre compte, puis connectez-vous.
              </p>
            </div>
          </div>

          <p className="text-sm text-ink-500">
            Le message n’arrive pas ? Vérifiez vos courriers indésirables — l’expéditeur peut y
            atterrir lors du premier envoi.
          </p>

          <Button type="button" size="lg" full onClick={() => navigate('/auth/login')}>
            Aller à la connexion
          </Button>
        </div>
      ) : (
      <form onSubmit={(event) => void handleSubmit(event)} noValidate className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nom"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(event) => update('lastName', event.target.value)}
            error={errors.lastName}
          />
          <Input
            label="Prénom"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(event) => update('firstName', event.target.value)}
            error={errors.firstName}
          />
        </div>

        <Input
          label="Adresse e-mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
          error={errors.email}
        />

        <Input
          label="Date de naissance"
          type="date"
          autoComplete="bday"
          value={form.birthDate}
          onChange={(event) => update('birthDate', event.target.value)}
          error={errors.birthDate}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Mot de passe"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => update('password', event.target.value)}
            error={errors.password}
            hint={errors.password ? undefined : '8 caractères minimum'}
          />
          <Input
            label="Confirmation"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(event) => update('confirm', event.target.value)}
            error={errors.confirm}
          />
        </div>

        {/* Composant légal — acceptation explicite et obligatoire */}
        <div className="rounded-2xl border border-ink-200 bg-ink-50/60 p-4">
          <p className="flex items-center gap-2 text-sm font-extrabold text-ink-900">
            <ShieldIcon className="h-4 w-4 text-brand-600" aria-hidden />
            Conditions générales du programme
          </p>
          <ul className="mt-3 space-y-2">
            {TERMS.map((term) => (
              <li key={term} className="flex gap-2.5 text-sm leading-relaxed text-ink-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden />
                <span>{term}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-ink-200 pt-4">
            <Checkbox
              checked={accepted}
              onChange={(value) => {
                setAccepted(value)
                setErrors((current) => ({ ...current, terms: undefined }))
              }}
              error={errors.terms}
            >
              J’ai lu et j’accepte les{' '}
              <Link to="/conditions" className="font-bold text-brand-600 hover:underline">
                conditions générales
              </Link>{' '}
              et la{' '}
              <Link to="/a-propos#confidentialite" className="font-bold text-brand-600 hover:underline">
                charte de confidentialité
              </Link>
              , dont les trois engagements rappelés ci-dessus.
            </Checkbox>
          </div>
        </div>

        <Button type="submit" size="lg" full loading={submitting}>
          Créer mon compte
        </Button>
      </form>
      )}
    </AuthLayout>
  )
}
