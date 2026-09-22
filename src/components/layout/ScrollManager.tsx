import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Remet la page en haut à chaque navigation, et rejoint l'ancre demandée
 * lorsqu'elle existe (liens « Comment ça marche », sections de /a-propos).
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}
