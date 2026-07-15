import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, Leaf } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  // If already logged in, redirect
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin/products', { replace: true })
    })
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Wrong email or password. Please try again.'
        : error.message)
    } else {
      navigate('/admin/products', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-ivory)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/images/brand/logo.png" alt="Mother Daughter Roots"
            className="w-20 h-20 rounded-full object-cover shadow-lg mb-4" />
          <h1 className="font-display text-2xl text-[var(--color-olive)]">Admin Panel</h1>
          <p className="text-sm text-[var(--color-bark)]/50 mt-1">Mother Daughter Roots</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[var(--color-cream-line)] shadow-sm p-7">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-bark)]/60 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-bark)]/30" />
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-bark)]/60 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-bark)]/30" />
                <input
                  type={showPw ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors"
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-bark)]/30 hover:text-[var(--color-bark)]/60">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
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
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in...</>
                : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--color-bark)]/35 mt-5 flex items-center justify-center gap-1">
          <Leaf size={11} /> Mother Daughter Roots — Admin Only
        </p>
      </motion.div>
    </div>
  )
}