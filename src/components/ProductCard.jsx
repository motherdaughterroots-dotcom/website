import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Toast from './Toast';

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--color-beige)] mb-4">
          <img src={product.image} alt={product.name} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bark)]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <button
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
              ${added ? 'bg-[var(--color-olive)]' : 'bg-white hover:bg-[var(--color-terracotta)] hover:scale-110'}`}
          >
            {added
              ? <Check size={17} className="text-white" />
              : <Plus size={18} className="text-[var(--color-olive)] group-hover:text-[var(--color-terracotta)] transition-colors" />
            }
          </button>
        </div>
        <div className="px-1">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-gold)] font-medium mb-1">{product.subcategory}</p>
          <h3 className="font-display text-[16px] text-[var(--color-bark)] leading-snug mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="font-display text-[17px] text-[var(--color-olive)]">₹{product.price}</span>
            <span className="text-xs text-[var(--color-bark)]/45">{product.netQty}</span>
          </div>
        </div>
      </Link>

      {/* Toast sits outside Link so it doesn't trigger navigation */}
      <Toast message="Added to basket!" visible={added} />
    </motion.div>
  );
}
