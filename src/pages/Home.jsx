// FINAL — Hero from Option B (full-width background image hero)
// Rest of page from Option A (icon category cards, stats-free layout)

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sprout, FlaskConical, PackageCheck, Star, Instagram, ShieldCheck } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import RootDivider from '../components/RootDivider';
import CategoryIconCard from '../components/CategoryIconCard';
import { products, categories } from '../data/products';

// Unsplash CDN — free, no attribution needed for display
// const HERO_BG = 'https://images.openai.com/static-rsc-4/Lv-yMdq9rKtnI5QO_9vOkvITwo9Val05KtKurBGOHZYJZHOwgeKHI7ifWiTtmLO6B0yiKES1xb7iEG8Pq8gHsXwpue_FO1BfeVXq_75DJhFGkqqMsSvPb1XEu-O_qe3m-9EYMF4BXAtdKiy-0S88LaV17udjxCdBzdYEt5aA0Jzgn1U0QswDhXdYJSVG1cnX?purpose=fullsize';

const HERO_BG = 'images/brand/final_korean.png'
const WHY = [
  { icon: Sprout,       title: 'Handmade',          desc: 'Every batch crafted by hand — never mass-produced.' },
  { icon: Leaf,         title: 'Herbal Ingredients', desc: 'Real turmeric, neem, amla — not diluted extracts.' },
  { icon: FlaskConical, title: 'Chemical-Free',      desc: 'No parabens, sulphates, or artificial fragrance.' },
  { icon: PackageCheck, title: 'Small-Batch',        desc: 'Made fresh in small quantities for true potency.' },
];

const TESTIMONIALS = [
  { name: 'Ayesha R.',  rating: 5, text: 'The charcoal soap completely transformed my skin in two weeks. You can smell the real neem and charcoal — not a synthetic imitation.' },
  { name: 'Fatima K.',  rating: 5, text: 'I switched my whole family to the hair oil. My mother-in-law now demands it every month. That says everything.' },
  { name: 'Mariam A.',  rating: 5, text: 'The orange peel powder is genuinely fresh and smells incredible. So gentle on sensitive skin. Nothing else compares.' },
];

export default function Home() {
  return (
    <div>
      {/* ── HERO (Option B — full-width background image) ─────────────── */}
      <section className="relative min-h-screen flex items-end pb-0 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img src={HERO_BG} alt=""
            className="w-full h-full object-cover object-[50%_25%]"
            loading="eager" />
          {/* Multi-layer overlay: dark at bottom for text, lighter at top */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208]/90 via-[#1a1208]/50 to-[#1a1208]/20" />
          {/* Subtle olive tint */}
          <div className="absolute inset-0 bg-[var(--color-olive)]/20" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pt-36 pb-20 grid lg:grid-cols-2 gap-12 items-end">

          {/* ── LEFT: Copy on dark background ── */}
          <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold-light)] animate-pulse" />
              <span className="text-xs font-medium text-white/80 tracking-wide">Handcrafted · Chemical-Free · Rooted in Love</span>
            </div>

            <span className="font-script text-3xl sm:text-4xl text-[var(--color-gold-light)] block mb-2">
              Handmade with love, since day one
            </span>
            <h1 className="font-display text-[42px] sm:text-[58px] lg:text-[64px] leading-[1.05] text-white mb-5">
              Pure Herbal Care,<br />
              <span className="text-[var(--color-gold-light)]">Handmade</span> with{' '}
              <span className="relative inline-block text-white">
                Tradition
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 180 12" preserveAspectRatio="none">
                  <path d="M2 9 Q45 3 90 7 T178 5" stroke="var(--color-gold-light)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>.
            </h1>
            <p className="text-white/65 text-base sm:text-lg leading-relaxed max-w-[460px] mb-8">
              Two generations. One promise. Real herbal ingredients, handcrafted with no shortcuts and no chemicals — just nature, done right.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/shop"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[var(--color-gold)] text-white font-medium hover:bg-[var(--color-terracotta)] transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-terracotta)]/30">
                Shop Now <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/about"
                className="inline-flex items-center px-7 py-3.5 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Our Story
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-5 flex-wrap">
              {['100% Natural', 'Chemical-Free', 'Cruelty-Free', 'Small-Batch'].map((tag) => (
                <div key={tag} className="flex items-center gap-1.5 text-white/60 text-xs">
                  <ShieldCheck size={12} className="text-[var(--color-gold-light)]" />
                  {tag}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Floating product cards on hero ── */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-col gap-4 items-end pb-4">

            {/* Top card */}
            <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center gap-3 w-[280px]">
              <img src="/images/products/banana-powder.jpeg" alt="Banana Powder"
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">Banana Powder</p>
                <p className="text-white/55 text-xs">100% Organic · 500g</p>
                <p className="text-[var(--color-gold-light)] font-display text-sm mt-0.5">₹449</p>
              </div>
            </motion.div>

            {/* Middle card */}
            <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center gap-3 w-[280px]">
              <img src="/images/products/beetroot-powder.jpeg" alt="Beetroot Powder"
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">Beetroot Powder</p>
                <p className="text-white/55 text-xs">Natural Pigment · 500g</p>
                <p className="text-[var(--color-gold-light)] font-display text-sm mt-0.5">₹449</p>
              </div>
            </motion.div>

            {/* Bottom card */}
            <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center gap-3 w-[280px]">
              <img src="/images/products/charcoal-soap.jpeg" alt="Charcoal Detox Bar"
                className="w-14 h-14 rounded-xl object-cover object-top flex-shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">Charcoal Detox Bar</p>
                <p className="text-white/55 text-xs">Deep Cleanse · 100gm</p>
                <p className="text-[var(--color-gold-light)] font-display text-sm mt-0.5">₹999</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave divider at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
            className="w-full h-12 sm:h-20" fill="var(--color-ivory)">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      <RootDivider />

      {/* ── CATEGORIES (Option A — icon cards) ─────────────────────────── */}
      <section className="py-20 sm:py-28 px-6 sm:px-8 max-w-7xl mx-auto">
        <SectionHeading eyebrow="Browse by ritual" title="Find your herbal essential"
          subtitle="From daily cleansing to deep hair therapy — every category rooted in tradition." />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat, i) => (
            <CategoryIconCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </section>

      <RootDivider flip />

      {/* ── BEST SELLERS ─────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-6 sm:px-8 max-w-7xl mx-auto">
        <SectionHeading eyebrow="Loved by our community" title="Best sellers"
          subtitle="The handmade staples our customers keep coming back for." />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
          {products.slice(0, 5).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        <div className="flex justify-center mt-12">
          <Link to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[var(--color-olive)]/30 text-[var(--color-olive)] font-medium hover:bg-[var(--color-olive)] hover:text-white transition-all duration-300">
            View All Products <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[var(--color-ivory-deep)]/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <SectionHeading eyebrow="Our promise" title="Why Mother Daughter Roots" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {WHY.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white/60 transition-colors duration-300">
                <div className="w-16 h-16 rounded-full bg-[var(--color-olive)]/8 flex items-center justify-center mb-5">
                  <item.icon size={26} className="text-[var(--color-olive)]" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg text-[var(--color-bark)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-bark)]/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <RootDivider />

      {/* ── ABOUT PREVIEW ────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.65 }}
            className="flex justify-center order-1 lg:order-2">
            <img src="/images/brand/logo.png" alt="Mother Daughter Roots"
              className="w-64 sm:w-80 rounded-full shadow-2xl shadow-[var(--color-bark)]/12" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
            className="order-2 lg:order-1">
            <span className="font-script text-3xl text-[var(--color-terracotta)] block mb-3">Our story</span>
            <h2 className="font-display text-3xl sm:text-4xl text-[var(--color-bark)] mb-5 leading-tight">
              Two generations, rooted in one tradition
            </h2>
            <p className="text-[var(--color-bark)]/60 leading-relaxed mb-4">
              Mother Daughter Roots began at a kitchen table, where age-old herbal remedies passed between mother and daughter became something more — a promise to bring honest, chemical-free skincare to every home, the way it was always meant to be made.
            </p>
            <p className="text-[var(--color-bark)]/60 leading-relaxed mb-7">
              Every soap is poured, every oil is blended, every powder is measured by hand. Small batches. Real ingredients. No exceptions.
            </p>
            <Link to="/about"
              className="inline-flex items-center gap-2 text-[var(--color-olive)] font-medium border-b-2 border-[var(--color-gold)] pb-0.5 hover:gap-3 transition-all duration-300">
              Read our full story <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[var(--color-olive)] relative overflow-hidden">
        <div className="noise-overlay absolute inset-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <SectionHeading eyebrow="What people are saying" title="Loved by real customers" light />
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/8 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} className="fill-[var(--color-gold-light)] text-[var(--color-gold-light)]" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <p className="font-display text-[var(--color-gold-light)]">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM GRID ───────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-6 sm:px-8 max-w-7xl mx-auto">
        <SectionHeading eyebrow="@motherdaughterroots" title="From our collection"
          subtitle="Behind-the-scenes soap making, new launches, and herbal tips — all on Instagram." />
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
          {products.slice(0, 5).map(p => (
            <a key={p.id} href="https://www.instagram.com/motherdaughterroots"
              target="_blank" rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden block">
              <img src={p.image} alt="" loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[var(--color-bark)]/0 group-hover:bg-[var(--color-bark)]/45 transition-colors duration-300 flex items-center justify-center">
                <Instagram size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </div>
        <div className="flex justify-center mt-7">
          <a href="https://www.instagram.com/motherdaughterroots" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--color-olive)] font-medium hover:text-[var(--color-terracotta)] transition-colors">
            <Instagram size={16} /> @motherdaughterroots
          </a>
        </div>
      </section>
    </div>
  );
}