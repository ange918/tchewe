import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { ProfileRow, UserRole } from '../lib/database.types'

export type { UserRole as Role }

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  birthDate: string | null
  role: UserRole
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  birthDate: string
  password: string
}

type Result = { ok: true; user: User } | { ok: false; error: string }

/**
 * L'inscription a trois issues, pas deux. Quand la confirmation par e-mail est
 * active, Supabase crée bien le compte mais n'ouvre pas de session : c'est un
 * succès, pas un échec, et l'interface doit le présenter comme tel.
 */
type RegisterResult = Result | { ok: 'confirm-email' }

interface AuthState {
  user: User | null
  /** Vrai tant que la session n'a pas été relue au démarrage. */
  loading: boolean
  register: (payload: RegisterPayload) => Promise<RegisterResult>
  login: (email: string, password: string) => Promise<Result>
  logout: () => Promise<void>
  initialize: () => () => void
}

function toUser(session: Session, profile: ProfileRow): User {
  return {
    id: profile.id,
    email: session.user.email ?? '',
    firstName: profile.first_name,
    lastName: profile.last_name,
    birthDate: profile.birth_date,
    role: profile.role,
  }
}

/** Le profil est créé par un trigger : il peut arriver juste après la session. */
async function loadProfile(session: Session): Promise<User | null> {
  // Deux tentatives : une inscription toute fraîche peut devancer le trigger,
  // et un incident réseau ne doit pas déconnecter quelqu'un qui a bien une
  // session ouverte.
  for (let essai = 0; essai < 2; essai++) {
    if (essai > 0) await new Promise((r) => setTimeout(r, 400))

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle()

    if (data) return toUser(session, data)
  }
  return null
}

export const useAuth = create<AuthState>()((set) => ({
  user: null,
  loading: true,

  initialize: () => {
    let actif = true

    async function appliquer(session: Session | null) {
      const user = session ? await loadProfile(session) : null
      if (actif) set({ user, loading: false })
    }

    void supabase.auth.getSession().then(({ data }) => appliquer(data.session))

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      // Ne jamais attendre un appel Supabase à l'intérieur de ce rappel : il
      // s'exécute pendant que le verrou d'authentification est tenu, et toute
      // requête qui réclame ce verrou à son tour attendrait indéfiniment. Le
      // symptôme est une application figée sur son écran d'attente. On repasse
      // donc par la file de tâches pour travailler hors du verrou.
      setTimeout(() => void appliquer(session), 0)
    })

    return () => {
      actif = false
      data.subscription.unsubscribe()
    }
  },

  register: async (payload) => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      options: {
        // Le lien de confirmation ramène sur la page de connexion, qui est la
        // suite logique : le compte est actif, il reste à s'y connecter. Sans
        // cette consigne, Supabase renvoie sur la « Site URL » du projet,
        // c'est-à-dire l'accueil, où le porteur ne sait plus quoi faire.
        emailRedirectTo: `${window.location.origin}/auth/login`,
        // Le rôle n'est volontairement pas transmis : le trigger d'inscription
        // force « candidate », quoi que le client envoie.
        data: {
          first_name: payload.firstName.trim(),
          last_name: payload.lastName.trim(),
          birth_date: payload.birthDate,
        },
      },
    })

    if (error) {
      return {
        ok: false,
        error:
          error.message.toLowerCase().includes('already')
            ? 'Un compte existe déjà avec cette adresse e-mail.'
            : error.message,
      }
    }
    // Pas de session : la confirmation par e-mail est active. Le compte est créé.
    if (!data.session) {
      return { ok: 'confirm-email' }
    }

    const user = await loadProfile(data.session)
    if (!user) return { ok: false, error: 'Profil introuvable après l’inscription.' }

    set({ user, loading: false })
    return { ok: true, user }
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error || !data.session) {
      // Distinguer le compte non confirmé : renvoyer « identifiants incorrects »
      // enverrait le porteur vérifier un mot de passe qui est pourtant le bon.
      if (error?.message.toLowerCase().includes('not confirmed')) {
        return {
          ok: false,
          error:
            'Adresse e-mail pas encore confirmée. Ouvrez le lien envoyé lors de votre inscription.',
        }
      }
      return { ok: false, error: 'Adresse e-mail ou mot de passe incorrect.' }
    }

    const user = await loadProfile(data.session)
    if (!user) return { ok: false, error: 'Profil introuvable.' }

    set({ user, loading: false })
    return { ok: true, user }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
