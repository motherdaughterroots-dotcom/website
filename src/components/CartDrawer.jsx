import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, MessageCircle, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getWhatsAppOrderLink } from '../utils/whatsapp';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQty, removeItem, subtotal } = useCart();
  const [name, setName] = useState('');

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-[var(--color-bark)]/50 backdrop-blur-sm z-[60]" />

          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 33 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[430px] bg-[var(--color-ivory)] z-[70] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-cream-line)]">
              <h2 className="font-display text-2xl text-[var(--color-olive)]">Your Basket</h2>
              <button onClick={() => setIsCartOpen(false)} aria-label="Close cart"
                className="p-2 text-[var(--color-olive)] hover:text-[var(--color-terracotta)] transition-colors">
                <X size={24} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="w-20 h-20 rounded-full bg-[var(--color-beige)] flex items-center justify-center">
                  <ShoppingBag size={30} className="text-[var(--color-gold)]" />
                </div>
                <p className="font-display text-xl text-[var(--color-olive)]">Your basket is empty</p>
                <p className="text-sm text-[var(--color-bark)]/55">Add some herbal goodness and come back!</p>
                <Link to="/shop" onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-6 py-2.5 rounded-full bg-[var(--color-olive)] text-white text-sm font-medium hover:bg-[var(--color-terracotta)] transition-colors">
                  Browse Products
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 pb-5 border-b border-[var(--color-cream-line)]/60">
                      <img src={item.image} alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover bg-[var(--color-beige)] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-medium text-[var(--color-olive)] leading-snug pr-2 line-clamp-2">{item.name}</h3>
                        <p className="text-xs text-[var(--color-bark)]/50 mt-0.5">{item.netQty}</p>
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center gap-2 border border-[var(--color-cream-line)] rounded-full px-1.5">
                            <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity"
                              className="p-1 text-[var(--color-olive)] hover:text-[var(--color-terracotta)]">
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity"
                              className="p-1 text-[var(--color-olive)] hover:text-[var(--color-terracotta)]">
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="font-display text-[15px] text-[var(--color-bark)]">₹{item.price * item.qty}</span>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}
                        className="text-[var(--color-bark)]/25 hover:text-[var(--color-terracotta)] transition-colors flex-shrink-0">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="sticky bottom-0 border-t border-[var(--color-cream-line)] px-6 py-5 space-y-4 bg-[var(--color-ivory-deep)]/95 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-bark)]/65">Subtotal</span>
                    <span className="font-display text-xl text-[var(--color-olive)]">₹{subtotal}</span>
                  </div>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your name (optional, for the order)"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-cream-line)] bg-white text-sm placeholder:text-[var(--color-bark)]/35 focus:outline-none focus:border-[var(--color-terracotta)] transition-colors" />
                  <a href={getWhatsAppOrderLink(items, name)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe5d] transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30">
                    <MessageCircle size={19} />
                    Order on WhatsApp
                  </a>
                  <p className="text-[11px] text-center text-[var(--color-bark)]/40">
                    Opens WhatsApp with your full order — pre-filled and ready to send
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
