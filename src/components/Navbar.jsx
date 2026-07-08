import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500
      ${scrolled ? 'bg-[var(--color-ivory)]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(43,33,24,0.09)]' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-[72px] sm:h-[82px]">
        {/* Logo */}
        <Link to="/" onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 group z-10 flex-shrink-0">
          <img src="/images/brand/logo.png" alt="Mother Daughter Roots"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-1 ring-[var(--color-gold)]/30 transition-transform duration-500 group-hover:scale-105" />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-[16px] font-medium text-[var(--color-dark)]">Mother Daughter Roots</span>
            <span className="font-script text-[var(--color-terracotta)] text-[13px] -mt-0.5">Rooted in love</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) =>
                `relative text-[14.5px] font-medium transition-colors duration-300
                 ${isActive ? 'text-[var(--color-terracotta)]' : 'text-[var(--color-olive)] hover:text-[var(--color-terracotta)]'}`
              }>
              {({ isActive }) => (
                <span className="relative py-1">
                  {l.label}
                  {isActive && (
                    <motion.span layoutId="nav-ul"
                      className="absolute left-0 -bottom-0.5 w-full h-[1.5px] bg-[var(--color-terracotta)]" />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 z-10">
          <button onClick={() => setIsCartOpen(true)} aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
            className="relative p-2 text-[var(--color-olive)] hover:text-[var(--color-terracotta)] transition-colors">
            <ShoppingBag size={22} strokeWidth={1.75} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-[var(--color-terracotta)] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button onClick={() => navigate('/shop')}
            aria-label="Shop Now"
            className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-[var(--color-olive)] text-[var(--color-ivory)] text-sm font-medium hover:bg-[var(--color-terracotta)] transition-all duration-300">
            Shop Now
          </button>

          <button onClick={() => setOpen(o => !o)} aria-label={open ? 'Close menu' : 'Open menu'}
            className="lg:hidden p-2 text-[var(--color-olive)]">
            {open ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-[var(--color-ivory)] border-t border-[var(--color-cream-line)] overflow-hidden">
            <div className="flex flex-col px-6 py-5 gap-0.5">
              {links.map(l => (
                <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `py-3.5 text-[18px] font-display border-b border-[var(--color-cream-line)]/50
                     ${isActive ? 'text-[var(--color-terracotta)]' : 'text-[var(--color-olive)]'}`
                  }>
                  {l.label}
                </NavLink>
              ))}
              <button onClick={() => { setIsCartOpen(true); setOpen(false); }}
                aria-label={`View cart${totalItems > 0 ? `, ${totalItems} item${totalItems !== 1 ? 's' : ''}` : ''}`}
                className="mt-4 py-3 rounded-full bg-[var(--color-olive)] text-white font-medium text-sm">
                View Cart {totalItems > 0 && `(${totalItems})`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
