import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AreaChart, Bars, Donut, Sparkline, type Bar, type Slice } from '../../components/admin/Charts'
import { SoftCard } from '../../components/layout/AdminShell'
import { useAdminQuery } from '../../components/layout/adminQuery'
import { Badge } from '../../components/ui/Badge'
import { ArrowRightIcon } from '../../components/ui/icons'
import { countWhere, series, spark, type RangeKey } from '../../lib/adminMetrics'
import { formatDate, formatEuro, cn } from '../../lib/utils'
import { STAGES, stageOf } from '../../lib/pipeline'
import { useDossiers, type AdminDossier } from '../../hooks/useDossiers'
import { useProfiles } from '../../hooks/useProfiles'
import type { DossierStatus } from '../../lib/database.types'

const RANGES: { id: RangeKey; label: string }[] = [
  { id: '14j', label: '14 jours' },
  { id: '8s', label: '8 semaines' },
  { id: '6m', label: '6 mois' },
]

const VIEWS = [
  { id: 'vue', label: 'Vue' },
  { id: 'traiter', label: 'À traiter' },
  { id: 'historique', label: 'Historique' },
] as const

type View = (typeof VIEWS)[number]['id']

const TONE: Record<DossierStatus, 'brand' | 'neutral' | 'success' | 'warning' | 'danger'> = {
  draft: 'neutral',
  submitted: 'warning',
  approved: 'brand',
  awaiting_next_phase: 'warning',
  evaluated: 'brand',
  proofs_submitted: 'warning',
  financed: 'success',
  rejected: 'danger',
}

function amountClass(status: DossierStatus) {
  if (status === 'financed') return 'text-emerald-700'
  if (status === 'rejected') return 'text-rose-700'
  if (status === 'proofs_submitted' || status === 'submitted') return 'text-brand-700'
  return 'text-ink-900'
}

function matches(dossier: AdminDossier, query: string) {
  if (!query.trim()) return true
  const needle = query.trim().toLowerCase()
  return [dossier.title, dossier.applicant, dossier.reference, dossier.email]
    .join(' ')
    .toLowerCase()
    .includes(needle)
}

function Pills<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (value: T) => void
  label: string
}) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={cn(
              'h-10 rounded-full px-4 text-sm font-bold transition duration-200 active:scale-[0.97]',
              active ? 'bg-ink-900 text-white' : 'bg-white text-ink-700 shadow-[0_8px_24px_-16px_rgba(11,11,15,0.4)]',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function Home() {
  const { dossiers, loading: dossiersLoading } = useDossiers()
  const { profiles, loading: profilesLoading } = useProfiles()
  const { query } = useAdminQuery()
  const reduced = useReducedMotion()
  const [range, setRange] = useState<RangeKey>('14j')
  const [view, setView] = useState<View>('vue')
  const loading = dossiersLoading || profilesLoading

  const visible = useMemo(
    () => dossiers.filter((dossier) => matches(dossier, query)),
    [dossiers, query],
  )

  const submitted = countWhere(visible, ['submitted'])
  const proofs = countWhere(visible, ['proofs_submitted'])
  const financed = countWhere(visible, ['financed'])
  const rejected = countWhere(visible, ['rejected'])
  const waiting = submitted + proofs

  const submittedDates = visible.map((dossier) => dossier.submitted_at)
  const proofDates = visible.map((dossier) => dossier.funding?.submitted_at)
  const financedDates = visible
    .filter((dossier) => dossier.status === 'financed')
    .map((dossier) => dossier.submitted_at)
  const rejectedDates = visible
    .filter((dossier) => dossier.status === 'rejected')
    .map((dossier) => dossier.submitted_at)

  const deposits: Bar[] = useMemo(() => series(submittedDates, range), [submittedDates, range])
  const signups: Bar[] = useMemo(
    () => series(profiles.map((profile) => profile.created_at), range),
    [profiles, range],
  )

  const slices: Slice[] = STAGES.map((stage) => ({
    label: stage.short,
    value: visible.filter((dossier) => stage.statuses.includes(dossier.status)).length,
    color: stage.color,
  }))
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)

  const activity = useMemo(() => {
    const events: { id: string; at: string; title: string; detail: string; to: string }[] = []
    for (const dossier of visible) {
      if (dossier.submitted_at) {
        const stage = stageOf(dossier.status)
        events.push({
          id: `${dossier.id}-depot`,
          at: dossier.submitted_at,
          title: 'Dossier déposé',
          detail: `${dossier.applicant} · ${dossier.title ?? dossier.reference}`,
          to: stage ? `/admin/${stage.slug}` : '/admin',
        })
      }
      if (dossier.funding?.submitted_at) {
        events.push({
          id: `${dossier.id}-preuve`,
          at: dossier.funding.submitted_at,
          title: 'Preuve transmise',
          detail: `${dossier.applicant} · ${dossier.reference}`,
          to: '/admin/preuves',
        })
      }
    }
    return events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 8)
  }, [visible])

  const history = [...visible]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 8)

  const queue = visible.filter((dossier) => dossier.status === 'submitted' || dossier.status === 'proofs_submitted')

  const kpis = [
    {
      label: 'Dossiers soumis',
      value: String(submitted),
      detail: 'En attente de lecture',
      spark: spark(submittedDates),
      color: '#3d2be8',
    },
    {
      label: 'À traiter',
      value: String(waiting),
      detail: `${proofs} preuve(s) à revoir`,
      spark: spark(proofDates),
      color: '#6d5018',
    },
    {
      label: 'Financés',
      value: String(financed),
      detail: 'Dossiers validés',
      spark: spark(financedDates),
      color: '#047857',
    },
    {
      label: 'Rejetés',
      value: String(rejected),
      detail: 'Avec le motif transmis',
      spark: spark(rejectedDates),
      color: '#be123c',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl text-ink-900 sm:text-4xl">Suivez les dossiers.</h1>
          <p className="mt-2 text-base text-ink-600">
            {loading ? 'Lecture de la base…' : `${total} dossier(s) visible(s), sans les brouillons.`}
          </p>
        </div>
        <Pills options={RANGES} value={range} onChange={setRange} label="Période des graphiques" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item, index) => (
          <SoftCard key={item.label} delay={index * 0.05} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-ink-600">{item.label}</p>
              <Sparkline values={item.spark} color={item.color} />
            </div>
            <p className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-ink-900">{item.value}</p>
            <p className="mt-1 text-sm text-ink-600">{item.detail}</p>
          </SoftCard>
        ))}
      </div>

      <Pills options={[...VIEWS]} value={view} onChange={setView} label="Section du tableau de bord" />

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="space-y-6"
        >
          {view === 'vue' && (
            <>
              <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
                <SoftCard>
                  <h2 className="text-lg text-ink-900">Dépôts dans le temps</h2>
                  <p className="mt-1 text-sm text-ink-600">
                    Nombre de dossiers dont la date de dépôt tombe dans chaque intervalle.
                  </p>
                  <div className="mt-4">
                    <AreaChart points={deposits} />
                  </div>
                </SoftCard>
                <SoftCard tone="ink">
                  <h2 className="text-lg text-white">File d’attente</h2>
                  <p className="mt-3 text-4xl font-extrabold tracking-[-0.04em]">{waiting}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-200">
                    {submitted} nouveau(x) dossier(s) et {proofs} preuve(s) à comparer au montant
                    déposé sur le compte du porteur.
                  </p>
                  <Link
                    to={proofs > 0 ? '/admin/preuves' : '/admin/nouveaux'}
                    className="mt-5 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-bold text-ink-900"
                  >
                    Ouvrir
                    <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </SoftCard>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <SoftCard>
                  <h2 className="text-lg text-ink-900">Répartition par étape</h2>
                  <p className="mt-1 text-sm text-ink-600">Chaque dossier occupe une seule étape.</p>
                  <div className="mt-4">
                    <Donut slices={slices} total={total} totalLabel="dossiers" />
                  </div>
                </SoftCard>
                <SoftCard>
                  <h2 className="text-lg text-ink-900">Inscriptions</h2>
                  <p className="mt-1 text-sm text-ink-600">Comptes créés sur la même période.</p>
                  <div className="mt-4">
                    <Bars bars={signups} />
                  </div>
                </SoftCard>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <SoftCard>
                  <h2 className="text-lg text-ink-900">Activité récente</h2>
                  {activity.length === 0 ? (
                    <p className="mt-4 text-sm text-ink-600">Aucun dépôt ni preuve sur les dossiers visibles.</p>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {activity.map((event) => (
                        <li key={event.id}>
                          <Link to={event.to} className="flex items-start gap-3 rounded-2xl px-2 py-2 hover:bg-ink-50">
                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-600" aria-hidden />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold text-ink-900">{event.title}</span>
                              <span className="block truncate text-sm text-ink-600">{event.detail}</span>
                            </span>
                            <span className="shrink-0 text-sm text-ink-600">{formatDate(event.at)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </SoftCard>
                <SoftCard>
                  <h2 className="text-lg text-ink-900">Avancement du tunnel</h2>
                  <ul className="mt-4 space-y-4">
                    {STAGES.map((stage) => {
                      const count = visible.filter((dossier) => stage.statuses.includes(dossier.status)).length
                      const width = total === 0 ? 0 : Math.round((count / total) * 100)
                      return (
                        <li key={stage.slug}>
                          <div className="flex items-center justify-between gap-3 text-sm font-bold text-ink-800">
                            <Link to={`/admin/${stage.slug}`} className="truncate hover:underline">
                              {stage.short}
                            </Link>
                            <span className="tabular-nums">{count}</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100" role="presentation">
                            <div
                              className="h-full rounded-full bg-brand-600"
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </SoftCard>
              </div>
            </>
          )}

          {view === 'traiter' && (
            <SoftCard>
              <h2 className="text-lg text-ink-900">Décisions en attente</h2>
              {queue.length === 0 ? (
                <p className="mt-4 text-sm text-ink-600">Rien à traiter pour le moment.</p>
              ) : (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {queue.map((dossier) => {
                    const stage = stageOf(dossier.status)
                    return (
                      <li key={dossier.id}>
                        <Link
                          to={stage ? `/admin/${stage.slug}` : '/admin'}
                          className="block rounded-2xl border border-ink-100 p-4 transition duration-200 hover:border-brand-300"
                        >
                          <Badge tone={TONE[dossier.status]}>{stage?.short ?? dossier.status}</Badge>
                          <p className="mt-3 text-base font-bold text-ink-900">{dossier.title ?? 'Sans intitulé'}</p>
                          <p className="mt-1 text-sm text-ink-600">{dossier.applicant}</p>
                          <p className={`mt-3 text-sm font-extrabold ${amountClass(dossier.status)}`}>
                            {formatEuro(Number(dossier.amount ?? 0))}
                          </p>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </SoftCard>
          )}

          {view === 'historique' && (
            <SoftCard>
              <h2 className="text-lg text-ink-900">Dernières mises à jour</h2>
              {history.length === 0 ? (
                <p className="mt-4 text-sm text-ink-600">Aucun dossier ne correspond.</p>
              ) : (
                <ul className="mt-4 divide-y divide-ink-100">
                  {history.map((dossier) => {
                    const stage = stageOf(dossier.status)
                    return (
                      <li key={dossier.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-bold text-ink-900">
                            {dossier.title ?? dossier.reference}
                          </p>
                          <p className="mt-1 text-sm text-ink-600">
                            {dossier.applicant} · {formatDate(dossier.updated_at)}
                          </p>
                        </div>
                        <Badge tone={TONE[dossier.status]}>{stage?.short ?? dossier.status}</Badge>
                        <p className={`text-base font-extrabold tabular-nums ${amountClass(dossier.status)}`}>
                          {formatEuro(Number(dossier.amount ?? 0))}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              )}
            </SoftCard>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
