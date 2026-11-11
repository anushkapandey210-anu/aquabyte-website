import { useAuth } from '../context/AuthContext'
import { isAdmin } from '../services/auth'
import AccessDenied from './AccessDenied'

// Wrap a page with this to make it admins-only.
// Important: the backend must check this too. Hiding the page alone isn't enough.
export default function AdminRoute({ children }) {
  const { user } = useAuth()
  return isAdmin(user) ? children : <AccessDenied />
}
