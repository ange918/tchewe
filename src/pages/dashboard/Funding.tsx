import { useState } from 'react'
import {
  CheckCircleIcon,
  ExternalLinkIcon,
  MoneyIcon,
  ShieldIcon,
} from '../../components/ui/icons'
import { Badge } from '../../components/ui/Badge'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { Dropzone } from '../../components/ui/Dropzone'
import { Input } from '../../components/ui/Field'
import { GuaranteeExplainer } from '../../components/guarantee/GuaranteeExplainer'
import { ProofStatusCard } from '../../components/dashboard/ProofStatusCard'
import { toast } from '../../lib/toast'
import { formatDate, formatEuro } from '../../lib/utils'
import { documentsOfKind, GUARANTEE_RATE, useApplication } from '../../store/application'

/** Lien d'affiliation vers la banque partenaire (à remplacer par l'URL réelle). */
const PARTNER_BANK_URL = 'https://example.com/banque-partenaire'

const IBAN_PATTERN = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,30}$/

interface Errors {
  iban?: string
  bankName?: string
  depositReceipt?: string
  accountProof?: string
}

function draftKey(dossierId: string) {
  return `innova-funding-draft:${dossierId}`
}

function readDraft(dossierId: string): { iban: string; bankName: string } {
  try {
    const raw = sessionStorage.getItem(draftKey(dossierId))
    if (!raw) return { iban: '', bankName: '' }
    const parsed = JSON.parse(raw) as { iban?: unknown; bankName?: unknown }
    return {
      iban: typeof parsed.iban === 'string' ? parsed.iban : '',
      bankName: typeof parsed.bankName === 'string' ? parsed.bankName : '',
    }
  } catch {
    return { iban: '', bankName: '' }
  }
}

function groupIban(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

function FundingForm({ amount, dossierId }: { amount: number; dossierId: string }) {
  const submitFunding = useApplication((state) => state.submitFunding)
  const documents = useApplication((state) => state.documents)
  const addDocument = useApplication((state) => state.addDocument)
  const dropDocument = useApplication((state) => state.dropDocument)
  const depositReceipt = documentsOfKind(documents, 'deposit_receipt')
  const accountProof = documentsOfKind(documents, 'account_proof')
  const guarantee = Math.round(amount * GUARANTEE_RATE)
  const saved = readDraft(dossierId)

  const [iban, setIban] = useState(saved.iban)
  const [bankName, setBankName] = useState(saved.bankName)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  function remember(nextIban: string, nextBank: string) {
    sessionStorage.setItem(draftKey(dossierId), JSON.stringify({ iban: nextIban, bankName: nextBank }))
  }

  function validateIban(value: string) {
    const normalized = value.replace(/\s+/g, '').toUpperCase()
    if (!IBAN_PATTERN.test(normalized)) {
      return 'Saisissez un IBAN valide (ex. FR76 3000 6000 0112 3456 7890 189).'
    }
    return undefined
  }

  function validateBank(value: string) {
    if (value.trim().length < 2) return 'Indiquez le nom de votre banque.'
    return undefined
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const next: Errors = {
      iban: validateIban(iban),
      bankName: validateBank(bankName),
      depositReceipt: depositReceipt.length === 0 ? 'Le reçu de dépôt est obligatoire.' : undefined,
      accountProof: accountProof.length === 0 ? 'Le justificatif de compte est obligatoire.' : undefined,
    }
    const cleaned = Object.fromEntries(Object.entries(next).filter(([, value]) => value)) as Errors
    setErrors(cleaned)
    if (Object.keys(cleaned).length > 0) {
      toast.error('Preuves incomplètes', 'Corrigez les champs signalés avant l’envoi.')
      return
    }

    setSubmitting(true)
    const result = await submitFunding({
      iban: iban.replace(/\s+/g, '').toUpperCase(),
      bankName: bankName.trim(),
    })
    setSubmitting(false)

    if (!result.ok) {
      toast.error('Envoi impossible', result.error)
      return
    }
    sessionStorage.removeItem(draftKey(dossierId))
    toast.success('Preuve transmise', 'L’administration va la comparer au montant déposé sur votre compte.')
  }

  const pieces = [
    { label: 'Reçu de dépôt', ready: depositReceipt.length > 0 },
    { label: 'Justificatif du compte', ready: accountProof.length > 0 },
    { label: 'IBAN et banque', ready: !validateIban(iban) && !validateBank(bankName) },
  ]
  const readyCount = pieces.filter((piece) => piece.ready).length

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="outline">Étape 3 sur 3</Badge>
        <h1 className="mt-4 text-3xl text-ink-900 sm:text-4xl">Déposez votre garantie.</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-600">
          {formatEuro(guarantee)} — soit 30 % de {formatEuro(amount)} — vont sur le compte ouvert à
          votre nom. Ensuite, l’administration vérifie la preuve, puis émet le virement de{' '}
          {formatEuro(amount)} vers ce même compte.
        </p>
      </div>

      <GuaranteeExplainer amountLabel={formatEuro(guarantee)} />

      <div className="rounded-2xl border border-ink-200 bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg text-ink-900">Où vous en êtes</h2>
            <p className="mt-1 text-sm text-ink-600">
              {readyCount} sur 3. Les fichiers déjà déposés restent enregistrés si vous quittez la page.
            </p>
          </div>
          <p className="text-sm font-bold text-brand-700">Ensuite : transmettre la preuve</p>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {pieces.map((piece) => (
            <li
              key={piece.label}
              className="flex items-center gap-2 rounded-xl bg-ink-50 px-3 py-3 text-sm font-bold text-ink-800"
            >
              <CheckCircleIcon
                className={piece.ready ? 'h-4 w-4 text-emerald-600' : 'h-4 w-4 text-ink-300'}
                aria-hidden
              />
              {piece.label}
              <span className="sr-only">{piece.ready ? 'prêt' : 'manquant'}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-ink-950 px-4 py-6 text-white sm:px-6">
        <h2 className="text-lg text-white">Ouvrez le compte à votre nom.</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-200">
          Le lien quitte INNOVA FUND et ouvre le site de la banque partenaire. Le dépôt se fait là,
          sur un compte à vous. Aucun paiement n’est réalisé sur cette page.
        </p>
        <div className="mt-4">
          <ButtonLink to={PARTNER_BANK_URL} external size="lg" variant="secondary">
            Ouvrir mon compte
            <ExternalLinkIcon className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>

      <form onSubmit={(event) => void handleSubmit(event)} noValidate className="space-y-6">
        <Card>
          <CardHeader
            title="Votre compte"
            description="Celui qui est ouvert à votre nom. La subvention y sera virée après vérification. Rien n’est prélevé ici."
          />
          <CardBody className="grid gap-6 sm:grid-cols-2">
            <Input
              label="IBAN de votre compte"
              placeholder="FR76 3000 6000 0112 3456 7890 189"
              autoComplete="off"
              spellCheck={false}
              value={iban}
              onChange={(event) => {
                const next = groupIban(event.target.value)
                setIban(next)
                remember(next, bankName)
                setErrors((current) => ({ ...current, iban: undefined }))
              }}
              onBlur={() => setErrors((current) => ({ ...current, iban: validateIban(iban) }))}
              error={errors.iban}
            />
            <Input
              label="Banque partenaire"
              placeholder="Nom de l’établissement"
              value={bankName}
              onChange={(event) => {
                const next = event.target.value
                setBankName(next)
                remember(iban, next)
                setErrors((current) => ({ ...current, bankName: undefined }))
              }}
              onBlur={() => setErrors((current) => ({ ...current, bankName: validateBank(bankName) }))}
              error={errors.bankName}
              hint="L’établissement où le compte est ouvert à votre nom."
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="La preuve"
            description={`Montant à constater sur votre compte : ${formatEuro(guarantee)}. Ce n’est pas un paiement à la plateforme.`}
          />
          <CardBody className="space-y-8">
            <Dropzone
              label="Reçu de dépôt des 30 %"
              hint="Bordereau ou avis d’opération de la banque, au nom du titulaire du compte."
              accept="application/pdf,image/*"
              multiple={false}
              dossierId={dossierId}
              kind="deposit_receipt"
              documents={depositReceipt}
              onAdded={(document) => {
                addDocument(document)
                setErrors((current) => ({ ...current, depositReceipt: undefined }))
              }}
              onRemoved={dropDocument}
              error={errors.depositReceipt}
            />
            <Dropzone
              label="Justificatif du compte"
              hint="Capture du compte ouvert à votre nom, RIB ou photo de la carte (numéro masqué)."
              accept="application/pdf,image/*"
              multiple={false}
              dossierId={dossierId}
              kind="account_proof"
              documents={accountProof}
              onAdded={(document) => {
                addDocument(document)
                setErrors((current) => ({ ...current, accountProof: undefined }))
              }}
              onRemoved={dropDocument}
              error={errors.accountProof}
            />
          </CardBody>
        </Card>

        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            'Vous transmettez la preuve.',
            'L’administration la compare au montant.',
            'Le virement part vers votre compte.',
          ].map((item, index) => (
            <li key={item} className="rounded-2xl bg-ink-50 px-4 py-4 text-sm leading-relaxed text-ink-700">
              <span className="font-mono text-sm font-bold text-brand-700">0{index + 1}</span>
              <p className="mt-2 font-bold text-ink-900">{item}</p>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-ink-600">
            Les pièces ne sont lues que par les agents habilités, pour constater que les fonds sont
            bien sur votre compte.
          </p>
          <Button type="submit" size="lg" loading={submitting}>
            <ShieldIcon className="h-4 w-4" aria-hidden />
            Transmettre ma preuve
          </Button>
        </div>
      </form>
    </div>
  )
}

function FundingStatus() {
  const dossier = useApplication((state) => state.dossier)
  const funding = useApplication((state) => state.funding)
  const documents = useApplication((state) => state.documents)
  if (!funding || !dossier) return null
  const amount = dossier.amount ?? 0
  const guarantee = Math.round(amount * GUARANTEE_RATE)
  const proofs = documents.filter((file) => file.kind === 'deposit_receipt' || file.kind === 'account_proof')

  return (
    <div className="space-y-6">
      <div>
        <Badge tone="outline">Étape 3 sur 3</Badge>
        <h1 className="mt-4 text-3xl text-ink-900 sm:text-4xl">
          {dossier.status === 'financed' ? 'Recevez votre subvention.' : 'Suivez votre preuve.'}
        </h1>
      </div>

      <ProofStatusCard
        status={dossier.status}
        submittedAt={funding.submitted_at ? formatDate(funding.submitted_at) : null}
        reviewNote={dossier.review_note}
        hasFunding
        guaranteeLabel={formatEuro(guarantee)}
      />

      <GuaranteeExplainer amountLabel={formatEuro(guarantee)} compact />

      <Card>
        <CardHeader
          title="Compte déclaré"
          description="Ouvert à votre nom. C’est aussi le compte de réception de la subvention."
        />
        <CardBody className="space-y-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-bold text-ink-600">IBAN</dt>
              <dd className="mt-1 font-mono text-base font-semibold break-all text-ink-900">{funding.iban}</dd>
            </div>
            <div>
              <dt className="text-sm font-bold text-ink-600">Banque</dt>
              <dd className="mt-1 text-base font-semibold text-ink-900">{funding.bank_name}</dd>
            </div>
          </dl>
          <Dropzone
            label="Pièces transmises"
            readOnly
            dossierId={dossier.id}
            kind="deposit_receipt"
            documents={proofs}
            onAdded={() => undefined}
            onRemoved={() => undefined}
          />
          {dossier.status === 'financed' && (
            <p className="flex items-start gap-2 text-sm leading-relaxed text-ink-700">
              <MoneyIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
              L’ordre de virement de {formatEuro(amount)} a été émis vers ce compte. Le délai dépend
              de votre banque.
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export function Funding() {
  const dossier = useApplication((state) => state.dossier)
  if (!dossier) return null

  if (dossier.status === 'evaluated') {
    return <FundingForm amount={dossier.amount ?? 0} dossierId={dossier.id} />
  }

  return <FundingStatus />
}
