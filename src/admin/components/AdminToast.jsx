import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

// Usage: <AdminToast toast={{ type: 'success'|'error', message: '...' }} onClose={() => setToast(null)} />
export default function AdminToast({ toast, onClose }) {
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => closeRef.current(), 3500)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border max-w-sm
            ${toast.type === 'success'
              ? 'bg-white border-green-200 text-green-800'
              : 'bg-white border-red-200 text-red-700'}`}
        >
          {toast.type === 'success'
            ? <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
            : <XCircle size={18} className="text-red-500 flex-shrink-0" />}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
