import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Droplets, Wind, Heart, Sparkles, Package, ArrowRight } from 'lucide-react';

const ICON_MAP = {
  'face-care':         Leaf,       // 🌿 Face Care
  'body-care':         Droplets,   // 🛁 Body Care
  'hair-care':         Wind,       // 💇 Hair Care
  'lip-care':          Heart,      // 💋 Lip Care
  'fragrances':        Sparkles,   // 🌸 Fragrances
  'herbal-essentials': Package,    // 🌱 Herbal Essentials
  soaps:               Droplets,
  skincare:            Leaf,
  haircare:            Wind,
  cosmetics:           Sparkles,
  powders:             Package,
  oils:                Droplets,
};

const GRADIENT_MAP = {
  'face-care':         'bg-gradient-to-br from-[#5C6B45]/15 via-[#FAF6EE]/60 to-[#FAF6EE]',
  'body-care':         'bg-gradient-to-br from-[#8A6E3C]/20 via-[#E8DFC8]/60 to-[#E8DFC8]',
  'hair-care':         'bg-gradient-to-br from-[#3F4B30]/15 via-[#F2EBDA]/60 to-[#F2EBDA]',
  'lip-care':          'bg-gradient-to-br from-[#C9603A]/20 via-[#DCCFAE]/60 to-[#DCCFAE]',
  'fragrances':        'bg-gradient-to-br from-[#B89456]/15 via-[#FAF6EE]/60 to-[#FAF6EE]',
  'herbal-essentials': 'bg-gradient-to-br from-[#5C6B45]/20 via-[#E8DFC8]/60 to-[#E8DFC8]',
};

const ICON_COLOR_MAP = {
  'face-care':         'text-[#5C6B45]',
  'body-care':         'text-[#8A6E3C]',
  'hair-care':         'text-[#3F4B30]',
  'lip-care':          'text-[#C9603A]',
  'fragrances':        'text-[#B89456]',
  'herbal-essentials': 'text-[#5C6B45]',
};

const ICON_BG_MAP = {
  'face-care':         'bg-[#5C6B45]/10',
  'body-care':         'bg-[#8A6E3C]/10',
  'hair-care':         'bg-[#3F4B30]/10',
  'lip-care':          'bg-[#C9603A]/10',
  'fragrances':        'bg-[#B89456]/10',
  'herbal-essentials': 'bg-[#5C6B45]/10',
};

/**
 * Animated category icon card for the Home page categories section.
 *
 * @param {{ id: string, name: string, emoji: string }} category
 * @param {number} index - Used for entrance animation stagger delay.
 */
export default function CategoryIconCard({ category, index = 0 }) {
  const Icon = ICON_MAP[category.id] ?? Package;
  const gradient = GRADIENT_MAP[category.id] ?? GRADIENT_MAP['herbal-essentials'];
  const iconColor = ICON_COLOR_MAP[category.id] ?? 'text-[#5C6B45]';
  const iconBg = ICON_BG_MAP[category.id] ?? 'bg-[#5C6B45]/10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/shop?category=${category.id}`}
        aria-label={`${category.name} — Shop now`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9603A] focus-visible:ring-offset-2 rounded-2xl"
      >
        <motion.div
          whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(43,33,24,0.12)' }}
          transition={{ duration: 0.25 }}
          className={`relative flex flex-col items-center justify-center gap-4 aspect-[3/4] rounded-2xl overflow-hidden ${gradient} p-5`}
        >
          {/* Floating icon */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.5, ease: 'easeInOut' }}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${iconBg} flex items-center justify-center shadow-sm`}
          >
            <Icon size={32} className={iconColor} strokeWidth={1.5} />
          </motion.div>

          {/* Text */}
          <div className="text-center">
            <p className="font-display text-lg sm:text-xl text-[#2B2118] leading-tight mb-1">
              {category.name}
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-[#2B2118]/55 group-hover:gap-2 transition-all duration-300">
              Shop now <ArrowRight size={11} />
            </span>
          </div>

          {/* Subtle decorative circle */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/20 pointer-events-none" />
          <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/15 pointer-events-none" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
