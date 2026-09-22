import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CircleAlert, Clock3, FileText, Send } from 'lucide-react'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { Dropzone } from '../../components/ui/Dropzone'
import { Input, Select, Textarea } from '../../components/ui/Field'
import { Badge } from '../../components/ui/Badge'
import { toast } from '../../lib/toast'
import { formatBytes, formatDate, formatEuro } from '../../lib/utils'
import type { FileMeta } from '../../lib/fileVault'
import { GUARANTEE_RATE, useApplication } from '../../store/application'

const MIN_AMOUNT = 2000
const MAX_AMOUNT = 10000

interface FormErrors {
  title?: string
  amount?: string
  durationMonths?: string
  summary?: string
  documents?: string
}

function SubmissionForm() {
  const navigate = useNavigate()
  const submitProject = useApplication((state) => state.submitProject)

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [durationMonths, setDurationMonths] = useState('12')
  const [summary, setSummary] = useState('')
  const [documents, setDocuments] = useState<FileMeta[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const numericAmount = Number(amount)
  const guarantee = Number.isFinite(numericAmount) && numericAmount > 0
    ? Math.round(numericAmount * GUARANTEE_RATE)
    : 0

  function validate(): boolean {
    const next: FormErrors = {}

    if (title.trim().length < 4) next.title = 'Donnez un intitulé d’au moins 4 caractères.'
    if (!Number.isFinite(numericAmount) || numericAmount < MIN_AMOUNT || numericAmount > MAX_AMOUNT) {
      next.amount = `Le montant doit être compris entre ${formatEuro(MIN_AMOUNT)} et ${formatEuro(MAX_AMOUNT)}.`
    }
    if (!durationMonths) next.durationMonths = 'Indiquez la durée d’exécution prévisionnelle.'
    if (summary.trim().length < 120) {
      next.summary = `Le résumé exécutif doit faire au moins 120 caractères (${summary.trim().length} pour l’instant).`
    }
    if (documents.length === 0) {
      next.documents = 'Joignez au minimum votre pitch deck ou votre business plan.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!validate()) {
      toast.error('Dossier incomplet', 'Corrigez les champs signalés avant l’envoi.')
      return
    }

    setSubmitting(true)
    submitProject({
      title: title.trim(),
      amount: numericAmount,
      durationMonths: Number(durationMonths),
      summary: summary.trim(),
      documents,
    })
    setSubmitting(false)
    toast.success('Dossier envoyé', 'Votre projet est transmis à l’administration.')
    navigate('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="outline">Étape 1 sur 3</Badge>
        <h1 className="mt-4 text-3xl text-ink-900 sm:text-4xl">Présentation de votre projet</h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Ces informations servent de base à l’instruction de votre dossier. Vous pourrez les
          compléter tant que l’administration ne l’a pas validé.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Card>
          <CardHeader title="Le projet" description="L’essentiel de votre candidature." />
          <CardBody className="space-y-5">
            <Input
              label="Intitulé du projet"
              placeholder="Ex. Unité de transformation de produits maraîchers"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              error={errors.title}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Montant sollicité"
                type="number"
                inputMode="numeric"
                min={MIN_AMOUNT}
                max={MAX_AMOUNT}
                step={100}
                suffix="€"
                placeholder="10000"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                error={errors.amount}
                hint={
                  guarantee > 0
                    ? `Garantie de 30 % à déposer : ${formatEuro(guarantee)}`
                    : `Entre ${formatEuro(MIN_AMOUNT)} et ${formatEuro(MAX_AMOUNT)}`
                }
              />

              <Select
                label="Durée d’exécution prévisionnelle"
                value={durationMonths}
                onChange={(event) => setDurationMonths(event.target.value)}
                error={errors.durationMonths}
              >
                {[3, 6, 9, 12, 18, 24].map((months) => (
                  <option key={months} value={months}>
                    {months} mois
                  </option>
                ))}
              </Select>
            </div>

            <Textarea
              label="Description / résumé exécutif"
              placeholder="Décrivez le problème traité, la solution proposée, les bénéficiaires visés et l’usage prévu des fonds."
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              error={errors.summary}
              hint={`${summary.trim().length} caractères — 120 minimum`}
              className="min-h-44"
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Pièces jointes"
            description="Pitch deck, business plan et documents d’enregistrement légal."
          />
          <CardBody>
            <Dropzone
              label="Documents du dossier"
              hint="Format PDF uniquement, 10 Mo maximum par fichier."
              files={documents}
              onChange={setDocuments}
              error={errors.documents}
            />
          </CardBody>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-500">
            En envoyant ce dossier, vous confirmez l’exactitude des informations fournies.
          </p>
          <Button type="submit" size="lg" loading={submitting}>
            <Send className="h-4 w-4" aria-hidden />
            Envoyer mon dossier
          </Button>
        </div>
      </form>
    </div>
  )
}

function DossierRecap() {
  const { project, reference, status, reviewNote } = useApplication()

  if (!project) return null

  const rejected = status === 'rejected'

  return (
    <div className="space-y-6">
      <div>
        <Badge tone={rejected ? 'danger' : 'brand'}>
          {rejected ? 'Dossier rejeté' : `Référence ${reference}`}
        </Badge>
        <h1 className="mt-4 text-3xl text-ink-900 sm:text-4xl">{project.title}</h1>
        <p className="mt-2 text-ink-600">
          Déposé le {formatDate(project.submittedAt)} · {formatEuro(project.amount)} sur{' '}
          {project.durationMonths} mois
        </p>
      </div>

      {status === 'submitted' && (
        <Card className="border-amber-200 bg-amber-50/60">
          <CardBody className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Clock3 className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg text-ink-900">Dossier en cours d’analyse</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                Votre dossier est entre les mains de l’administration. Dès sa validation, la première
                session d’évaluation s’ouvrira automatiquement dans votre espace et vous en serez
                informé par e-mail.
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {rejected && (
        <Card className="border-rose-200 bg-rose-50/60">
          <CardBody className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <CircleAlert className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg text-ink-900">Dossier non retenu</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                {reviewNote ?? 'Aucun motif n’a été précisé par l’administration.'}
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader title="Résumé exécutif" />
        <CardBody>
          <p className="whitespace-pre-line text-[0.98rem] leading-relaxed text-ink-600">
            {project.summary}
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Pièces jointes" description={`${project.documents.length} document(s)`} />
        <CardBody>
          <ul className="space-y-2">
            {project.documents.map((file) => (
              <li
                key={file.id}
                className="flex items-center gap-3 rounded-xl border border-ink-200 px-3.5 py-2.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <FileText className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink-900">
                    {file.name}
                  </span>
                  <span className="block text-xs text-ink-500">{formatBytes(file.size)}</span>
                </span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {['approved', 'awaiting_next_phase'].includes(status) && (
        <ButtonLink to="/dashboard/evaluation" size="lg">
          Accéder à l’évaluation
          <ArrowRight className="h-4 w-4" aria-hidden />
        </ButtonLink>
      )}
    </div>
  )
}

export function Submission() {
  const status = useApplication((state) => state.status)
  const project = useApplication((state) => state.project)

  if (status === 'draft' || (status === 'rejected' && !project)) return <SubmissionForm />
  return <DossierRecap />
}
