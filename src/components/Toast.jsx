import { AnimatePresence, motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

/**
 * Auto-dismissing toast notification.
 *
 * @param {string}  message - Text to display inside the toast.
 * @param {boolean} visible - Controls whether the toast is shown.
 * @param {'success' | 'discount'} variant - Visual treatment for the toast.
 */
export default function Toast({ message, visible, variant = 'success' }) {
  const isDiscount = variant === 'discount';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] flex max-w-[calc(100vw-2rem)] items-center gap-2.5 px-5 py-3 rounded-full shadow-xl pointer-events-none overflow-hidden ${
            isDiscount
              ? 'bg-[var(--color-terracotta)] text-white shadow-[var(--color-terracotta)]/25 border border-white/20'
              : 'bg-white shadow-[var(--color-bark)]/12 border border-[var(--color-cream-line)]'
          }`}
        >
          {isDiscount && (
            <>
              {[0, 1, 2, 3, 4].map((dot) => (
                <motion.span
                  key={dot}
                  initial={{ opacity: 0.85, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 0,
                    scale: [0, 1, 0.35],
                    x: [-18, -8, 0, 9, 18][dot],
                    y: [-12, 10, -16, 8, -10][dot],
                  }}
                  transition={{ duration: 0.75, delay: dot * 0.04, ease: 'easeOut' }}
                  className="absolute left-6 top-1/2 h-1.5 w-1.5 rounded-full bg-white"
                />
              ))}
            </>
          )}
          <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDiscount ? 'bg-white/18' : 'bg-[var(--color-olive)]/10'
          }`}>
            {isDiscount ? (
              <Sparkles size={12} className="text-white" strokeWidth={2.5} />
            ) : (
              <Check size={12} className="text-[var(--color-olive)]" strokeWidth={2.5} />
            )}
          </span>
          <span className={`text-sm font-medium leading-snug ${isDiscount ? 'text-white' : 'text-[var(--color-bark)]'}`}>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
