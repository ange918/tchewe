import type { DossierStatus } from './database.types'

/**
 * Lecture visuelle de la preuve de garantie, à partir des statuts déjà
 * stockés. Il n'existe pas de statut « preuve rejetée » distinct : un rejet
 * passe par le dossier (`rejected`) et son motif (`review_note`).
 */
export type ProofVisual =
  | { kind: 'later'; title: string; detail: string }
  | { kind: 'todo'; title: string; detail: string }
  | { kind: 'pending'; title: string; detail: string }
  | { kind: 'validated'; title: string; detail: string }
  | { kind: 'rejected'; title: string; detail: string; reason: string }

export function proofVisual(input: {
  status: DossierStatus
  submittedAt: string | null
  reviewNote: string | null
  hasFunding: boolean
  guaranteeLabel: string
}): ProofVisual {
  if (input.status === 'financed') {
    return {
      kind: 'validated',
      title: 'Preuve validée',
      detail: 'L’administration a constaté le dépôt sur votre compte. L’ordre de virement de la subvention a été émis vers ce même compte.',
    }
  }

  if (input.status === 'proofs_submitted') {
    return {
      kind: 'pending',
      title: 'Preuve en attente',
      detail: input.submittedAt
        ? `Transmise le ${input.submittedAt}. L’administration compare le reçu au montant de ${input.guaranteeLabel}. Rien n’est prélevé : l’argent reste sur votre compte.`
        : `L’administration compare le reçu au montant de ${input.guaranteeLabel}. L’argent reste sur votre compte.`,
    }
  }

  if (input.status === 'rejected' && input.hasFunding) {
    return {
      kind: 'rejected',
      title: 'Preuve non retenue',
      detail: 'Le dépôt n’a pas été accepté. Votre argent n’a pas été versé à la plateforme : il est resté sur le compte ouvert à votre nom.',
      reason: input.reviewNote?.trim() || 'Aucun motif n’a été précisé par l’administration.',
    }
  }

  if (input.status === 'evaluated') {
    return {
      kind: 'todo',
      title: 'Preuve à déposer',
      detail: `Déposez ${input.guaranteeLabel} sur le compte ouvert à votre nom, puis transmettez le reçu. La plateforme ne reçoit pas cet argent.`,
    }
  }

  return {
    kind: 'later',
    title: 'Preuve pas encore demandée',
    detail: 'Elle interviendra après les trois sessions d’évaluation. Le montant restera sur un compte à votre nom.',
  }
}
