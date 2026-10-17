import { useState } from 'react'
import { AlertIcon, ArrowRightIcon, CheckCircleIcon, ShieldIcon } from '../ui/icons'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { Dropzone } from '../ui/Dropzone'
import { cn, formatEuro } from '../../lib/utils'
import { toast } from '../../lib/toast'
import type { FileMeta } from '../../lib/fileVault'
import { GUARANTEE_RATE, useApplication } from '../../store/application'

type Answer = 'yes' | 'no' | null

interface Condition {
  id: 'revenueShare' | 'determined' | 'guaranteeReady'
  question: string
  detail: string
  /** Un refus arrête le parcours au lieu d'être enregistré. */
  blocking: boolean
}

function conditions(amount: number): Condition[] {
  const guarantee = formatEuro(Math.round(amount * GUARANTEE_RATE))
  return [
    {
      id: 'revenueShare',
      question:
        'Acceptez-vous de reverser 30 % des revenus de votre projet aux orphelins pris en charge par l’association ?',
      detail:
        'Cet engagement figure dans la convention de financement. Il alimente les éditions suivantes du programme.',
      blocking: true,
    },
    {
      id: 'determined',
      question: 'Êtes-vous déterminé à mener votre projet à bien ?',
      detail:
        'Le programme accompagne les lauréats pendant toute la durée d’exécution déclarée dans votre dossier.',
      blocking: false,
    },
    {
      id: 'guaranteeReady',
      question: `Êtes-vous en mesure de fournir une preuve de garantie de 30 % du montant demandé, soit ${guarantee} ?`,
      detail:
        'La preuve sera demandée à la fin de l’évaluation, avant l’émission de l’ordre de virement.',
      blocking: true,
    },
  ]
}

function YesNo({
  value,
  onChange,
  name,
}: {
  value: Answer
  onChange: (value: Answer) => void
  name: string
}) {
  return (
    <div className="flex gap-2" role="radiogroup" aria-label={name}>
      {(['yes', 'no'] as const).map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={value === option}
          onClick={() => onChange(option)}
          className={cn(
            'h-10 min-w-24 rounded-full px-5 text-sm font-bold transition',
            value === option
              ? option === 'yes'
                ? 'bg-brand-600 text-white'
                : 'bg-ink-900 text-white'
              : 'bg-ink-100 text-ink-600 hover:bg-ink-200',
          )}
        >
          {option === 'yes' ? 'Oui' : 'Non'}
        </button>
      ))}
    </div>
  )
}

/** Écran de blocage affiché lorsqu'une condition obligatoire est refusée. */
function Blocked({ refused, onBack }: { refused: string[]; onBack: () => void }) {
  return (
    <Card className="border-rose-200 bg-rose-50/60">
      <CardBody className="space-y-5 py-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <AlertIcon className="h-7 w-7" aria-hidden />
        </span>
        <div>
          <h2 className="text-2xl text-ink-900">Votre candidature ne peut pas se poursuivre</h2>
          <p className="mx-auto mt-3 max-w-lg leading-relaxed text-ink-600">
            {refused.length > 1
              ? 'Les conditions suivantes sont obligatoires pour accéder à l’évaluation :'
              : 'La condition suivante est obligatoire pour accéder à l’évaluation :'}
          </p>
        </div>
        <ul className="mx-auto max-w-lg space-y-2 text-left">
          {refused.map((item) => (
            <li
              key={item}
              className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-ink-700 ring-1 ring-rose-200"
            >
              {item}
            </li>
          ))}
        </ul>
        <Button size="lg" variant="secondary" onClick={onBack}>
          Revenir aux conditions
        </Button>
      </CardBody>
    </Card>
  )
}

/**
 * Conditions d'accès à l'évaluation, présentées avant la première session.
 * Tant qu'elles ne sont pas validées, le QCM reste fermé.
 */
export function EligibilityGate({ amount }: { amount: number }) {
  const acceptEligibility = useApplication((state) => state.acceptEligibility)

  const [isAdult, setIsAdult] = useState<Answer>(null)
  const [idDocument, setIdDocument] = useState<FileMeta[]>([])
  const [answers, setAnswers] = useState<Record<Condition['id'], Answer>>({
    revenueShare: null,
    determined: null,
    guaranteeReady: null,
  })
  const [errors, setErrors] = useState<string[]>([])
  const [refused, setRefused] = useState<string[] | null>(null)

  const items = conditions(amount)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const missing: string[] = []
    if (isAdult === null) missing.push('Indiquez si vous avez au moins 18 ans.')
    if (isAdult === 'yes' && idDocument.length === 0) {
      missing.push('Joignez une pièce d’identité confirmant votre majorité.')
    }
    for (const item of items) {
      if (answers[item.id] === null) missing.push('Répondez à toutes les conditions.')
    }

    setErrors([...new Set(missing)])
    if (missing.length > 0) {
      toast.error('Conditions incomplètes', 'Répondez à toutes les questions pour continuer.')
      return
    }

    // La majorité et les deux conditions marquées bloquantes arrêtent le parcours.
    const blocked = [
      ...(isAdult === 'no' ? ['Vous devez avoir au moins 18 ans pour candidater.'] : []),
      ...items.filter((item) => item.blocking && answers[item.id] === 'no').map((item) => item.question),
    ]
    if (blocked.length > 0) {
      setRefused(blocked)
      return
    }

    acceptEligibility({
      isAdult: true,
      idDocument,
      revenueShare: answers.revenueShare === 'yes',
      determined: answers.determined === 'yes',
      guaranteeReady: answers.guaranteeReady === 'yes',
    })
    toast.success('Conditions validées', 'Votre première session d’évaluation est ouverte.')
  }

  if (refused) return <Blocked refused={refused} onBack={() => setRefused(null)} />

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="outline">Avant de commencer</Badge>
        <h1 className="mt-4 text-3xl text-ink-900 sm:text-4xl">Conditions d’accès à l’évaluation</h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Ces quatre points conditionnent l’ouverture de votre première session de questions.
          Répondez-y honnêtement : vos réponses engagent votre candidature.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Card>
          <CardHeader
            title="Majorité et identité"
            description="Le programme est réservé aux personnes majeures."
          />
          <CardBody className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-semibold text-ink-800">J’ai au moins 18 ans</p>
              <YesNo value={isAdult} onChange={setIsAdult} name="Avez-vous au moins 18 ans ?" />
            </div>

            {isAdult === 'yes' && (
              <div className="border-t border-ink-100 pt-5">
                <Dropzone
                  label="Pièce d’identité"
                  hint="Carte nationale d’identité, passeport ou titre de séjour, au format PDF ou image."
                  accept="application/pdf,image/*"
                  multiple={false}
                  files={idDocument}
                  onChange={setIdDocument}
                />
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Engagements du programme"
            description="Trois questions, une réponse par question."
          />
          <CardBody className="divide-y divide-ink-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink-800">{item.question}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{item.detail}</p>
                </div>
                <div className="shrink-0">
                  <YesNo
                    value={answers[item.id]}
                    onChange={(value) => setAnswers((current) => ({ ...current, [item.id]: value }))}
                    name={item.question}
                  />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {errors.length > 0 && (
          <ul className="space-y-1.5 rounded-xl border border-rose-200 bg-rose-50/60 p-4">
            {errors.map((error) => (
              <li key={error} className="text-sm font-medium text-rose-700">
                {error}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm text-ink-500 sm:max-w-md">
            <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
            Votre pièce d’identité sert uniquement à vérifier votre majorité et n’est consultable que
            par les agents habilités du programme.
          </p>
          <Button type="submit" size="lg">
            <CheckCircleIcon className="h-4 w-4" aria-hidden />
            Valider et accéder à l’évaluation
            <ArrowRightIcon className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </form>
    </div>
  )
}
