import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface ProfileSummary {
  id: string
  role: string
  created_at: string
}

/**
 * Les comptes inscrits, pour le tableau de bord.
 *
 * Aucun filtre côté client : c'est la politique RLS qui décide. Un candidat qui
 * atteindrait cette page ne verrait que sa propre ligne, et les compteurs
 * afficheraient 1 — jamais les données des autres.
 */
export function useProfiles() {
  const [profiles, setProfiles] = useState<ProfileSummary[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, role, created_at')
      .order('created_at')

    setProfiles((data as ProfileSummary[] | null) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    // Synchronisation avec un système externe : c'est l'usage prévu d'un effet.
    // oxlint-disable-next-line react/set-state-in-effect
    void reload()
  }, [reload])

  return { profiles, loading, reload }
}
