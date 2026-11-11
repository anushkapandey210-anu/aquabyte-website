import { useAuth } from '../context/AuthContext'
import AccessDenied from './AccessDenied'

// Wrap a page with this to make it admins-only.
// Firestore security rules protect the admin data on the server side too.
export default function AdminRoute({ children }) {
  const { isAdmin } = useAuth()
  return isAdmin ? children : <AccessDenied />
}
