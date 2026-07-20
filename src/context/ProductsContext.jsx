import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchProductsFromSupabase } from '../lib/productsApi';
import { fetchCombosFromSupabase } from '../lib/combosApi';
import { PRODUCT_CATEGORIES } from '../admin/constants/productCategories';

const COMBO_CATEGORY = { id: 'combos', label: 'Combos', emoji: '🎁' };

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await fetchProductsFromSupabase();
        if (cancelled) return;

        const productLookup = Object.fromEntries(list.map((p) => [p.id, p]));
        const comboList = await fetchCombosFromSupabase(productLookup);

        if (!cancelled) {
          setProducts(list);
          setCombos(comboList);
        }
      } catch (err) {
        console.error('Failed to load catalog from Supabase:', err);
        if (!cancelled) {
          setProducts([]);
          setCombos([]);
          setError(err?.message || 'Could not load products');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => {
    const catalog = [...products, ...combos].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );

    const categories = [
      ...PRODUCT_CATEGORIES.map((category) => ({
        id: category.id,
        name: category.label,
        emoji: category.emoji,
        productCount: products.filter((p) => p.category === category.id).length,
      })),
      ...(combos.length
        ? [{
            id: COMBO_CATEGORY.id,
            name: COMBO_CATEGORY.label,
            emoji: COMBO_CATEGORY.emoji,
            productCount: combos.length,
          }]
        : []),
    ];

    const getProductById = (id) => catalog.find((item) => item.id === id);
    const featured = catalog.filter((item) => item.isFeatured);

    return {
      products: catalog,
      singles: products,
      combos,
      categories,
      featured: featured.length ? featured : catalog,
      loading,
      error,
      getProductById,
    };
  }, [products, combos, loading, error]);

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
