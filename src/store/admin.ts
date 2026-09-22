import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DossierStatus } from './application'

interface AdminState {
  /** Statuts modifiés depuis le back-office pour les dossiers du jeu de démonstration. */
  overrides: Record<string, DossierStatus>
  notes: Record<string, string>
  setStatus: (id: string, status: DossierStatus, note?: string) => void
  reset: () => void
}

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      overrides: {},
      notes: {},
      setStatus: (id, status, note) =>
        set((state) => ({
          overrides: { ...state.overrides, [id]: status },
          notes: note ? { ...state.notes, [id]: note } : state.notes,
        })),
      reset: () => set({ overrides: {}, notes: {} }),
    }),
    { name: 'innova-fund.admin' },
  ),
)
