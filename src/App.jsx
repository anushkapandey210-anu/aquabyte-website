import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import Team from './pages/Team'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Devices from './pages/Devices'
import Alerts from './pages/Alerts'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      {/* Signed-in people only */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  )
}