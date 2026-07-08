import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function RootDivider({ flip = false, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const paths = [
    'M150 2 V22 C150 37 140 42 124 50 C107 59 97 68 94 83',
    'M150 2 V27 C150 42 160 47 174 54 C192 63 202 72 205 87',
    'M150 8 V32 C150 44 144 48 133 54 C120 62 113 70 111 80',
    'M150 8 V32 C150 44 156 48 167 54 C180 62 187 70 189 80',
    'M150 0 V52',
  ];

  return (
    <div ref={ref} className={`flex justify-center py-4 select-none ${className}`} aria-hidden>
      <svg viewBox="0 0 300 92" fill="none"
        className={`w-36 sm:w-48 h-auto text-[var(--color-gold)] ${flip ? 'rotate-180' : ''}`}>
        {paths.map((d, i) => (
          <motion.path key={i} d={d} stroke="currentColor"
            strokeWidth={i === 4 ? 2.5 : 1.5} strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.1, delay: i * 0.13, ease: [0.65, 0, 0.35, 1] }}
          />
        ))}
        <motion.circle cx="150" cy="7" r="4.5" fill="var(--color-terracotta)"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.85, duration: 0.45, ease: 'backOut' }}
        />
      </svg>
    </div>
  );
}
