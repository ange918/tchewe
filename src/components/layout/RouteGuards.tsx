import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, type Role } from '../../store/auth'

/** Réserve une branche de l'application aux utilisateurs connectés du bon rôle. */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const user = useAuth((state) => state.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dossiers' : '/dashboard'} replace />
  }

  return <>{children}</>
}
