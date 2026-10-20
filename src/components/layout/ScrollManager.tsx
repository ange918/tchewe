import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Tous les fragments d'URL ne désignent pas une ancre. Supabase renvoie le
 * résultat d'un lien d'e-mail sous la forme « #access_token=…&expires_at=… » :
 * passer cela à querySelector lève une exception, parce que ce n'est pas un
 * sélecteur CSS valide. On ne tente donc la recherche que sur un identifiant
 * simple, celui que produisent nos propres liens d'ancre.
 */
function isAnchor(hash: string): boolean {
  return /^#[A-Za-z][\w-]*$/.test(hash)
}

/**
 * Remet la page en haut à chaque navigation, et rejoint l'ancre demandée
 * lorsqu'elle existe (liens « Comment ça marche », sections de /a-propos).
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (isAnchor(hash)) {
      // Ceinture et bretelles : un identifiant valide reste possible sans
      // élément correspondant, et une page ne doit jamais tomber pour un lien.
      try {
        const target = document.querySelector(hash)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
      } catch {
        // Fragment inattendu : on se contente de remonter en haut.
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}
