import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, LogOut, Menu, X, ExternalLink } from 'lucide-react'
import { useAdminAuth } from '../../hooks/useAdminAuth'

const navLinks = [
  { to: '/admin/products', icon: Package, label: 'Products' },
]

export default function AdminLayout({ children }) {
  const { session, signOut } = useAdminAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--color-cream-line)]">
        <div className="flex items-center gap-3">
          <img src="/images/brand/logo.png" alt="MDR" className="w-9 h-9 rounded-full object-cover" />
          <div>
            <p className="font-display text-sm text-[var(--color-olive)] leading-tight">MDR Admin</p>
            <p className="text-[10px] text-[var(--color-bark)]/40 truncate max-w-[140px]">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
               ${isActive
                 ? 'bg-[var(--color-olive)] text-white'
                 : 'text-[var(--color-bark)]/70 hover:bg-[var(--color-beige)] hover:text-[var(--color-bark)]'}`
            }>
            <Icon size={17} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-[var(--color-cream-line)] space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-bark)]/60 hover:bg-[var(--color-beige)] transition-colors">
          <ExternalLink size={16} /> View Website
        </a>
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[var(--color-ivory)] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-[var(--color-cream-line)] flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/30 z-[80]"
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="lg:hidden fixed top-0 left-0 h-full w-56 bg-white border-r border-[var(--color-cream-line)] z-[90]"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[var(--color-cream-line)]">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 text-[var(--color-bark)]/60">
            <Menu size={22} />
          </button>
          <span className="font-display text-base text-[var(--color-olive)]">MDR Admin</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}