import {
  CollectionIcon,
  UserPlusIcon,
  LockIcon,
  FileBlankIcon,
  MoneyIcon,
  ReceiptIcon,
  TimerIcon,
  BadgeCheckIcon,
  CloseIcon,
} from '../ui/icons'
import { AdminShell } from './AdminShell'
import { useAuth } from '../../store/auth'
import { useDossiers } from '../../hooks/useDossiers'
import { STAGES } from '../../lib/pipeline'

const ICONES = [FileBlankIcon, TimerIcon, BadgeCheckIcon, ReceiptIcon, MoneyIcon, CloseIcon]

export function AdminLayout() {
  const user = useAuth((state) => state.user)
  const logout = useAuth((state) => state.logout)
  const { dossiers } = useDossiers()

  const pendingProofs = dossiers.filter((dossier) => dossier.status === 'proofs_submitted').length
  const pendingNew = dossiers.filter((dossier) => dossier.status === 'submitted').length
  const pending = pendingProofs + pendingNew
  const pendingTo = pendingProofs > 0 ? '/admin/preuves' : '/admin/nouveaux'

  return (
    <AdminShell
      firstName={user?.firstName || 'Administrateur'}
      email={user?.email}
      pending={pending}
      pendingTo={pendingTo}
      onLogout={() => {
        void logout()
        window.location.assign('/')
      }}
      items={[
        { to: '/admin', label: 'Tableau de bord', icon: CollectionIcon, exact: true },
        ...STAGES.map((stage, index) => ({
          to: `/admin/${stage.slug}`,
          label: stage.short,
          icon: ICONES[index],
          count: dossiers.filter((dossier) => stage.statuses.includes(dossier.status)).length,
          attention: stage.actionable,
        })),
        { to: '/admin/comptes', label: 'Comptes inscrits', icon: UserPlusIcon },
        { to: '/admin/mot-de-passe', label: 'Mot de passe', icon: LockIcon },
      ]}
    />
  )
}
