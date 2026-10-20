import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

/**
 * Client Supabase de l'application.
 *
 * La clé publiable est destinée au navigateur : elle n'ouvre aucun droit par
 * elle-même, c'est la RLS qui décide de ce que chaque utilisateur peut lire ou
 * écrire. Les transitions de statut passent par des fonctions SQL, jamais par
 * un `update` direct.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !publishableKey) {
  throw new Error(
    'Configuration Supabase manquante : renseignez VITE_SUPABASE_URL et ' +
      'VITE_SUPABASE_PUBLISHABLE_KEY (voir .env.example).',
  )
}

export const supabase = createClient<Database>(url, publishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Les liens de confirmation d'e-mail reviennent avec la session dans le
    // fragment d'URL. Sans cette option, le porteur atterrissait sur le site
    // sans être connecté, et les jetons restaient dans la barre d'adresse.
    detectSessionInUrl: true,
  },
})

/** Messages d'erreur Postgres traduits pour l'interface. */
export function friendlyError(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message: unknown }).message)
    // Les fonctions SQL lèvent déjà des messages rédigés en français.
    if (message && !message.startsWith('{') && message.length < 200) return message
  }
  return fallback
}
