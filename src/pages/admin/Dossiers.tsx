import { useMemo, useState } from 'react'
import { SearchIcon } from '../../components/ui/icons'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Field'
import { DossierDrawer } from '../../components/admin/DossierDrawer'
import { toast } from '../../lib/toast'
import { cn, formatDate, formatEuro } from '../../lib/utils'
import { LIVE_DOSSIER_ID, useDossiers } from '../../hooks/useDossiers'
import { useAdmin } from '../../store/admin'
import { useApplication, type DossierStatus } from '../../store/application'
import type { AdminDossier } from '../../data/mockDossiers'

const COLUMNS: { id: string; label: string; statuses: DossierStatus[]; accent: string }[] = [
  { id: 'new', label: 'Nouveaux dossiers', statuses: ['submitted'], accent: 'bg-amber-400' },
  { id: 'quiz', label: 'QCM en cours', statuses: ['approved', 'awaiting_next_phase'], accent: 'bg-brand-500' },
  { id: 'done', label: 'QCM validés', statuses: ['evaluated'], accent: 'bg-violet-500' },
  { id: 'proofs', label: 'Preuves 30 % déposées', statuses: ['proofs_submitted'], accent: 'bg-sky-500' },
  { id: 'financed', label: 'Financés', statuses: ['financed'], accent: 'bg-emerald-500' },
]

function DossierCard({ dossier, onOpen }: { dossier: AdminDossier; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-xl border border-ink-200 bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md hover:shadow-brand-600/5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[0.7rem] font-bold tracking-[0.05em] text-ink-400">
          {dossier.reference}
        </span>
        {dossier.live && <Badge tone="brand" className="px-2 py-0.5 text-[0.6rem]">Live</Badge>}
      </div>
      <p className="mt-1.5 line-clamp-2 text-sm leading-snug font-bold text-ink-900">
        {dossier.title}
      </p>
      <p className="mt-1 truncate text-xs text-ink-500">{dossier.applicant}</p>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="font-extrabold text-brand-600">{formatEuro(dossier.amount)}</span>
        <span className="text-ink-400">{formatDate(dossier.submittedAt)}</span>
      </div>
    </button>
  )
}

export function Dossiers() {
  const dossiers = useDossiers()
  const setStatus = useAdmin((state) => state.setStatus)
  const approveLive = useApplication((state) => state.approveDossier)
  const rejectLive = useApplication((state) => state.rejectDossier)

  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return dossiers
    return dossiers.filter((dossier) =>
      [dossier.title, dossier.applicant, dossier.reference, dossier.email]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    )
  }, [dossiers, query])

  const open = dossiers.find((dossier) => dossier.id === openId) ?? null

  function approve(dossier: AdminDossier) {
    if (dossier.id === LIVE_DOSSIER_ID) approveLive()
    else setStatus(dossier.id, 'approved')
    setOpenId(null)
    toast.success('Dossier approuvé', `${dossier.reference} — l’évaluation est ouverte au porteur.`)
  }

  function reject(dossier: AdminDossier, note: string) {
    if (dossier.id === LIVE_DOSSIER_ID) rejectLive(note)
    else setStatus(dossier.id, 'rejected', note)
    setOpenId(null)
    toast.info('Dossier rejeté', `${dossier.reference} — le motif a été transmis au porteur.`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-3xl">
            Pipeline des dossiers
          </h1>
          <p className="mt-1 text-ink-600">
            {dossiers.length} dossier(s) — cliquez sur une carte pour ouvrir la fiche de révision.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden />
          <Input
            placeholder="Rechercher un porteur, un projet…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-10"
            aria-label="Rechercher un dossier"
          />
        </div>
      </div>

      {/* Vue pipeline — colonnes défilables horizontalement sur mobile */}
      <div className="-mx-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6">
        <div className="flex min-w-max gap-4 xl:grid xl:min-w-0 xl:grid-cols-5">
          {COLUMNS.map((column) => {
            const items = filtered.filter((dossier) => column.statuses.includes(dossier.status))
            return (
              <section key={column.id} className="w-70 shrink-0 xl:w-auto">
                <header className="flex items-center gap-2 px-1 pb-3">
                  <span className={cn('h-2 w-2 rounded-full', column.accent)} aria-hidden />
                  <h2 className="text-sm font-extrabold tracking-[-0.01em] text-ink-900">
                    {column.label}
                  </h2>
                  <span className="ml-auto rounded-full bg-ink-200 px-2 py-0.5 text-xs font-bold text-ink-600">
                    {items.length}
                  </span>
                </header>

                <div className="min-h-24 space-y-2.5 rounded-2xl bg-ink-100/70 p-2.5">
                  {items.length === 0 ? (
                    <p className="px-1 py-4 text-center text-xs text-ink-400">Aucun dossier</p>
                  ) : (
                    items.map((dossier) => (
                      <DossierCard
                        key={dossier.id}
                        dossier={dossier}
                        onOpen={() => setOpenId(dossier.id)}
                      />
                    ))
                  )}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      {open && (
        <DossierDrawer
          key={open.id}
          dossier={open}
          onClose={() => setOpenId(null)}
          onApprove={approve}
          onReject={reject}
        />
      )}
    </div>
  )
}
