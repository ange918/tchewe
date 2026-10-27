import { useEffect } from 'react'
import { ClipboardIcon, CollectionIcon, LockIcon, TimerIcon, WalletIcon } from '../ui/icons'
import { Badge } from '../ui/Badge'
import { SidebarShell, type SidebarItem } from './SidebarShell'
import { useAuth } from '../../store/auth'
import { STATUS_LABELS, useApplication, type DossierStatus } from '../../store/application'

const STEPS = [
  { to: '/dashboard', label: "Vue d'ensemble", icon: CollectionIcon, exact: true },
  { to: '/dashboard/submission', label: 'Mon dossier', icon: ClipboardIcon },
  { to: '/dashboard/evaluation', label: 'Évaluation', icon: TimerIcon },
  { to: '/dashboard/funding', label: 'Financement', icon: WalletIcon },
] as const

/** Une étape n'est accessible que lorsque le dossier a atteint le statut requis. */
function isUnlocked(to: string, status: DossierStatus): boolean {
  if (to === '/dashboard' || to === '/dashboard/submission') return true
  if (to === '/dashboard/evaluation') {
    return ['approved', 'awaiting_next_phase', 'evaluated', 'proofs_submitted', 'financed'].includes(
      status,
    )
  }
  return ['evaluated', 'proofs_submitted', 'financed'].includes(status)
}

const STATUS_TONE: Record<DossierStatus, 'brand' | 'neutral' | 'success' | 'warning' | 'danger'> = {
  draft: 'neutral',
  submitted: 'warning',
  approved: 'brand',
  awaiting_next_phase: 'warning',
  evaluated: 'success',
  proofs_submitted: 'warning',
  financed: 'success',
  rejected: 'danger',
}

export function DashboardLayout() {
  const user = useAuth((state) => state.user)
  const logout = useAuth((state) => state.logout)
  const dossier = useApplication((state) => state.dossier)
  const load = useApplication((state) => state.load)

  // Crée le brouillon au premier accès et charge l'état réel du dossier.
  useEffect(() => {
    void load()
  }, [load])

  const status = dossier?.status ?? 'draft'

  const items: SidebarItem[] = STEPS.map((step) => ({
    to: step.to,
    label: step.label,
    icon: step.icon,
    exact: 'exact' in step ? step.exact : undefined,
    locked: !isUnlocked(step.to, status),
  }))

  // Hors du parcours : accessible à tout moment, jamais verrouillé.
  items.push({ to: '/dashboard/mot-de-passe', label: 'Mot de passe', icon: LockIcon })

  return (
    <SidebarShell
      section="Espace candidat"
      items={items}
      aside={<Badge tone={STATUS_TONE[status]}>{STATUS_LABELS[status]}</Badge>}
      identity={{
        primary: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Porteur de projet',
        secondary: dossier?.reference ?? 'Nouveau candidat',
      }}
      onLogout={() => {
        // Navigation complète plutôt que `navigate()` : une mise à jour de store
        // externe ne peut pas être différée par React, alors que celle du routeur
        // l'est. Router côté client ferait donc passer un rendu intermédiaire
        // « route protégée, plus d'utilisateur » par le garde, qui détourne vers
        // /auth/login. Le rechargement vide aussi l'état resté en mémoire.
        void logout()
        window.location.assign('/')
      }}
    />
  )
}
