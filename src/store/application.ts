import { create } from 'zustand'
import { supabase, friendlyError } from '../lib/supabase'
import type {
  DocumentKind,
  DocumentRow,
  DossierRow,
  DossierStatus,
  EligibilityRow,
  FundingProofRow,
  PhaseOutcome,
  PhaseResultRow,
} from '../lib/database.types'

export type { DossierStatus }
export type PhaseNumber = 1 | 2 | 3

/** Délai imposé entre deux sessions d'évaluation — appliqué côté serveur. */
export const PHASE_GAP_MS = 48 * 60 * 60 * 1000

/** Part de garantie à déposer avant le virement. */
export const GUARANTEE_RATE = 0.3

export const STATUS_LABELS: Record<DossierStatus, string> = {
  draft: 'Brouillon',
  submitted: 'En cours d’analyse',
  approved: 'Évaluation ouverte',
  awaiting_next_phase: 'Phase suivante verrouillée',
  evaluated: 'Évaluation réussie',
  proofs_submitted: 'Preuves en vérification',
  financed: 'Financé',
  rejected: 'Dossier rejeté',
}

type Outcome = { ok: true } | { ok: false; error: string }

interface ApplicationState {
  loading: boolean
  dossier: DossierRow | null
  documents: DocumentRow[]
  eligibility: EligibilityRow | null
  phases: PhaseResultRow[]
  funding: FundingProofRow | null

  load: () => Promise<void>
  refresh: () => Promise<void>
  addDocument: (document: DocumentRow) => void
  dropDocument: (id: string) => void
  submitProject: (project: {
    title: string
    amount: number
    durationMonths: number
    summary: string
  }) => Promise<Outcome>
  acceptEligibility: (answers: {
    isAdult: boolean
    revenueShare: boolean
    determined: boolean
    guaranteeReady: boolean
  }) => Promise<Outcome>
  submitFunding: (proof: { iban: string; bankName: string }) => Promise<Outcome>
  clear: () => void
}

const EMPTY = {
  dossier: null,
  documents: [] as DocumentRow[],
  eligibility: null,
  phases: [] as PhaseResultRow[],
  funding: null,
}

/**
 * État du dossier du candidat connecté.
 *
 * Rien n'est persisté localement : la base fait foi, et chaque transition de
 * statut passe par une fonction SQL qui vérifie la séquence. Le client ne peut
 * donc pas se déclarer approuvé, ni avancer d'une phase.
 */
export const useApplication = create<ApplicationState>()((set, get) => ({
  loading: true,
  ...EMPTY,

  load: async () => {
    set({ loading: true })
    const { error } = await supabase.rpc('ensure_dossier')
    if (error) {
      set({ loading: false })
      return
    }
    await get().refresh()
    set({ loading: false })
  },

  refresh: async () => {
    const { data: dossier } = await supabase.from('dossiers').select('*').maybeSingle()
    if (!dossier) {
      set({ ...EMPTY, loading: false })
      return
    }

    const [documents, eligibility, phases, funding] = await Promise.all([
      supabase.from('documents').select('*').order('uploaded_at'),
      supabase.from('eligibility').select('*').maybeSingle(),
      supabase.from('phase_results').select('*').order('phase'),
      supabase.from('funding_proofs').select('*').maybeSingle(),
    ])

    set({
      dossier,
      documents: documents.data ?? [],
      eligibility: eligibility.data ?? null,
      phases: phases.data ?? [],
      funding: funding.data ?? null,
    })
  },

  addDocument: (document) => set({ documents: [...get().documents, document] }),

  dropDocument: (id) => set({ documents: get().documents.filter((d) => d.id !== id) }),

  submitProject: async (project) => {
    const { error } = await supabase.rpc('submit_dossier', {
      p_title: project.title,
      p_amount: project.amount,
      p_duration_months: project.durationMonths,
      p_summary: project.summary,
    })
    if (error) return { ok: false, error: friendlyError(error, 'Envoi du dossier impossible.') }
    await get().refresh()
    return { ok: true }
  },

  acceptEligibility: async (answers) => {
    const { error } = await supabase.rpc('accept_eligibility', {
      p_is_adult: answers.isAdult,
      p_revenue_share: answers.revenueShare,
      p_determined: answers.determined,
      p_guarantee_ready: answers.guaranteeReady,
    })
    if (error) return { ok: false, error: friendlyError(error, 'Validation impossible.') }
    await get().refresh()
    return { ok: true }
  },

  submitFunding: async (proof) => {
    const { error } = await supabase.rpc('submit_funding', {
      p_iban: proof.iban,
      p_bank_name: proof.bankName,
    })
    if (error) return { ok: false, error: friendlyError(error, 'Envoi des preuves impossible.') }
    await get().refresh()
    return { ok: true }
  },

  clear: () => set({ ...EMPTY, loading: false }),
}))

/** Les énoncés et la correction viennent du serveur ; le client n'a jamais la clé. */
export async function fetchPhaseQuestions(phase: PhaseNumber) {
  const { data, error } = await supabase.rpc('get_phase_questions', { p_phase: phase })
  if (error) throw error
  return data ?? []
}

export async function gradePhase(phase: PhaseNumber, answers: number[]): Promise<PhaseOutcome> {
  const { data, error } = await supabase.rpc('submit_phase_answers', {
    p_phase: phase,
    p_answers: answers,
  })
  if (error) throw error
  return data as unknown as PhaseOutcome
}

export function documentsOfKind(documents: DocumentRow[], kind: DocumentKind): DocumentRow[] {
  return documents.filter((document) => document.kind === kind)
}

/** Étape du parcours à présenter selon l'état du dossier. */
export function routeForStatus(status: DossierStatus): string {
  switch (status) {
    case 'draft':
      return '/dashboard/submission'
    case 'submitted':
    case 'rejected':
      return '/dashboard'
    case 'approved':
    case 'awaiting_next_phase':
      return '/dashboard/evaluation'
    default:
      return '/dashboard/funding'
  }
}
