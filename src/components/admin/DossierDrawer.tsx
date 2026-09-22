import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Field'
import { DocumentTabs, DocumentViewer } from './DocumentViewer'
import { formatDate, formatEuro } from '../../lib/utils'
import { GUARANTEE_RATE, STATUS_LABELS } from '../../store/application'
import type { AdminDossier } from '../../data/mockDossiers'

/** Fiche de révision : pièces jointes, résumé et décision d'instruction. */
export function DossierDrawer({
  dossier,
  onClose,
  onApprove,
  onReject,
}: {
  dossier: AdminDossier
  onClose: () => void
  onApprove: (dossier: AdminDossier) => void
  onReject: (dossier: AdminDossier, note: string) => void
}) {
  const [activeDoc, setActiveDoc] = useState(dossier.documents[0]?.id ?? '')
  const [rejecting, setRejecting] = useState(false)
  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState<string>()

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const file = dossier.documents.find((item) => item.id === activeDoc)
  const pending = dossier.status === 'submitted'

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`Dossier ${dossier.reference}`}>
      <button
        type="button"
        aria-label="Fermer la fiche"
        onClick={onClose}
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]"
      />

      <aside className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-ink-100 p-5 sm:p-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="outline">{dossier.reference}</Badge>
              <Badge tone={pending ? 'warning' : 'neutral'}>{STATUS_LABELS[dossier.status]}</Badge>
              {dossier.live && <Badge tone="brand">Dossier déposé ici</Badge>}
            </div>
            <h2 className="mt-3 truncate text-xl font-extrabold tracking-[-0.025em] text-ink-900">
              {dossier.title}
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              {dossier.applicant} · {dossier.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Montant', value: formatEuro(dossier.amount) },
              { label: 'Garantie 30 %', value: formatEuro(Math.round(dossier.amount * GUARANTEE_RATE)) },
              { label: 'Durée', value: `${dossier.durationMonths} mois` },
              { label: 'Déposé le', value: formatDate(dossier.submittedAt) },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-ink-50 p-3.5">
                <dt className="text-[0.65rem] font-bold tracking-[0.08em] text-ink-400 uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-extrabold text-ink-900">{item.value}</dd>
              </div>
            ))}
          </dl>

          <section>
            <h3 className="text-sm font-extrabold tracking-[-0.01em] text-ink-900">Résumé exécutif</h3>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-ink-600">
              {dossier.summary}
            </p>
          </section>

          {dossier.phases.length > 0 && (
            <section>
              <h3 className="text-sm font-extrabold tracking-[-0.01em] text-ink-900">
                Résultats d’évaluation
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {dossier.phases.map((phase) => (
                  <li key={phase.phase}>
                    <Badge tone="success">
                      Phase {phase.phase} — {phase.score}/{phase.total}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h3 className="text-sm font-extrabold tracking-[-0.01em] text-ink-900">
              Pièces jointes ({dossier.documents.length})
            </h3>
            {dossier.documents.length > 0 ? (
              <div className="mt-3 space-y-3">
                <DocumentTabs files={dossier.documents} activeId={activeDoc} onSelect={setActiveDoc} />
                {file && <DocumentViewer file={file} className="h-96" />}
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink-500">Aucune pièce jointe.</p>
            )}
          </section>

          {dossier.reviewNote && (
            <section className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
              <h3 className="text-sm font-extrabold text-ink-900">Motif du rejet</h3>
              <p className="mt-1 text-sm text-ink-600">{dossier.reviewNote}</p>
            </section>
          )}
        </div>

        {pending && (
          <footer className="border-t border-ink-100 bg-ink-50/60 p-5 sm:p-6">
            {rejecting ? (
              <div className="space-y-3">
                <Textarea
                  label="Motif du rejet"
                  placeholder="Expliquez au porteur ce qui manque ou ce qui ne correspond pas aux critères."
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value)
                    setNoteError(undefined)
                  }}
                  error={noteError}
                  className="min-h-24"
                />
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (note.trim().length < 10) {
                        setNoteError('Indiquez un motif d’au moins 10 caractères.')
                        return
                      }
                      onReject(dossier, note.trim())
                    }}
                  >
                    Confirmer le rejet
                  </Button>
                  <Button variant="ghost" onClick={() => setRejecting(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button size="lg" onClick={() => onApprove(dossier)} className="flex-1">
                  <Check className="h-4 w-4" aria-hidden />
                  Approuver le dossier
                </Button>
                <Button size="lg" variant="danger" onClick={() => setRejecting(true)}>
                  Rejeter
                </Button>
              </div>
            )}
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              L’approbation déclenche l’envoi du courriel au porteur et ouvre la première session
              d’évaluation dans son espace.
            </p>
          </footer>
        )}
      </aside>
    </div>
  )
}
