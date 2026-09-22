import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FileMeta } from '../lib/fileVault'

export type DossierStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'awaiting_next_phase'
  | 'evaluated'
  | 'proofs_submitted'
  | 'financed'
  | 'rejected'

export type PhaseNumber = 1 | 2 | 3

export interface ProjectDraft {
  title: string
  amount: number
  durationMonths: number
  summary: string
  documents: FileMeta[]
  submittedAt: number
}

export interface PhaseResult {
  phase: PhaseNumber
  score: number
  total: number
  completedAt: number
}

export interface FundingProof {
  iban: string
  bankName: string
  depositReceipt: FileMeta[]
  accountProof: FileMeta[]
  submittedAt: number
}

/** Délai imposé entre deux sessions d'évaluation (J0 → J+2 → J+4). */
export const PHASE_GAP_MS = 48 * 60 * 60 * 1000

/** Part de garantie à déposer par le porteur avant le virement de la subvention. */
export const GUARANTEE_RATE = 0.3

interface ApplicationState {
  reference: string | null
  status: DossierStatus
  project: ProjectDraft | null
  phases: PhaseResult[]
  currentPhase: PhaseNumber
  unlockAt: number | null
  funding: FundingProof | null
  reviewNote: string | null

  submitProject: (project: Omit<ProjectDraft, 'submittedAt'>) => void
  approveDossier: () => void
  rejectDossier: (note: string) => void
  completePhase: (phase: PhaseNumber, score: number, total: number) => void
  unlockNow: () => void
  submitFunding: (proof: Omit<FundingProof, 'submittedAt'>) => void
  validateFunding: () => void
  reset: () => void
}

function makeReference() {
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `INF-2026-${suffix}`
}

const initial = {
  reference: null,
  status: 'draft' as DossierStatus,
  project: null,
  phases: [] as PhaseResult[],
  currentPhase: 1 as PhaseNumber,
  unlockAt: null,
  funding: null,
  reviewNote: null,
}

export const useApplication = create<ApplicationState>()(
  persist(
    (set, get) => ({
      ...initial,

      submitProject: (project) =>
        set({
          reference: get().reference ?? makeReference(),
          status: 'submitted',
          project: { ...project, submittedAt: Date.now() },
          reviewNote: null,
        }),

      approveDossier: () => set({ status: 'approved', currentPhase: 1, unlockAt: null }),

      rejectDossier: (note) => set({ status: 'rejected', reviewNote: note }),

      completePhase: (phase, score, total) => {
        const phases = [
          ...get().phases.filter((result) => result.phase !== phase),
          { phase, score, total, completedAt: Date.now() },
        ].sort((a, b) => a.phase - b.phase)

        if (phase === 3) {
          set({ phases, status: 'evaluated', unlockAt: null })
          return
        }

        set({
          phases,
          status: 'awaiting_next_phase',
          currentPhase: (phase + 1) as PhaseNumber,
          unlockAt: Date.now() + PHASE_GAP_MS,
        })
      },

      unlockNow: () => set({ status: 'approved', unlockAt: null }),

      submitFunding: (proof) =>
        set({ status: 'proofs_submitted', funding: { ...proof, submittedAt: Date.now() } }),

      validateFunding: () => set({ status: 'financed' }),

      reset: () => set({ ...initial, reference: null }),
    }),
    { name: 'innova-fund.application' },
  ),
)

/** Étape du parcours à présenter au porteur en fonction de l'état de son dossier. */
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
