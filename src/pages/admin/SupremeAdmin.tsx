import { useMemo, useState } from 'react'
import {
  AlertCircleIcon,
  CheckCircleIcon,
  CheckIcon,
  FolderIcon,
  InstitutionIcon,
  MoneyIcon,
  ReceiptIcon,
  ResetIcon,
  SearchIcon,
  ShieldIcon,
  TrendingUpIcon,
} from '../../components/ui/icons'
import { Button, ButtonLink } from '../../components/ui/Button'
import { DossierDrawer } from '../../components/admin/DossierDrawer'
import { DocumentViewer } from '../../components/admin/DocumentViewer'
import { LIVE_DOSSIER_ID, useDossiers } from '../../hooks/useDossiers'
import { useAdmin } from '../../store/admin'
import { GUARANTEE_RATE, useApplication, type DossierStatus } from '../../store/application'
import { useAuth } from '../../store/auth'
import { toast } from '../../lib/toast'
import { cn, formatDate, formatEuro } from '../../lib/utils'
import type { AdminDossier } from '../../data/mockDossiers'

type TabType = 'overview' | 'dossiers' | 'verifications' | 'direct_actions'

const STATUS_LABELS: Record<DossierStatus, { label: string; tone: 'brand' | 'success' | 'warning' | 'danger' | 'neutral' }> = {
  draft: { label: 'Brouillon', tone: 'neutral' },
  submitted: { label: 'Dossier soumis', tone: 'warning' },
  approved: { label: 'Dossier validé', tone: 'brand' },
  awaiting_next_phase: { label: 'Attente 48h QCM', tone: 'brand' },
  evaluated: { label: '3/3 QCM Réussis', tone: 'brand' },
  proofs_submitted: { label: 'Preuves 30 % déposées', tone: 'warning' },
  financed: { label: 'Subvention décaissée', tone: 'success' },
  rejected: { label: 'Dossier refusé', tone: 'danger' },
}

export function SupremeAdmin() {
  const user = useAuth((state) => state.user)
  const login = useAuth((state) => state.login)
  const dossiers = useDossiers()

  // Actions Live Application
  const application = useApplication()
  const setAdminStatus = useAdmin((state) => state.setStatus)
  const resetAdmin = useAdmin((state) => state.reset)

  const [tab, setTab] = useState<TabType>('overview')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null)
  const [selectedProofId, setSelectedProofId] = useState<string | null>(null)

  // Statistiques calculées
  const stats = useMemo(() => {
    const totalCount = dossiers.length
    const totalGranted = dossiers
      .filter((d) => d.status === 'financed')
      .reduce((sum, d) => sum + d.amount, 0)
    const inPipeline = dossiers
      .filter((d) => d.status !== 'financed' && d.status !== 'rejected')
      .reduce((sum, d) => sum + d.amount, 0)
    const pendingReview = dossiers.filter((d) => d.status === 'submitted').length
    const pendingProofs = dossiers.filter((d) => d.status === 'proofs_submitted').length
    const financedCount = dossiers.filter((d) => d.status === 'financed').length

    return {
      totalCount,
      totalGranted,
      inPipeline,
      pendingReview,
      pendingProofs,
      financedCount,
    }
  }, [dossiers])

  // Filtrage des dossiers
  const filteredDossiers = useMemo(() => {
    let result = dossiers
    if (statusFilter !== 'all') {
      result = result.filter((d) => d.status === statusFilter)
    }
    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter((d) =>
        [d.title, d.applicant, d.reference, d.email].some(
          (str) => str?.toLowerCase().includes(q)
        )
      )
    }
    return result
  }, [dossiers, statusFilter, search])

  // Preuves en attente
  const proofsList = useMemo(() => {
    return dossiers.filter((d) => d.status === 'proofs_submitted')
  }, [dossiers])

  const activeProofDossier = useMemo(() => {
    return (
      proofsList.find((d) => d.id === selectedProofId) ??
      proofsList[0] ??
      null
    )
  }, [proofsList, selectedProofId])

  const openDrawerDossier = useMemo(() => {
    if (!openDrawerId) return null
    return dossiers.find((d) => d.id === openDrawerId) ?? null
  }, [dossiers, openDrawerId])

  // Validation rapide
  function handleDirectApprove(dossier: AdminDossier) {
    if (dossier.id === LIVE_DOSSIER_ID) {
      application.approveDossier()
    } else {
      setAdminStatus(dossier.id, 'approved')
    }
    toast.success('Dossier validé', `${dossier.reference} a été approuvé avec succès.`)
  }

  function handleDirectDisburse(dossier: AdminDossier) {
    if (dossier.id === LIVE_DOSSIER_ID) {
      application.validateFunding()
    } else {
      setAdminStatus(dossier.id, 'financed')
    }
    toast.success(
      'Virement de subvention ordonné',
      `Ordre de ${formatEuro(dossier.amount)} émis vers le compte du porteur.`
    )
  }

  function handleDirectReject(dossier: AdminDossier) {
    const reason = 'Dossier non conforme aux exigences du programme 2026.'
    if (dossier.id === LIVE_DOSSIER_ID) {
      application.rejectDossier(reason)
    } else {
      setAdminStatus(dossier.id, 'rejected', reason)
    }
    toast.error('Dossier refusé', `${dossier.reference} a été rejeté.`)
  }

  // Si non connecté en admin, proposer une prise de contrôle immédiate
  const isSuperAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-ink-950 text-white selection:bg-brand-500 selection:text-white">
      {/* Barre supérieure Supreme */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-900/95 backdrop-blur-md">
        <div className="mx-auto flex h-auto min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-0">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 font-black text-ink-950 shadow-md">
              <ShieldIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-white truncate">
                  SUPREME <span className="text-amber-400">CONSOLE</span>
                </span>
                <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[0.6rem] sm:text-[0.65rem] font-bold text-amber-300 uppercase tracking-widest whitespace-nowrap">
                  Super Admin
                </span>
              </div>
              <p className="hidden text-[0.7rem] text-ink-400 sm:block">
                Direction du Programme INNOVA FUND — Contrôle & Décaissement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {!isSuperAdmin ? (
              <Button
                size="sm"
                onClick={() => {
                  login('supreme.director@innovafund.org', 'Admin2026!')
                  toast.success('Session Super Admin activée', 'Plein contrôle accordé.')
                }}
                className="bg-amber-400 text-ink-950 hover:bg-amber-300 font-bold text-xs py-1.5 px-3"
              >
                Activer droits Super-Admin
              </Button>
            ) : (
              <span className="hidden md:inline-flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1 text-xs text-ink-300 border border-white/10">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {user?.email}
              </span>
            )}
            <ButtonLink
              to="/admin/dossiers"
              size="sm"
              variant="secondary"
              className="bg-white/10 text-white ring-white/20 hover:bg-white/20 text-xs py-1.5 px-2.5"
            >
              Back-office
            </ButtonLink>
            <ButtonLink
              to="/"
              size="sm"
              variant="secondary"
              className="bg-white/10 text-white ring-white/20 hover:bg-white/20 text-xs py-1.5 px-2.5"
            >
              Portail
            </ButtonLink>
          </div>
        </div>

        {/* Navigation par onglets - scrollable sur mobile avec scrollbar masquée */}
        <div className="border-t border-white/10 bg-ink-950/80 px-4 sm:px-6">
          <nav className="mx-auto flex max-w-7xl gap-1.5 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
            {[
              { id: 'overview', label: 'Vue Générale', fullLabel: 'Vue Générale & Flux', icon: TrendingUpIcon },
              { id: 'dossiers', label: `Dossiers (${dossiers.length})`, fullLabel: `Dossiers & Décisions (${dossiers.length})`, icon: FolderIcon },
              { id: 'verifications', label: `Vérifications (${proofsList.length})`, fullLabel: `Vérifications & Déblocages (${proofsList.length})`, icon: ReceiptIcon },
              { id: 'direct_actions', label: 'Live & Urgence', fullLabel: 'Actions d’Urgence & Live', icon: AlertCircleIcon },
            ].map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id as TabType)}
                  className={cn(
                    'flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold transition whitespace-nowrap shrink-0',
                    active
                      ? 'bg-amber-400 text-ink-950 shadow-md shadow-amber-400/20'
                      : 'text-ink-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="sm:hidden">{t.label}</span>
                  <span className="hidden sm:inline">{t.fullLabel}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* ========================================================================= ONGLET 1 : VUE GENERALE */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-ink-900/80 p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">Subventions versées</span>
                  <span className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                    <MoneyIcon className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
                  {formatEuro(stats.totalGranted)}
                </p>
                <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircleIcon className="h-4 w-4" />
                  {stats.financedCount} projets financés et opérationnels
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-ink-900/80 p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">Fonds en cours d’évaluation</span>
                  <span className="rounded-lg bg-brand-500/10 p-2 text-brand-400">
                    <TrendingUpIcon className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-black text-amber-400 sm:text-3xl">
                  {formatEuro(stats.inPipeline)}
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  Sur un plafond maximal unitaire de 650 000 €
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-ink-900/80 p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">Dossiers à instruire</span>
                  <span className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                    <FolderIcon className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
                  {stats.pendingReview}
                </p>
                <p className="mt-1 text-xs text-amber-400">
                  En attente de validation administrative initiale
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-ink-900/80 p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">Preuves 30 % à valider</span>
                  <span className="rounded-lg bg-sky-500/10 p-2 text-sky-400">
                    <ReceiptIcon className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
                  {stats.pendingProofs}
                </p>
                <p className="mt-1 text-xs text-sky-400">
                  Bons de garantie prêts pour émission du virement
                </p>
              </div>
            </div>

            {/* Protocoles institutionnels & Synthèse */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-ink-900/70 p-6 lg:col-span-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <InstitutionIcon className="h-5 w-5 text-amber-400" />
                  Protocole d’Allocation & Bailleurs Institutionnels
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-300">
                  Le programme INNOVA FUND opère sous convention tripartite (Banque Mondiale, UE, Mastercard) prévoyant une stricte séparation des devises, une traçabilité comptable sous double signature et une vérification préalable de la garantie bancaire de 30 %.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <p className="text-[0.7rem] font-bold text-ink-400 uppercase">Subvention unitaire max</p>
                    <p className="text-lg font-black text-amber-400 mt-1">650 000 €</p>
                    <p className="text-[0.65rem] text-ink-500 mt-0.5">Non remboursable</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <p className="text-[0.7rem] font-bold text-ink-400 uppercase">Garantie d'engagement</p>
                    <p className="text-lg font-black text-sky-400 mt-1">30 %</p>
                    <p className="text-[0.65rem] text-ink-500 mt-0.5">Sur compte partenaire</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <p className="text-[0.7rem] font-bold text-ink-400 uppercase">Cadence des QCM</p>
                    <p className="text-lg font-black text-emerald-400 mt-1">48 heures</p>
                    <p className="text-[0.65rem] text-ink-500 mt-0.5">J0, J+2, J+4</p>
                  </div>
                </div>

                {/* Accès rapide aux actions */}
                <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    onClick={() => setTab('dossiers')}
                    className="bg-amber-400 text-ink-950 hover:bg-amber-300 font-bold"
                  >
                    Examiner les dossiers
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setTab('verifications')}
                    className="bg-sky-500 text-white hover:bg-sky-400 font-bold"
                  >
                    Vérifier les dépôts de 30 %
                  </Button>
                  <ButtonLink
                    to="/conditions"
                    size="sm"
                    variant="secondary"
                    className="bg-white/10 text-white ring-white/20 hover:bg-white/20"
                  >
                    Consulter les conditions 2026
                  </ButtonLink>
                </div>
              </div>

              {/* Statut du Dossier Live du navigateur */}
              <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-b from-amber-400/10 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-amber-400 px-2 py-0.5 text-[0.65rem] font-extrabold text-ink-950 uppercase">
                    Dossier en direct (Live)
                  </span>
                  <span className="text-xs font-mono text-amber-300">{application.reference ?? 'Non créé'}</span>
                </div>
                <h4 className="mt-4 font-bold text-white text-base">
                  {application.project?.title || 'Aucun dossier actif dans ce navigateur'}
                </h4>
                <p className="mt-1 text-xs text-ink-300">
                  Statut : <strong className="text-white">{application.status}</strong>
                </p>
                <div className="mt-4 space-y-2 text-xs text-ink-300">
                  <div className="flex justify-between border-b border-white/10 py-1.5">
                    <span>Montant sollicité</span>
                    <strong className="text-amber-400 font-bold">
                      {application.project ? formatEuro(application.project.amount) : '—'}
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-white/10 py-1.5">
                    <span>Garantie 30 %</span>
                    <strong className="text-sky-400 font-bold">
                      {application.project ? formatEuro(application.project.amount * GUARANTEE_RATE) : '—'}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>Phases QCM</span>
                    <strong className="text-white font-bold">{application.phases.length} / 3 terminées</strong>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <Button
                    size="sm"
                    full
                    disabled={!application.project}
                    onClick={() => {
                      application.approveDossier()
                      toast.success('Dossier Live approuvé', 'Le candidat peut passer le QCM 1.')
                    }}
                    className="bg-emerald-500 text-white hover:bg-emerald-400 font-bold"
                  >
                    Approuver le dossier Live
                  </Button>
                  <Button
                    size="sm"
                    full
                    disabled={!application.project}
                    onClick={() => {
                      application.unlockNow()
                      toast.success('Délai de 48h forcé', 'La phase suivante est déverrouillée.')
                    }}
                    className="bg-white/10 text-white ring-white/20 hover:bg-white/20 text-xs"
                  >
                    Déverrouiller le délai de 48h
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= ONGLET 2 : DOSSIERS */}
        {tab === 'dossiers' && (
          <div className="space-y-6">
            {/* Barre d'outils et recherche */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher par porteur, projet, référence..."
                  className="w-full rounded-xl border border-white/10 bg-ink-900 py-2.5 pr-4 pl-9 text-sm text-white placeholder:text-ink-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-ink-400">Filtrer par statut :</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-ink-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="all">Tous les statuts ({dossiers.length})</option>
                  <option value="submitted">Nouveaux dossiers</option>
                  <option value="approved">Validés QCM</option>
                  <option value="evaluated">3 QCM complétés</option>
                  <option value="proofs_submitted">Preuves déposées</option>
                  <option value="financed">Financés</option>
                  <option value="rejected">Refusés</option>
                </select>
              </div>
            </div>

            {/* Vue Mobile (Cartes adaptées tactile) */}
            <div className="space-y-3 md:hidden">
              {filteredDossiers.map((dossier) => {
                const st = STATUS_LABELS[dossier.status]
                return (
                  <div
                    key={dossier.id}
                    className="rounded-2xl border border-white/10 bg-ink-900/90 p-4 shadow-md space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {dossier.reference}
                        </span>
                        {dossier.live && (
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[0.6rem] font-bold text-emerald-400">
                            LIVE
                          </span>
                        )}
                      </div>
                      <span
                        className={cn(
                          'inline-block rounded-full px-2 py-0.5 text-[0.65rem] font-bold',
                          st.tone === 'success' && 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
                          st.tone === 'warning' && 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                          st.tone === 'brand' && 'bg-brand-500/20 text-brand-300 border border-brand-500/30',
                          st.tone === 'danger' && 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
                          st.tone === 'neutral' && 'bg-white/10 text-ink-300'
                        )}
                      >
                        {st.label}
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-white text-sm leading-snug">{dossier.title}</p>
                      <p className="text-xs text-ink-400 mt-1">
                        {dossier.applicant} • {dossier.email}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-2.5 text-xs">
                      <div>
                        <span className="text-[0.65rem] text-ink-400 uppercase block font-semibold">Subvention</span>
                        <span className="font-bold text-white text-sm">{formatEuro(dossier.amount)}</span>
                      </div>
                      <div>
                        <span className="text-[0.65rem] text-ink-400 uppercase block font-semibold">Garantie 30 %</span>
                        <span className="font-semibold text-sky-400 text-sm">{formatEuro(dossier.amount * GUARANTEE_RATE)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[0.7rem] text-ink-400 border-t border-white/5">
                      <span>Déposé le {formatDate(dossier.submittedAt)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setOpenDrawerId(dossier.id)}
                        className="bg-white/10 text-white ring-white/20 hover:bg-white/20 text-xs py-1.5 px-3 flex-1 justify-center"
                      >
                        Consulter détails
                      </Button>
                      {dossier.status === 'submitted' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleDirectApprove(dossier)}
                            className="bg-emerald-500 text-white hover:bg-emerald-400 text-xs py-1.5 px-3 flex-1 justify-center"
                          >
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDirectReject(dossier)}
                            className="text-xs py-1.5 px-3"
                          >
                            Refuser
                          </Button>
                        </>
                      )}
                      {dossier.status === 'proofs_submitted' && (
                        <Button
                          size="sm"
                          onClick={() => handleDirectDisburse(dossier)}
                          className="bg-amber-400 text-ink-950 hover:bg-amber-300 font-bold text-xs py-1.5 px-3 flex-1 justify-center"
                        >
                          Décaiser
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Tableau complet des dossiers (Desktop et tablettes) */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-ink-300">
                  <thead className="border-b border-white/10 bg-white/5 text-[0.7rem] uppercase tracking-wider text-ink-400">
                    <tr>
                      <th className="px-5 py-4">Réf.</th>
                      <th className="px-5 py-4">Projet & Porteur</th>
                      <th className="px-5 py-4">Montant Sollicité</th>
                      <th className="px-5 py-4">Garantie 30 %</th>
                      <th className="px-5 py-4">Statut</th>
                      <th className="px-5 py-4">Date de soumission</th>
                      <th className="px-5 py-4 text-right">Actions rapides</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {filteredDossiers.map((dossier) => {
                      const st = STATUS_LABELS[dossier.status]
                      return (
                        <tr key={dossier.id} className="transition hover:bg-white/5">
                          <td className="px-5 py-4">
                            <span className="font-mono font-bold text-amber-400">
                              {dossier.reference}
                            </span>
                            {dossier.live && (
                              <span className="ml-1.5 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[0.6rem] font-bold text-emerald-400">
                                LIVE
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-bold text-white text-sm line-clamp-1">{dossier.title}</p>
                            <p className="text-xs text-ink-400 mt-0.5">
                              {dossier.applicant} • {dossier.email}
                            </p>
                          </td>
                          <td className="px-5 py-4 font-black text-white text-sm">
                            {formatEuro(dossier.amount)}
                          </td>
                          <td className="px-5 py-4 font-semibold text-sky-400">
                            {formatEuro(dossier.amount * GUARANTEE_RATE)}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={cn(
                                'inline-block rounded-full px-2.5 py-1 text-[0.65rem] font-bold',
                                st.tone === 'success' && 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
                                st.tone === 'warning' && 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                                st.tone === 'brand' && 'bg-brand-500/20 text-brand-300 border border-brand-500/30',
                                st.tone === 'danger' && 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
                                st.tone === 'neutral' && 'bg-white/10 text-ink-300'
                              )}
                            >
                              {st.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-ink-400">
                            {formatDate(dossier.submittedAt)}
                          </td>
                          <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setOpenDrawerId(dossier.id)}
                              className="bg-white/10 text-white ring-white/20 hover:bg-white/20 text-xs py-1 px-2.5"
                            >
                              Détails
                            </Button>
                            {dossier.status === 'submitted' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleDirectApprove(dossier)}
                                  className="bg-emerald-500 text-white hover:bg-emerald-400 text-xs py-1 px-2.5"
                                >
                                  Approuver
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleDirectReject(dossier)}
                                  className="text-xs py-1 px-2.5"
                                >
                                  Refuser
                                </Button>
                              </>
                            )}
                            {dossier.status === 'proofs_submitted' && (
                              <Button
                                size="sm"
                                onClick={() => handleDirectDisburse(dossier)}
                                className="bg-amber-400 text-ink-950 hover:bg-amber-300 font-bold text-xs py-1 px-2.5"
                              >
                                Décaiser
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= ONGLET 3 : VERIFICATIONS & GARANTIE */}
        {tab === 'verifications' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-ink-900 p-6">
              <h3 className="text-lg font-bold text-white">
                Contrôle des Justificatifs de Dépôt de Garantie (30 %)
              </h3>
              <p className="mt-1 text-xs text-ink-400">
                Chaque pièce transmise est vérifiée en conformité avec le compte bancaire séquestre avant l'émission de l'ordre de virement de la subvention.
              </p>
            </div>

            {proofsList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
                <ReceiptIcon className="mx-auto h-12 w-12 text-ink-600" />
                <p className="mt-4 font-bold text-white">Aucun dossier en attente de vérification</p>
                <p className="text-xs text-ink-400 mt-1">Tous les justificatifs ont été traités.</p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
                {/* Liste des dossiers en attente */}
                <div className="space-y-2">
                  {proofsList.map((dossier) => {
                    const active = activeProofDossier?.id === dossier.id
                    return (
                      <button
                        key={dossier.id}
                        type="button"
                        onClick={() => setSelectedProofId(dossier.id)}
                        className={cn(
                          'w-full text-left rounded-xl p-4 border transition',
                          active
                            ? 'bg-amber-400/10 border-amber-400 text-white shadow-md'
                            : 'bg-ink-900 border-white/10 text-ink-300 hover:bg-white/5'
                        )}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono font-bold text-amber-400">{dossier.reference}</span>
                          <span className="font-bold text-white">{formatEuro(dossier.amount)}</span>
                        </div>
                        <p className="mt-1.5 font-bold text-sm text-white truncate">{dossier.title}</p>
                        <p className="text-xs text-ink-400 mt-0.5 truncate">{dossier.applicant}</p>
                        <p className="mt-2 text-[0.7rem] text-sky-300 font-semibold">
                          Garantie attendue : {formatEuro(dossier.amount * GUARANTEE_RATE)}
                        </p>
                      </button>
                    )
                  })}
                </div>

                {/* Visualiseur de pièces du dossier sélectionné */}
                {activeProofDossier && (
                  <div className="rounded-2xl border border-white/10 bg-ink-900 p-6 space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-white">{activeProofDossier.title}</h4>
                          <span className="font-mono text-xs font-bold text-amber-400">
                            {activeProofDossier.reference}
                          </span>
                        </div>
                        <p className="text-xs text-ink-400 mt-1">
                          Porteur : {activeProofDossier.applicant} ({activeProofDossier.email}) • Banque : {activeProofDossier.funding?.bankName ?? 'Banque partenaire'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleDirectDisburse(activeProofDossier)}
                          className="bg-amber-400 text-ink-950 hover:bg-amber-300 font-black text-sm"
                        >
                          <CheckIcon className="h-4 w-4" />
                          Valider & Décaisser {formatEuro(activeProofDossier.amount)}
                        </Button>
                      </div>
                    </div>

                    {/* Affichage des deux pièces */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-3">
                        <h5 className="font-bold text-sm text-white flex items-center gap-2">
                          <ReceiptIcon className="h-4 w-4 text-sky-400" />
                          1. Reçu de dépôt de garantie (30 %)
                        </h5>
                        {activeProofDossier.funding?.depositReceipt[0] ? (
                          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                            <DocumentViewer
                              file={activeProofDossier.funding.depositReceipt[0]}
                              className="h-72"
                            />
                            <p className="mt-2 text-xs text-ink-400 truncate">
                              {activeProofDossier.funding.depositReceipt[0].name}
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-ink-500">
                            Document non téléversé
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-bold text-sm text-white flex items-center gap-2">
                          <InstitutionIcon className="h-4 w-4 text-emerald-400" />
                          2. Relevé / Justificatif de compte partenaire
                        </h5>
                        {activeProofDossier.funding?.accountProof[0] ? (
                          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                            <DocumentViewer
                              file={activeProofDossier.funding.accountProof[0]}
                              className="h-72"
                            />
                            <p className="mt-2 text-xs text-ink-400 truncate">
                              {activeProofDossier.funding.accountProof[0].name}
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-ink-500">
                            Document non téléversé
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4 border border-white/10 text-xs text-ink-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-ink-400">IBAN Porteur :</span>{' '}
                        <span className="font-mono text-white font-bold break-all">{activeProofDossier.funding?.iban ?? 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-ink-400">Subvention :</span>{' '}
                          <span className="text-amber-400 font-extrabold">{formatEuro(activeProofDossier.amount)}</span>
                        </div>
                        <div>
                          <span className="text-ink-400">Garantie 30 % :</span>{' '}
                          <span className="text-sky-400 font-extrabold">{formatEuro(activeProofDossier.amount * GUARANTEE_RATE)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= ONGLET 4 : ACTIONS DIRECTES & LIVE */}
        {tab === 'direct_actions' && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Contrôle du Dossier Candidat Actuel */}
              <div className="rounded-2xl border border-amber-400/40 bg-ink-900 p-6 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldIcon className="h-5 w-5 text-amber-400" />
                  Pilotage du Dossier Candidat Actuel
                </h3>
                <p className="mt-1 text-xs text-ink-400">
                  Permet de forcer les étapes pour tester et piloter la candidature en cours sans attendre les délais réels.
                </p>

                <div className="mt-6 space-y-3">
                  <Button
                    full
                    onClick={() => {
                      application.approveDossier()
                      toast.success('Dossier validé', 'Phase QCM 1 débloquée.')
                    }}
                    className="bg-emerald-500 text-white hover:bg-emerald-400 justify-center"
                  >
                    1. Valider le dossier soumis
                  </Button>

                  <Button
                    full
                    onClick={() => {
                      application.unlockNow()
                      toast.success('Délai 48h shunté', 'Phase QCM suivante immédiatement ouverte.')
                    }}
                    className="bg-brand-500 text-white hover:bg-brand-400 justify-center"
                  >
                    2. Forcer le déverrouillage du délai de 48h
                  </Button>

                  <Button
                    full
                    onClick={() => {
                      application.validateFunding()
                      toast.success('Virement validé', 'La subvention est marquée comme financée.')
                    }}
                    className="bg-amber-400 text-ink-950 hover:bg-amber-300 font-bold justify-center"
                  >
                    3. Valider la preuve et déclencher le virement
                  </Button>

                  <Button
                    full
                    variant="danger"
                    onClick={() => {
                      application.rejectDossier('Critères d’impact insuffisants après examen.')
                      toast.error('Dossier rejeté', 'Le statut a été mis à jour.')
                    }}
                    className="justify-center"
                  >
                    Rejeter le dossier en cours
                  </Button>
                </div>
              </div>

              {/* Maintenance & Réinitialisation */}
              <div className="rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ResetIcon className="h-5 w-5 text-rose-400" />
                  Maintenance & Réinitialisation Démo
                </h3>
                <p className="mt-1 text-xs text-ink-400">
                  Restaure les données de démonstration initiales et réinitialise les surcharges administratives.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl bg-white/5 p-4 text-xs text-ink-300">
                    <p className="font-bold text-white">Attention aux réinitialisations :</p>
                    <p className="mt-1">
                      Cette opération réinitialise les décisions administratives enregistrées dans ce navigateur pour le programme.
                    </p>
                  </div>

                  <Button
                    full
                    variant="secondary"
                    onClick={() => {
                      resetAdmin()
                      toast.success('Back-office réinitialisé', 'Statuts d’origine rétablis.')
                    }}
                    className="bg-white/10 text-white ring-white/20 hover:bg-white/20 justify-center"
                  >
                    Réinitialiser les décisions du back-office
                  </Button>

                  <Button
                    full
                    variant="secondary"
                    onClick={() => {
                      application.reset()
                      toast.success('Dossier candidat réinitialisé', 'Vous pouvez recommencer un parcours complet.')
                    }}
                    className="bg-white/10 text-white ring-white/20 hover:bg-white/20 justify-center"
                  >
                    Réinitialiser le dossier candidat (Live)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Tiroir d'examen d'un dossier */}
      {openDrawerDossier && (
        <DossierDrawer
          dossier={openDrawerDossier}
          onClose={() => setOpenDrawerId(null)}
          onApprove={(d) => {
            handleDirectApprove(d)
            setOpenDrawerId(null)
          }}
          onReject={(d, note) => {
            if (d.id === LIVE_DOSSIER_ID) {
              application.rejectDossier(note)
            } else {
              setAdminStatus(d.id, 'rejected', note)
            }
            toast.error('Dossier refusé', `${d.reference} a été rejeté.`)
            setOpenDrawerId(null)
          }}
        />
      )}
    </div>
  )
}
