import { Navigate, Outlet } from 'react-router-dom'
import { useStore } from '../../store/useStore'
// UI-only guard. Real authorization must be enforced by a backend.
export default function AdminGuard() {
  const admin = useStore((s) => s.admin)
  return admin ? <Outlet /> : <Navigate to="/admin/login" replace />
}
