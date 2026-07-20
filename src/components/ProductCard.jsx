// import { motion } from 'framer-motion';
// import { Plus, Check } from 'lucide-react';
// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import Toast from './Toast';

// export default function ProductCard({ product, index = 0 }) {
//   const { addItem } = useCart();
//   const [added, setAdded] = useState(false);

//   const handleAdd = (e) => {
//     e.preventDefault();
//     addItem(product);
//     setAdded(true);
//     setTimeout(() => setAdded(false), 1600);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: '-50px' }}
//       transition={{ duration: 0.55, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
//       whileHover={{ y: -5 }}
//       className="group"
//     >
//       <Link to={`/product/${product.id}`} className="block">
//         <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--color-beige)] mb-4">
//           <img
//             src={product.image}
//             alt={product.name}
//             loading="lazy"
//             decoding="async"
//             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bark)]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//           <button
//             onClick={handleAdd}
//             aria-label={`Add ${product.name} to cart`}
//             className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
//               ${added ? 'bg-[var(--color-olive)]' : 'bg-white hover:bg-[var(--color-terracotta)] hover:scale-110'}`}
//           >
//             {added
//               ? <Check size={17} className="text-white" />
//               : <Plus size={18} className="text-[var(--color-olive)] group-hover:text-[var(--color-terracotta)] transition-colors" />
//             }
//           </button>
//         </div>
//         <div className="px-1">
//           <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-gold)] font-medium mb-1">{product.subcategory}</p>
//           <h3 className="font-display text-[16px] text-[var(--color-bark)] leading-snug mb-2 line-clamp-2">{product.name}</h3>
//           <div className="flex items-center justify-between">
//             <span className="font-display text-[17px] text-[var(--color-olive)]">₹{product.price}</span>
//             <span className="text-xs text-[var(--color-bark)]/45">{product.netQty}</span>
//           </div>
//         </div>
//       </Link>

//       {/* Toast sits outside Link so it doesn't trigger navigation */}
//       <Toast message="Added to basket!" visible={added} />
//     </motion.div>
//   );
// }

import { motion } from 'framer-motion';
import { Plus, Check, Tag } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, getItemDiscount, getItemTotal } from '../context/CartContext';
import Toast from './Toast';

export default function ProductCard({ product, index = 0 }) {
  const { items, addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState({ message: 'Added to basket!', variant: 'success' });

  const handleAdd = (e) => {
    e.preventDefault();
    const currentQty = items.find(item => item.id === product.id)?.qty || 0;
    const nextQty = currentQty + 1;
    const discountPct = getItemDiscount(nextQty);
    const saving = product.price * nextQty - getItemTotal(product.price, nextQty);

    addItem(product);
    setToast(discountPct > 0
      ? {
          message: `Congratulations! You got ${discountPct}% off and saved Rs.${saving}`,
          variant: 'discount',
        }
      : {
          message: 'Added to basket!',
          variant: 'success',
        });
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
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bark)]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge */}
          {product.kind === 'combo' ? (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-olive)] text-white text-[10px] font-bold shadow-md">
              <Tag size={9} />
              Combo Pack
            </div>
          ) : (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-terracotta)] text-white text-[10px] font-bold shadow-md">
              <Tag size={9} />
              Buy 3+ · 15% OFF
            </div>
          )}

          {/* Add to cart button */}
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
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-[17px] text-[var(--color-olive)]">₹{product.price}</span>
            </div>
            <span className="text-xs text-[var(--color-bark)]/45">{product.netQty}</span>
          </div>
        </div>
      </Link>

      <Toast message={toast.message} visible={added} variant={toast.variant} />
    </motion.div>
  );
}
