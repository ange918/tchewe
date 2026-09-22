import { useState } from 'react'
import { Banknote, CheckCircle2, Inbox } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { DocumentViewer } from '../../components/admin/DocumentViewer'
import { toast } from '../../lib/toast'
import { cn, formatDate, formatEuro } from '../../lib/utils'
import { LIVE_DOSSIER_ID, useDossiers } from '../../hooks/useDossiers'
import { useAdmin } from '../../store/admin'
import { GUARANTEE_RATE, useApplication } from '../../store/application'
import type { AdminDossier } from '../../data/mockDossiers'

function ProofPanel({ title, dossier, kind }: { title: string; dossier: AdminDossier; kind: 'depositReceipt' | 'accountProof' }) {
  const file = dossier.funding?.[kind][0]
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-extrabold tracking-[-0.01em] text-ink-900">{title}</h3>
      {file ? (
        <>
          <DocumentViewer file={file} className="h-64" />
          <p className="truncate text-xs text-ink-500">{file.name}</p>
        </>
      ) : (
        <p className="rounded-xl border border-dashed border-ink-200 bg-ink-50 p-6 text-center text-sm text-ink-500">
          Pièce non transmise
        </p>
      )}
    </div>
  )
}

export function Verifications() {
  const dossiers = useDossiers()
  const setStatus = useAdmin((state) => state.setStatus)
  const validateLive = useApplication((state) => state.validateFunding)

  const pending = dossiers.filter((dossier) => dossier.status === 'proofs_submitted')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // La liste se vide au fil des validations : la sélection retombe sur le
  // premier dossier restant plutôt que d'être resynchronisée par un effet.
  const selected = pending.find((dossier) => dossier.id === selectedId) ?? pending[0] ?? null

  function validate(dossier: AdminDossier) {
    if (dossier.id === LIVE_DOSSIER_ID) validateLive()
    else setStatus(dossier.id, 'financed')
    toast.success(
      'Ordre de virement émis',
      `${dossier.reference} — ${formatEuro(dossier.amount)} vers ${dossier.funding?.bankName ?? 'la banque partenaire'}.`,
    )
  }

  if (pending.length === 0) {
    return (
      <Card>
        <CardBody className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
            <Inbox className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="text-xl font-extrabold tracking-[-0.02em] text-ink-900">
            Aucune preuve en attente
          </h1>
          <p className="max-w-sm text-sm text-ink-600">
            Les dossiers apparaîtront ici dès que leurs porteurs auront déposé le reçu de garantie et
            le justificatif de compte.
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-3xl">
          Validation des preuves financières
        </h1>
        <p className="mt-1 text-ink-600">
          {pending.length} dossier(s) en attente de vérification avant émission de l’ordre de
          virement.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
        <nav aria-label="Dossiers en attente" className="space-y-2">
          {pending.map((dossier) => (
            <button
              key={dossier.id}
              type="button"
              onClick={() => setSelectedId(dossier.id)}
              className={cn(
                'w-full rounded-xl border p-3.5 text-left transition',
                dossier.id === selected?.id
                  ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/15'
                  : 'border-ink-200 bg-white hover:border-brand-300',
              )}
            >
              <span className="block text-[0.7rem] font-bold tracking-[0.05em] text-ink-400">
                {dossier.reference}
              </span>
              <span className="mt-1 block truncate text-sm font-bold text-ink-900">
                {dossier.applicant}
              </span>
              <span className="mt-1.5 block text-xs font-extrabold text-brand-600">
                {formatEuro(Math.round(dossier.amount * GUARANTEE_RATE))} attendus
              </span>
            </button>
          ))}
        </nav>

        {selected && (
          <Card>
            <CardHeader
              title={selected.title}
              description={`${selected.applicant} · déposé le ${
                selected.funding ? formatDate(selected.funding.submittedAt) : '—'
              }`}
              action={<Badge tone="outline">{selected.reference}</Badge>}
            />
            <CardBody className="space-y-6">
              {/* Comparateur : montant attendu vs pièces transmises */}
              <dl className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-brand-50 p-4">
                  <dt className="text-[0.65rem] font-bold tracking-[0.08em] text-brand-700 uppercase">
                    Garantie attendue
                  </dt>
                  <dd className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-brand-700">
                    {formatEuro(Math.round(selected.amount * GUARANTEE_RATE))}
                  </dd>
                </div>
                <div className="rounded-xl bg-ink-50 p-4">
                  <dt className="text-[0.65rem] font-bold tracking-[0.08em] text-ink-400 uppercase">
                    Subvention à virer
                  </dt>
                  <dd className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-ink-900">
                    {formatEuro(selected.amount)}
                  </dd>
                </div>
                <div className="rounded-xl bg-ink-50 p-4">
                  <dt className="text-[0.65rem] font-bold tracking-[0.08em] text-ink-400 uppercase">
                    IBAN déclaré
                  </dt>
                  <dd className="mt-1 truncate font-mono text-sm font-bold text-ink-900">
                    {selected.funding?.iban ?? '—'}
                  </dd>
                </div>
              </dl>

              <div className="grid gap-5 sm:grid-cols-2">
                <ProofPanel title="Reçu de dépôt des 30 %" dossier={selected} kind="depositReceipt" />
                <ProofPanel title="Justificatif de compte" dossier={selected} kind="accountProof" />
              </div>

              <div className="flex flex-col gap-3 border-t border-ink-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-xs leading-relaxed text-ink-500">
                  Vérifiez que le montant du reçu correspond à la garantie attendue et que le
                  titulaire du compte est bien le porteur du dossier.
                </p>
                <Button size="lg" variant="success" onClick={() => validate(selected)}>
                  <Banknote className="h-4 w-4" aria-hidden />
                  Valider le financement
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      <p className="flex items-center gap-2 text-xs text-ink-500">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
        La validation émet l’ordre de virement et bascule le dossier dans la colonne « Financés ».
      </p>
    </div>
  )
}
