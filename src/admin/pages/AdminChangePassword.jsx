import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../components/AdminLayout'
import AdminToast from '../components/AdminToast'

export default function AdminChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast]     = useState(null)

  const showToast = (type, message) => setToast({ type, message })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from your current password.')
      return
    }

    setLoading(true)

    // Re-verify current password before allowing the change
    const { data: { user } } = await supabase.auth.getUser()
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user?.email,
      password: currentPassword,
    })

    if (verifyError) {
      setLoading(false)
      setError('Current password is incorrect.')
      return
    }

    // Update to the new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    showToast('success', 'Password updated successfully')
  }

  return (
    <AdminLayout>
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      <div className="p-5 sm:p-7 max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="font-display text-2xl text-[var(--color-bark)]">Change Password</h1>
          <p className="text-sm text-[var(--color-bark)]/50 mt-0.5">
            Update the password used to sign in to the admin panel
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border border-[var(--color-cream-line)] shadow-sm p-7"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current password */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-bark)]/60 mb-1.5 uppercase tracking-wide">
                Current Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-bark)]/30" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors"
                  placeholder="Enter current password"
                />
                <button type="button" onClick={() => setShowCurrent(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-bark)]/30 hover:text-[var(--color-bark)]/60">
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-bark)]/60 mb-1.5 uppercase tracking-wide">
                New Password
              </label>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-bark)]/30" />
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors"
                  placeholder="At least 6 characters"
                />
                <button type="button" onClick={() => setShowNew(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-bark)]/30 hover:text-[var(--color-bark)]/60">
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm new password */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-bark)]/60 mb-1.5 uppercase tracking-wide">
                Confirm New Password
              </label>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-bark)]/30" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors"
                  placeholder="Re-enter new password"
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-bark)]/30 hover:text-[var(--color-bark)]/60">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-[var(--color-olive)] text-white font-medium text-sm hover:bg-[var(--color-terracotta)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Updating...</>
                : 'Update Password'}
            </button>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  )
}