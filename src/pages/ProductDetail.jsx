import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, MessageCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { getProductById, products } from '../data/products';
import { useCart } from '../context/CartContext';
import { getWhatsAppGeneralLink } from '../utils/whatsapp';
import ProductCard from '../components/ProductCard';
import ProductGallery from '../components/ProductGallery';
import Toast from '../components/Toast';
import { usePageTitle } from '../hooks/usePageTitle';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const product = getProductById(id);

  // usePageTitle must be called unconditionally — guard handled inside hook
  usePageTitle(product ? `${product.name} — Mother Daughter Roots` : 'Product — Mother Daughter Roots');

  if (!product) return (
    <div className="pt-40 text-center">
      <p className="font-display text-2xl text-[var(--color-olive)] mb-4">Product not found</p>
      <Link to="/shop" className="text-[var(--color-terracotta)] hover:underline">← Back to shop</Link>
    </div>
  );

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-bark)]/50 mb-8 pt-4">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex items-center gap-1.5 hover:text-[var(--color-terracotta)] transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span>/</span>
          <Link to="/shop" className="hover:text-[var(--color-terracotta)] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[var(--color-bark)]">{product.subcategory}</span>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
          {/* Gallery — sticky on large screens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <ProductGallery
              images={product.images}
              videoUrl={product.videoUrl}
              productName={product.name}
            />
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}>
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-gold)] font-medium mb-2">{product.subcategory}</p>
            <h1 className="font-display text-3xl sm:text-4xl text-[var(--color-bark)] leading-tight mb-2">{product.name}</h1>
            <p className="font-script text-xl text-[var(--color-terracotta)] mb-5">{product.tagline}</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-3xl text-[var(--color-olive)]">₹{product.price}</span>
              <span className="text-sm text-[var(--color-bark)]/50">{product.netQty}</span>
            </div>

            <p className="text-[var(--color-bark)]/65 leading-relaxed mb-7">{product.description}</p>

            {/* Benefits */}
            <div className="mb-7">
              <h2 className="font-display text-lg text-[var(--color-bark)] mb-3">Key Benefits</h2>
              <ul className="space-y-2">
                {product.benefits.map(b => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-[var(--color-bark)]/70">
                    <CheckCircle size={15} className="text-[var(--color-olive)] flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ingredients */}
            {product.keyIngredients?.length > 0 && (
              <div className="mb-7 p-5 rounded-2xl bg-[var(--color-beige)]/50 border border-[var(--color-cream-line)]">
                <h2 className="font-display text-base text-[var(--color-bark)] mb-2">Key Ingredients</h2>
                <div className="flex flex-wrap gap-2">
                  {product.keyIngredients.map(ing => (
                    <span key={ing} className="px-3 py-1 rounded-full bg-white text-xs text-[var(--color-olive)] border border-[var(--color-cream-line)]">
                      {ing}
                    </span>
                  ))}
                </div>
                {product.baseOils?.length > 0 && (
                  <>
                    <p className="text-xs text-[var(--color-bark)]/50 mt-3 mb-1.5">Base Oils</p>
                    <div className="flex flex-wrap gap-2">
                      {product.baseOils.map(o => (
                        <span key={o} className="px-3 py-1 rounded-full bg-white text-xs text-[var(--color-bark)]/60 border border-[var(--color-cream-line)]">{o}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* How to use */}
            <div className="mb-8">
              <h2 className="font-display text-base text-[var(--color-bark)] mb-2">How to Use</h2>
              <p className="text-sm text-[var(--color-bark)]/65 leading-relaxed">{product.howToUse}</p>
              <p className="text-xs text-[var(--color-bark)]/45 mt-2">Suitable for: {product.suitableFor}</p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {product.badges.map(b => (
                <span key={b} className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-olive)]/8 text-[var(--color-olive)] border border-[var(--color-olive)]/15">
                  ✓ {b}
                </span>
              ))}
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3 border border-[var(--color-cream-line)] rounded-full px-4 py-2">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="text-[var(--color-olive)] hover:text-[var(--color-terracotta)] font-medium w-5 text-center"
                >−</button>
                <span className="font-medium w-5 text-center">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  aria-label="Increase quantity"
                  className="text-[var(--color-olive)] hover:text-[var(--color-terracotta)] font-medium w-5 text-center"
                >+</button>
              </div>
              <button
                onClick={handleAdd}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-full font-medium transition-all duration-300
                  ${added ? 'bg-[var(--color-olive)] text-white' : 'bg-[var(--color-bark)] text-white hover:bg-[var(--color-terracotta)] hover:shadow-lg hover:shadow-[var(--color-terracotta)]/20'}`}
              >
                <ShoppingBag size={18} />
                {added ? 'Added to Basket!' : 'Add to Basket'}
              </button>
            </div>

            <a href={getWhatsAppGeneralLink(`Hi! I'm interested in ${product.name}. Is it available?`)}
              target="_blank" rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full border border-[var(--color-cream-line)] text-[var(--color-olive)] font-medium hover:bg-[var(--color-beige)] transition-colors text-sm">
              <MessageCircle size={16} /> Ask about this product on WhatsApp
            </a>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-[var(--color-bark)] mb-8">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-7">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {/* Toast — outside main grid so it's always fixed to viewport */}
      <Toast message="Added to basket!" visible={added} />
    </div>
  );
}
