import { create } from 'zustand'

export type ToastTone = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

interface ToastStore {
  toasts: Toast[]
  push: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: number) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => ({ toasts: [...state.toasts, { ...toast, id: Date.now() + Math.random() }] })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
}))

/** Notifications transitoires — confirmations, erreurs de formulaire, décisions admin. */
export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, tone: 'success' }),
  error: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, tone: 'error' }),
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, tone: 'info' }),
}
