import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Only signed-in people can see the pages inside this route.
// Everyone else is sent to the login page, then brought back afterwards.
export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <Loader2 size={32} className="animate-spin text-aqua-blue" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
