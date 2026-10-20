import { useEffect } from 'react'
import { toast } from '../../lib/toast'

/** Messages Supabase traduits, pour ne pas renvoyer l'anglais brut au porteur. */
function messageFor(code: string | null, description: string | null): [string, string] {
  if (code === 'otp_expired') {
    return [
      'Lien expiré',
      'Ce lien de confirmation a expiré ou a déjà été utilisé. Si votre compte est déjà confirmé, connectez-vous ; sinon, recommencez votre inscription pour en recevoir un nouveau.',
    ]
  }
  if (code === 'access_denied') {
    return ['Lien invalide', 'Ce lien n’est plus valable. Recommencez depuis la page de connexion.']
  }
  return ['Lien invalide', description ?? 'Ce lien n’a pas pu être utilisé.']
}

/**
 * Supabase renvoie le résultat d'un lien d'e-mail dans le fragment d'URL. Le
 * succès est consommé par le client lui-même, qui ouvre la session et nettoie
 * l'adresse ; l'échec, lui, restait affiché tel quel — le porteur atterrissait
 * sur l'accueil avec « error_code=otp_expired » dans la barre d'adresse et
 * aucune explication.
 */
export function AuthLinkNotice() {
  useEffect(() => {
    const fragment = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
    if (!fragment.includes('error')) return

    const params = new URLSearchParams(fragment)
    const error = params.get('error')
    if (!error) return

    const [title, description] = messageFor(
      params.get('error_code') ?? error,
      params.get('error_description')?.replaceAll('+', ' ') ?? null,
    )
    toast.error(title, description)

    // Retirer le fragment : il n'a plus de sens une fois le message affiché, et
    // il resterait dans l'historique et les partages de lien.
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }, [])

  return null
}
