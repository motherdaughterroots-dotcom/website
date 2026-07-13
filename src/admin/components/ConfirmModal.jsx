import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, loading = false }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[160] bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-md"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-display text-lg text-[var(--color-bark)] mb-1">{title}</h3>
                <p className="text-sm text-[var(--color-bark)]/60 leading-relaxed">{message}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={onCancel} disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-[var(--color-cream-line)] text-sm font-medium text-[var(--color-bark)]/70 hover:bg-[var(--color-beige)] transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button onClick={onConfirm} disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2">
                {loading && <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}