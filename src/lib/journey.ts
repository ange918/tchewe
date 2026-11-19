import type { DossierStatus } from './database.types'

/**
 * Le parcours du porteur, tel que l'espace le raconte.
 * L'ordre et les statuts reprennent la machine déjà en place : rien ici ne
 * décide d'une transition, le serveur reste seul à le faire.
 */
export interface JourneyStep {
  id: string
  label: string
  detail: string
  /** Ce qui attend la personne tant que l'étape est en cours. */
  next: string
  done: DossierStatus[]
  current: DossierStatus[]
}

export const JOURNEY: JourneyStep[] = [
  {
    id: 'inscription',
    label: 'Inscription',
    detail: 'Compte créé, conditions du programme acceptées.',
    next: 'Votre compte est ouvert.',
    done: [
      'draft',
      'submitted',
      'approved',
      'awaiting_next_phase',
      'evaluated',
      'proofs_submitted',
      'financed',
      'rejected',
    ],
    current: [],
  },
  {
    id: 'soumission',
    label: 'Soumission du dossier',
    detail: 'Projet, montant sollicité et pièces jointes.',
    next: 'Présentez votre projet, puis envoyez le dossier.',
    done: ['submitted', 'approved', 'awaiting_next_phase', 'evaluated', 'proofs_submitted', 'financed'],
    current: ['draft'],
  },
  {
    id: 'analyse',
    label: 'Validation par l’administration',
    detail: 'Lecture du dossier avant l’ouverture de l’évaluation.',
    next: 'Votre dossier est en lecture. La première session s’ouvrira dès qu’il sera validé.',
    done: ['approved', 'awaiting_next_phase', 'evaluated', 'proofs_submitted', 'financed'],
    current: ['submitted'],
  },
  {
    id: 'evaluation',
    label: 'Évaluation — 3 phases',
    detail: 'Trois sessions chronométrées, espacées de 48 heures.',
    next: 'Passez la session ouverte, ou attendez le déverrouillage de la suivante.',
    done: ['evaluated', 'proofs_submitted', 'financed'],
    current: ['approved', 'awaiting_next_phase'],
  },
  {
    id: 'garantie',
    label: 'Garantie de 30 %',
    detail: 'Dépôt sur votre compte, puis envoi de la preuve.',
    next: 'Ouvrez votre compte à votre nom, déposez-y 30 % et transmettez la preuve.',
    done: ['proofs_submitted', 'financed'],
    current: ['evaluated'],
  },
  {
    id: 'virement',
    label: 'Virement de la subvention',
    detail: 'Émis vers votre compte après vérification de la preuve.',
    next: 'L’administration compare votre preuve au montant attendu, puis émet l’ordre de virement.',
    done: ['financed'],
    current: ['proofs_submitted'],
  },
]

export type StepState = 'done' | 'current' | 'upcoming' | 'rejected'

/**
 * Un dossier rejeté n'est pas une étape du tunnel : on le pose sur l'étape
 * où le parcours s'est arrêté, pour ne pas l'afficher comme verrouillé.
 */
export function stepState(
  step: JourneyStep,
  status: DossierStatus,
  stoppedAt: string | null,
): StepState {
  if (status === 'rejected') {
    if (step.id === stoppedAt) return 'rejected'
    if (step.id === 'inscription') return 'done'
    const stopIndex = JOURNEY.findIndex((item) => item.id === stoppedAt)
    const index = JOURNEY.findIndex((item) => item.id === step.id)
    if (stopIndex >= 0 && index < stopIndex) return 'done'
    return 'upcoming'
  }
  if (step.current.includes(status)) return 'current'
  if (step.done.includes(status)) return 'done'
  return 'upcoming'
}

/**
 * Dernière étape réellement atteinte avant un rejet. On ne devine pas au-delà
 * de ce que le dossier contient : un titre, des phases, une preuve.
 */
export function rejectionStep(input: {
  hasProject: boolean
  phaseCount: number
  hasFunding: boolean
}): string {
  if (input.hasFunding) return 'garantie'
  if (input.phaseCount > 0) return 'evaluation'
  if (input.hasProject) return 'soumission'
  return 'soumission'
}
