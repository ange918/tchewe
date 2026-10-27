import {
  CollectionIcon,
  UserPlusIcon,
  FileBlankIcon,
  MoneyIcon,
  ReceiptIcon,
  TimerIcon,
  BadgeCheckIcon,
  CloseIcon,
} from '../ui/icons'
import { SidebarShell, type SidebarItem } from './SidebarShell'
import { useAuth } from '../../store/auth'
import { useDossiers } from '../../hooks/useDossiers'
import { STAGES } from '../../lib/pipeline'

/** Une icône par étape, dans l'ordre du parcours. */
const ICONES = [FileBlankIcon, TimerIcon, BadgeCheckIcon, ReceiptIcon, MoneyIcon, CloseIcon]

export function AdminLayout() {
  const user = useAuth((state) => state.user)
  const logout = useAuth((state) => state.logout)
  const { dossiers } = useDossiers()

  const items: SidebarItem[] = [
    { to: '/admin', label: 'Tableau de bord', icon: CollectionIcon, exact: true },
    ...STAGES.map((stage, index) => ({
      to: `/admin/${stage.slug}`,
      label: stage.short,
      icon: ICONES[index],
      count: dossiers.filter((d) => stage.statuses.includes(d.status)).length,
      attention: stage.actionable,
    })),
    // Hors du tunnel : s'inscrire n'est pas une étape du parcours d'un dossier.
    { to: '/admin/comptes', label: 'Comptes inscrits', icon: UserPlusIcon },
  ]

  return (
    <SidebarShell
      section="Back-office"
      items={items}
      identity={{
        primary:
          `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Administrateur',
        secondary: user?.email,
      }}
      onLogout={() => {
        // Voir DashboardLayout : navigation complète à la déconnexion.
        void logout()
        window.location.assign('/')
      }}
      wide
    />
  )
}
