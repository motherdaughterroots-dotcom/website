import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);
const KEY = 'mdr_cart_v1';

function getLineTotal(item) {
  if (item.kind === 'combo') return item.price * item.qty; // combos already carry their own discount in price
  return getItemTotal(item.price, item.qty, item.discountPercent || 0);
}

// ── Discount logic — percent now comes from each product's own admin setting ──
const BULK_MIN_QTY = 3;

export function getItemDiscount(qty, discountPercent = 0) {
  return qty >= BULK_MIN_QTY ? (Number(discountPercent) || 0) : 0;
}

export function getDiscountedPrice(price, qty, discountPercent = 0) {
  const pct = getItemDiscount(qty, discountPercent);
  return pct > 0 ? Math.round(price * (1 - pct / 100)) : price;
}

export function getItemTotal(price, qty, discountPercent = 0) {
  return getDiscountedPrice(price, qty, discountPercent) * qty;
}
// ────────────────────────────────────────────────────────────────────────────

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setItems(JSON.parse(s)); } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const addItem = useCallback((product, qty = 1) => {
    setItems(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        netQty: product.netQty,
        qty,
        kind: product.kind || 'product',
        discountPercent: product.discountPercent || 0,
        comboOriginalUnitPrice: product.kind === 'combo' ? (product.originalTotal || product.price) : undefined,
      }];
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((id) => setItems(p => p.filter(i => i.id !== id)), []);

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) { setItems(p => p.filter(i => i.id !== id)); return; }
    setItems(p => p.map(i => i.id === id ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  const subtotal = items.reduce((s, i) => s + getLineTotal(i), 0);
  const originalTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalSaved = originalTotal - subtotal;

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart,
      totalItems, subtotal, originalTotal, totalSaved,
      isCartOpen, setIsCartOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}