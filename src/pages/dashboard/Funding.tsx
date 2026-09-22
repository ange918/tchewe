import { useState } from 'react'
import { Banknote, CheckCircle2, ExternalLink, PartyPopper, ShieldCheck } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { Dropzone } from '../../components/ui/Dropzone'
import { Input } from '../../components/ui/Field'
import { toast } from '../../lib/toast'
import { formatDate, formatEuro } from '../../lib/utils'
import type { FileMeta } from '../../lib/fileVault'
import { GUARANTEE_RATE, useApplication } from '../../store/application'

/** Lien d'affiliation vers la banque partenaire (à remplacer par l'URL réelle). */
const PARTNER_BANK_URL = 'https://example.com/banque-partenaire'

const IBAN_PATTERN = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,30}$/

interface Errors {
  iban?: string
  bankName?: string
  depositReceipt?: string
  accountProof?: string
}

function FundingForm({ amount }: { amount: number }) {
  const submitFunding = useApplication((state) => state.submitFunding)
  const guarantee = Math.round(amount * GUARANTEE_RATE)

  const [iban, setIban] = useState('')
  const [bankName, setBankName] = useState('')
  const [depositReceipt, setDepositReceipt] = useState<FileMeta[]>([])
  const [accountProof, setAccountProof] = useState<FileMeta[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const next: Errors = {}
    const normalized = iban.replace(/\s+/g, '').toUpperCase()

    if (!IBAN_PATTERN.test(normalized)) {
      next.iban = 'Saisissez un IBAN valide (ex. FR76 3000 6000 0112 3456 7890 189).'
    }
    if (bankName.trim().length < 2) next.bankName = 'Indiquez le nom de votre banque.'
    if (depositReceipt.length === 0) next.depositReceipt = 'Le reçu de dépôt est obligatoire.'
    if (accountProof.length === 0) next.accountProof = 'Le justificatif de compte est obligatoire.'

    setErrors(next)
    if (Object.keys(next).length > 0) {
      toast.error('Preuves incomplètes', 'Corrigez les champs signalés avant l’envoi.')
      return
    }

    setSubmitting(true)
    submitFunding({ iban: normalized, bankName: bankName.trim(), depositReceipt, accountProof })
    setSubmitting(false)
    toast.success('Preuves transmises', 'L’administration procède à la vérification.')
  }

  return (
    <div className="space-y-6">
      {/* Bannière de félicitations */}
      <div className="overflow-hidden rounded-3xl bg-brand-600">
        <div className="relative px-6 py-9 sm:px-9 sm:py-11">
          <div className="grid-motif absolute inset-0 opacity-25" aria-hidden />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white ring-1 ring-inset ring-white/25">
              <PartyPopper className="h-3.5 w-3.5" aria-hidden />
              Évaluation réussie
            </span>
            <h1 className="mt-5 max-w-2xl text-3xl leading-[1.05] text-white sm:text-4xl">
              Dernière étape : déposez votre garantie de 30 %.
            </h1>
            <p className="mt-3 max-w-xl leading-relaxed text-brand-100">
              Ouvrez votre compte auprès de la banque partenaire, déposez-y{' '}
              <strong className="font-extrabold text-white">{formatEuro(guarantee)}</strong> puis
              transmettez vos justificatifs. L’ordre de virement de{' '}
              <strong className="font-extrabold text-white">{formatEuro(amount)}</strong> est émis
              après vérification.
            </p>
            <div className="mt-7">
              <ButtonLink
                to={PARTNER_BANK_URL}
                external
                size="lg"
                variant="secondary"
                pill
              >
                Ouvrir mon compte bancaire partenaire
                <ExternalLink className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Card>
          <CardHeader
            title="Coordonnées bancaires"
            description="Le compte sur lequel la subvention sera virée."
          />
          <CardBody className="grid gap-5 sm:grid-cols-2">
            <Input
              label="IBAN / numéro de compte"
              placeholder="FR76 3000 6000 0112 3456 7890 189"
              value={iban}
              onChange={(event) => {
                setIban(event.target.value)
                setErrors((current) => ({ ...current, iban: undefined }))
              }}
              error={errors.iban}
            />
            <Input
              label="Banque partenaire"
              placeholder="Nom de l’établissement"
              value={bankName}
              onChange={(event) => {
                setBankName(event.target.value)
                setErrors((current) => ({ ...current, bankName: undefined }))
              }}
              error={errors.bankName}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Preuves de la garantie"
            description={`Apport attendu : ${formatEuro(guarantee)} (30 % de ${formatEuro(amount)}).`}
          />
          <CardBody className="space-y-7">
            <Dropzone
              label="Reçu de dépôt des 30 %"
              hint="Bordereau de versement ou avis d’opération remis par la banque."
              accept="application/pdf,image/*"
              multiple={false}
              files={depositReceipt}
              onChange={setDepositReceipt}
              error={errors.depositReceipt}
            />
            <Dropzone
              label="Justificatif du compte ou de la carte"
              hint="Capture d’écran du compte ouvert, RIB ou photo de la carte (numéro masqué)."
              accept="application/pdf,image/*"
              multiple={false}
              files={accountProof}
              onChange={setAccountProof}
              error={errors.accountProof}
            />
          </CardBody>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm text-ink-500">
            Vos pièces sont transmises aux seuls agents habilités du programme, dans le cadre du
            contrôle de l’usage des fonds.
          </p>
          <Button type="submit" size="lg" loading={submitting}>
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Transmettre mes preuves
          </Button>
        </div>
      </form>
    </div>
  )
}

function FundingStatus() {
  const { status, funding, project } = useApplication()
  if (!funding || !project) return null

  const financed = status === 'financed'
  const guarantee = Math.round(project.amount * GUARANTEE_RATE)

  return (
    <div className="space-y-6">
      <Card className={financed ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/60'}>
        <CardBody className="flex flex-col items-start gap-4 sm:flex-row">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              financed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {financed ? (
              <Banknote className="h-6 w-6" aria-hidden />
            ) : (
              <ShieldCheck className="h-6 w-6" aria-hidden />
            )}
          </span>
          <div>
            <h1 className="text-2xl text-ink-900">
              {financed ? 'Financement validé' : 'Preuves en cours de vérification'}
            </h1>
            <p className="mt-1.5 leading-relaxed text-ink-600">
              {financed
                ? `L’ordre de virement de ${formatEuro(project.amount)} a été émis vers votre compte. Le délai de réception dépend de votre établissement bancaire.`
                : `Vos justificatifs ont été transmis le ${formatDate(funding.submittedAt)}. L’administration compare le reçu de dépôt avec l’apport attendu de ${formatEuro(guarantee)}.`}
            </p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Pièces transmises" />
        <CardBody className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold tracking-[0.08em] text-ink-400 uppercase">IBAN</dt>
              <dd className="mt-1 font-mono text-sm font-semibold text-ink-900">{funding.iban}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-[0.08em] text-ink-400 uppercase">Banque</dt>
              <dd className="mt-1 text-sm font-semibold text-ink-900">{funding.bankName}</dd>
            </div>
          </dl>

          <ul className="space-y-2">
            {[...funding.depositReceipt, ...funding.accountProof].map((file) => (
              <li
                key={file.id}
                className="flex items-center gap-3 rounded-xl border border-ink-200 px-3.5 py-2.5"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                <span className="truncate text-sm font-semibold text-ink-900">{file.name}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  )
}

export function Funding() {
  const status = useApplication((state) => state.status)
  const project = useApplication((state) => state.project)

  if (!project) return null

  if (status === 'evaluated') {
    return (
      <div className="space-y-4">
        <Badge tone="outline">Étape 3 sur 3</Badge>
        <FundingForm amount={project.amount} />
      </div>
    )
  }

  return <FundingStatus />
}
