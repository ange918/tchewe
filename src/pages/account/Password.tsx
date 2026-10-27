import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { Input } from '../../components/ui/Field'
import { toast } from '../../lib/toast'
import { MOT_DE_PASSE_MINIMUM, useAuth } from '../../store/auth'

/**
 * Changement de mot de passe depuis son espace. Servi aux deux espaces —
 * porteur et back-office — pour que la marche à suivre soit la même partout.
 */
export function Password() {
  const changePassword = useAuth((state) => state.changePassword)
  const user = useAuth((state) => state.user)

  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const trouves: typeof errors = {}
    if (!current) trouves.current = 'Saisissez votre mot de passe actuel.'
    if (next.length < MOT_DE_PASSE_MINIMUM) {
      trouves.next = `${MOT_DE_PASSE_MINIMUM} caractères minimum.`
    } else if (next === current) {
      trouves.next = 'Le nouveau mot de passe est identique à l’actuel.'
    }
    if (confirm !== next) trouves.confirm = 'Les deux saisies diffèrent.'

    setErrors(trouves)
    if (Object.keys(trouves).length > 0) return

    setSubmitting(true)
    const result = await changePassword(current, next)
    setSubmitting(false)

    if (!result.ok) {
      setErrors({ current: result.error })
      return
    }

    setCurrent('')
    setNext('')
    setConfirm('')
    toast.success('Mot de passe modifié', 'Utilisez-le à votre prochaine connexion.')
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-3xl">
          Mot de passe
        </h1>
        <p className="mt-1 text-ink-600">Compte {user?.email}</p>
      </div>

      <Card>
        <CardHeader
          title="Changer de mot de passe"
          description="Votre mot de passe actuel est demandé : sans lui, une session laissée ouverte suffirait à vous en exclure."
        />
        <CardBody>
          <form onSubmit={(event) => void handleSubmit(event)} noValidate className="space-y-5">
            <Input
              label="Mot de passe actuel"
              type="password"
              autoComplete="current-password"
              value={current}
              onChange={(event) => {
                setCurrent(event.target.value)
                setErrors((c) => ({ ...c, current: undefined }))
              }}
              error={errors.current}
            />

            <Input
              label="Nouveau mot de passe"
              type="password"
              autoComplete="new-password"
              value={next}
              onChange={(event) => {
                setNext(event.target.value)
                setErrors((c) => ({ ...c, next: undefined }))
              }}
              error={errors.next}
              hint={errors.next ? undefined : `${MOT_DE_PASSE_MINIMUM} caractères minimum`}
            />

            <Input
              label="Confirmation"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => {
                setConfirm(event.target.value)
                setErrors((c) => ({ ...c, confirm: undefined }))
              }}
              error={errors.confirm}
            />

            <Button type="submit" size="lg" full loading={submitting}>
              Enregistrer le nouveau mot de passe
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
