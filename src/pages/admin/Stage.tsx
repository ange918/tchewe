import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { InboxIcon, SearchIcon } from '../../components/ui/icons'
import { Input } from '../../components/ui/Field'
import { Card, CardBody } from '../../components/ui/Card'
import { DossierDrawer } from '../../components/admin/DossierDrawer'
import { toast } from '../../lib/toast'
import { formatDate, formatEuro } from '../../lib/utils'
import { stageBySlug } from '../../lib/pipeline'
import { useDossiers, type AdminDossier } from '../../hooks/useDossiers'
import { supabase, friendlyError } from '../../lib/supabase'
import { Verifications } from './Verifications'

function Carte({
  dossier,
  couleur,
  onOpen,
}: {
  dossier: AdminDossier
  couleur: string
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-xl border border-ink-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md hover:shadow-brand-600/5"
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: couleur }}
          aria-hidden
        />
        <span className="text-[0.7rem] font-bold tracking-[0.05em] text-ink-400">
          {dossier.reference}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-snug font-bold text-ink-900">
        {dossier.title ?? 'Sans intitulé'}
      </p>
      <p className="mt-1 truncate text-xs text-ink-500">{dossier.applicant}</p>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="font-extrabold text-brand-600">
          {formatEuro(Number(dossier.amount ?? 0))}
        </span>
        <span className="text-ink-400">
          {dossier.submitted_at ? formatDate(dossier.submitted_at) : '—'}
        </span>
      </div>
    </button>
  )
}

/** Liste des dossiers d'une étape du parcours, choisie par l'adresse. */
export function Stage() {
  const { slug } = useParams()
  const stage = stageBySlug(slug)
  const { dossiers, reload } = useDossiers()

  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const liste = useMemo(() => {
    if (!stage) return []
    const needle = query.trim().toLowerCase()
    return dossiers
      .filter((d) => stage.statuses.includes(d.status))
      .filter((d) =>
        needle
          ? [d.title, d.applicant, d.reference, d.email].join(' ').toLowerCase().includes(needle)
          : true,
      )
  }, [dossiers, stage, query])

  if (!stage) return <Navigate to="/admin" replace />

  // Les preuves de garantie se vérifient avec le comparateur, pas dans une liste.
  if (stage.slug === 'preuves') return <Verifications />

  const open = dossiers.find((d) => d.id === openId) ?? null

  async function approve(dossier: AdminDossier) {
    const { error } = await supabase.rpc('approve_dossier', { p_dossier_id: dossier.id })
    if (error) {
      toast.error('Approbation impossible', friendlyError(error, 'Réessayez dans un instant.'))
      return
    }
    setOpenId(null)
    await reload()
    toast.success('Dossier approuvé', `${dossier.reference} — l’évaluation est ouverte au porteur.`)
  }

  async function reject(dossier: AdminDossier, note: string) {
    const { error } = await supabase.rpc('reject_dossier', {
      p_dossier_id: dossier.id,
      p_note: note,
    })
    if (error) {
      toast.error('Rejet impossible', friendlyError(error, 'Réessayez dans un instant.'))
      return
    }
    setOpenId(null)
    await reload()
    toast.info('Dossier rejeté', `${dossier.reference} — le motif a été transmis au porteur.`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="mt-2 h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: stage.color }}
            aria-hidden
          />
          <div>
            <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-3xl">
              {stage.label}
            </h1>
            <p className="mt-1 text-ink-600">
              {liste.length} dossier(s) à cette étape
              {stage.actionable && liste.length > 0 ? ' — une décision vous est demandée.' : '.'}
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden
          />
          <Input
            placeholder="Rechercher un porteur, un projet…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-10"
            aria-label="Rechercher un dossier"
          />
        </div>
      </div>

      {liste.length === 0 ? (
        <Card>
          <CardBody className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
              <InboxIcon className="h-6 w-6" aria-hidden />
            </span>
            <p className="max-w-sm text-sm text-ink-600">
              Aucun dossier à cette étape pour le moment.
            </p>
          </CardBody>
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {liste.map((dossier) => (
            <li key={dossier.id}>
              <Carte
                dossier={dossier}
                couleur={stage.color}
                onOpen={() => setOpenId(dossier.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {open && (
        <DossierDrawer
          key={open.id}
          dossier={open}
          onClose={() => setOpenId(null)}
          onApprove={(d) => void approve(d)}
          onReject={(d, note) => void reject(d, note)}
        />
      )}
    </div>
  )
}
