import { FolderIcon, ReceiptIcon } from '../ui/icons'
import { SidebarShell, type SidebarItem } from './SidebarShell'
import { useAuth } from '../../store/auth'

const ITEMS: SidebarItem[] = [
  { to: '/admin/dossiers', label: 'Dossiers', icon: FolderIcon },
  { to: '/admin/verifications', label: 'Vérifications', icon: ReceiptIcon },
]

export function AdminLayout() {
  const user = useAuth((state) => state.user)
  const logout = useAuth((state) => state.logout)

  return (
    <SidebarShell
      section="Back-office"
      items={ITEMS}
      identity={{ primary: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Administrateur', secondary: user?.email }}
      onLogout={() => {
        // Voir DashboardLayout : navigation complète à la déconnexion.
        void logout()
        window.location.assign('/')
      }}
      wide
    />
  )
}
