import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';
import { usePageTitle } from '../hooks/usePageTitle';

const ALL = { id: 'all', name: 'All Products', emoji: '🌱' };
const CATS = [ALL, ...categories];

export default function Shop() {
  usePageTitle('Shop — Mother Daughter Roots');

  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(params.get('category') || 'all');

  useEffect(() => {
    const cat = params.get('category');
    if (cat) setActive(cat);
  }, [params]);

  const setCategory = (id) => {
    setActive(id);
    setParams(id === 'all' ? {} : { category: id });
  };

  const visible = products.filter(p => {
    const matchCat = active === 'all' || p.category === active;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.keyIngredients?.some(k => k.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Header */}
      <div className="bg-[var(--color-ivory-deep)]/60 border-b border-[var(--color-cream-line)] py-10 sm:py-14 px-6 sm:px-8 mb-10">
        <div className="max-w-7xl mx-auto">
          <span className="font-script text-2xl sm:text-3xl text-[var(--color-terracotta)]">Browse the collection</span>
          <h1 className="font-display text-3xl sm:text-5xl text-[var(--color-bark)] mt-1 mb-6">All Products</h1>
          {/* Search */}
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-bark)]/40" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or ingredient…"
              aria-label="Search products"
              className="w-full pl-10 pr-10 py-3 rounded-full border border-[var(--color-cream-line)] bg-white text-sm placeholder:text-[var(--color-bark)]/35 focus:outline-none focus:border-[var(--color-terracotta)] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-bark)]/40 hover:text-[var(--color-terracotta)]"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Category tabs with animated active pill */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-10" role="group" aria-label="Filter by category">
          {CATS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              aria-pressed={active === cat.id}
              className={`relative overflow-hidden px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap
                ${active === cat.id
                  ? 'text-white shadow-md'
                  : 'bg-white border border-[var(--color-cream-line)] text-[var(--color-olive)] hover:border-[var(--color-olive)]'}`}
            >
              {/* Animated background pill for active state */}
              {active === cat.id && (
                <motion.span
                  layoutId="shop-cat-pill"
                  className="absolute inset-0 rounded-full bg-[var(--color-olive)] -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{cat.emoji} {cat.name}</span>
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm text-[var(--color-bark)]/50 mb-8">
          {visible.length} product{visible.length !== 1 ? 's' : ''}{search ? ` matching "${search}"` : ''}
        </p>

        {/* Grid */}
        {visible.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
            <AnimatePresence>
              {visible.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-display text-2xl text-[var(--color-olive)] mb-3">No products found</p>
            <p className="text-sm text-[var(--color-bark)]/50 mb-6">Try a different search term or browse all categories</p>
            <button
              onClick={() => { setSearch(''); setCategory('all'); }}
              className="px-6 py-2.5 rounded-full bg-[var(--color-olive)] text-white text-sm font-medium hover:bg-[var(--color-terracotta)] transition-colors"
            >
              Show All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
