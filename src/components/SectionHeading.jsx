import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', light = false }) {
  const a = align === 'left' ? 'items-start text-left' : 'items-center text-center';
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${a} mb-10 sm:mb-14`}
    >
      {eyebrow && (
        <span className={`font-script text-2xl sm:text-3xl mb-1 ${light ? 'text-[var(--color-gold-light)]' : 'text-[var(--color-terracotta)]'}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`font-display text-3xl sm:text-4xl lg:text-[44px] leading-[1.1] max-w-2xl ${light ? 'text-[var(--color-ivory)]' : 'text-[var(--color-bark)]'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-[15px] sm:text-base max-w-xl leading-relaxed ${light ? 'text-[var(--color-ivory)]/70' : 'text-[var(--color-bark)]/65'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
