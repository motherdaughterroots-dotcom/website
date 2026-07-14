import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchProductsFromSupabase,
  categoriesFromProducts,
} from '../lib/productsApi';

import { PRODUCT_CATEGORIES } from '../admin/constants/productCategories';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await fetchProductsFromSupabase();
        if (!cancelled) setProducts(list);
      } catch (err) {
        console.error('Failed to load products from Supabase:', err);
        if (!cancelled) {
          setProducts([]);
          setError(err?.message || 'Could not load products');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => {
    // const categories = categoriesFromProducts(products);
    const categories = PRODUCT_CATEGORIES.map(category => ({
      id: category.id,
      name: category.label,
      emoji: category.emoji,
      productCount: products.filter(
        p => p.category === category.id
      ).length,
    }));
    const getProductById = (id) => products.find(p => p.id === id);
    const featured = products.filter(p => p.isFeatured);
    return {
      products,
      categories,
      featured: featured.length ? featured : products,
      loading,
      error,
      getProductById,
    };
  }, [products, loading, error]);

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
