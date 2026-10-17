import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type {
  DocumentRow,
  DossierRow,
  EligibilityRow,
  FundingProofRow,
  PhaseResultRow,
} from '../lib/database.types'

/** Un dossier tel que le back-office le présente, pièces et résultats inclus. */
export interface AdminDossier extends DossierRow {
  applicant: string
  email: string
  documents: DocumentRow[]
  eligibility: EligibilityRow | null
  phases: PhaseResultRow[]
  funding: FundingProofRow | null
}

interface Embedded extends DossierRow {
  profiles: { first_name: string; last_name: string; email: string | null } | null
  documents: DocumentRow[]
  eligibility: EligibilityRow | null
  phase_results: PhaseResultRow[]
  funding_proofs: FundingProofRow | null
}

const SELECT =
  '*, profiles(first_name, last_name, email), documents(*), eligibility(*), phase_results(*), funding_proofs(*)'

/**
 * Tous les dossiers, pour le back-office.
 *
 * Aucun filtre n'est appliqué côté client : c'est la politique RLS qui décide.
 * Un compte candidat qui atteindrait cette page ne verrait que son dossier.
 */
export function useDossiers() {
  const [dossiers, setDossiers] = useState<AdminDossier[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const { data, error } = await supabase
      .from('dossiers')
      .select(SELECT)
      .order('submitted_at', { ascending: false, nullsFirst: false })

    if (error || !data) {
      setLoading(false)
      return
    }

    setDossiers(
      (data as unknown as Embedded[]).map((row) => ({
        ...row,
        applicant: row.profiles
          ? `${row.profiles.first_name} ${row.profiles.last_name}`.trim()
          : 'Porteur de projet',
        email: row.profiles?.email ?? '—',
        documents: row.documents ?? [],
        eligibility: row.eligibility ?? null,
        phases: (row.phase_results ?? []).sort((a, b) => a.phase - b.phase),
        funding: row.funding_proofs ?? null,
      })),
    )
    setLoading(false)
  }, [])

  useEffect(() => {
    // Chargement initial depuis la base : c'est précisément la synchronisation
    // avec un système externe pour laquelle un effet est fait.
    // oxlint-disable-next-line react/set-state-in-effect
    void reload()
  }, [reload])

  return { dossiers, loading, reload }
}
