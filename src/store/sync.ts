import { useAdmin } from './admin'
import { useApplication } from './application'
import { useAuth } from './auth'

/**
 * Synchronisation temps réel entre onglets.
 *
 * Les stores sont persistés dans `localStorage` : lorsqu'un onglet écrit (par
 * exemple le back-office qui approuve un dossier), le navigateur émet un
 * évènement `storage` dans les autres onglets. On y réhydrate le store concerné,
 * de sorte que l'espace du porteur débloque son QCM sans rechargement.
 */
export function startCrossTabSync(): () => void {
  const stores = [useApplication, useAdmin, useAuth]

  const onStorage = (event: StorageEvent) => {
    if (!event.key) return
    for (const store of stores) {
      if (event.key === store.persist.getOptions().name) {
        void store.persist.rehydrate()
      }
    }
  }

  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}
