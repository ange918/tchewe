import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Role = 'candidate' | 'admin'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  birthDate: string
  role: Role
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  birthDate: string
  password: string
}

interface Account extends User {
  password: string
}

interface AuthState {
  user: User | null
  accounts: Account[]
  register: (payload: RegisterPayload) => { ok: true; user: User } | { ok: false; error: string }
  login: (email: string, password: string) => { ok: true; user: User } | { ok: false; error: string }
  logout: () => void
}

/**
 * Authentification de démonstration : les comptes vivent dans le navigateur.
 * Une adresse contenant « admin » ouvre le back-office, ce qui permet de
 * parcourir les deux côtés du parcours sans backend.
 */
function roleFor(email: string): Role {
  return email.toLowerCase().includes('admin') ? 'admin' : 'candidate'
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: [],

      register: (payload) => {
        const email = payload.email.trim().toLowerCase()
        if (get().accounts.some((account) => account.email === email)) {
          return { ok: false, error: 'Un compte existe déjà avec cette adresse e-mail.' }
        }
        const account: Account = {
          id: `usr_${Date.now().toString(36)}`,
          firstName: payload.firstName.trim(),
          lastName: payload.lastName.trim(),
          email,
          birthDate: payload.birthDate,
          password: payload.password,
          role: roleFor(email),
        }
        const { password: _password, ...user } = account
        set((state) => ({ accounts: [...state.accounts, account], user }))
        return { ok: true, user }
      },

      login: (email, password) => {
        const normalized = email.trim().toLowerCase()
        const account = get().accounts.find((item) => item.email === normalized)
        if (!account || account.password !== password) {
          return { ok: false, error: 'Adresse e-mail ou mot de passe incorrect.' }
        }
        const { password: _password, ...user } = account
        set({ user })
        return { ok: true, user }
      },

      logout: () => set({ user: null }),
    }),
    { name: 'innova-fund.auth' },
  ),
)
