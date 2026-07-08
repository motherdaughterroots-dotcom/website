import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * Auto-dismissing toast notification.
 *
 * @param {string}  message - Text to display inside the toast.
 * @param {boolean} visible - Controls whether the toast is shown.
 */
export default function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2.5 px-5 py-3 rounded-full bg-white shadow-xl shadow-[var(--color-bark)]/12 border border-[var(--color-cream-line)] whitespace-nowrap pointer-events-none"
        >
          <span className="w-5 h-5 rounded-full bg-[var(--color-olive)]/10 flex items-center justify-center flex-shrink-0">
            <Check size={12} className="text-[var(--color-olive)]" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-medium text-[var(--color-bark)]">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
