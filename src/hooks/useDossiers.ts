import { useMemo } from 'react'
import { MOCK_DOSSIERS, type AdminDossier } from '../data/mockDossiers'
import { useAdmin } from '../store/admin'
import { useApplication } from '../store/application'
import { useAuth } from '../store/auth'

export const LIVE_DOSSIER_ID = 'live'

/**
 * Liste consolidée du back-office : le jeu de démonstration, plus le dossier
 * réellement déposé depuis l'espace porteur de ce navigateur. Les deux stores
 * étant persistés, approuver le dossier « live » débloque immédiatement le QCM
 * côté candidat.
 */
export function useDossiers(): AdminDossier[] {
  const overrides = useAdmin((state) => state.overrides)
  const notes = useAdmin((state) => state.notes)
  const application = useApplication()
  const accounts = useAuth((state) => state.accounts)

  return useMemo(() => {
    const seeded = MOCK_DOSSIERS.map((dossier) => ({
      ...dossier,
      status: overrides[dossier.id] ?? dossier.status,
      reviewNote: notes[dossier.id],
    }))

    if (!application.project || !application.reference) return seeded

    const owner = accounts.find((account) => account.role === 'candidate')
    const live: AdminDossier = {
      id: LIVE_DOSSIER_ID,
      reference: application.reference,
      applicant: owner ? `${owner.firstName} ${owner.lastName}` : 'Porteur de projet',
      email: owner?.email ?? '—',
      title: application.project.title,
      amount: application.project.amount,
      durationMonths: application.project.durationMonths,
      summary: application.project.summary,
      submittedAt: application.project.submittedAt,
      status: application.status,
      documents: application.project.documents,
      phases: application.phases,
      funding: application.funding ?? undefined,
      live: true,
    }

    return [live, ...seeded]
  }, [accounts, application, notes, overrides])
}
