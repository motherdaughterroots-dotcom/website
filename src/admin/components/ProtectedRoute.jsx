import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-ivory)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--color-olive)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--color-bark)]/50">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}