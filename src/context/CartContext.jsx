import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);
const KEY = 'mdr_cart_v1';

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
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, netQty: product.netQty, qty }];
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((id) => setItems(p => p.filter(i => i.id !== id)), []);
  const updateQty  = useCallback((id, qty) => {
    if (qty <= 0) { setItems(p => p.filter(i => i.id !== id)); return; }
    setItems(p => p.map(i => i.id === id ? { ...i, qty } : i));
  }, []);
  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subtotal   = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
