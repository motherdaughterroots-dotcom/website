// // OPTION A — Uses your real product images, redesigned hero layout
// // Hero: one large focal product image + floating smaller card, object-position tuned
// // to show the product visuals rather than the label text area

// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { ArrowRight, Leaf, Sprout, FlaskConical, PackageCheck, Star, Instagram, ShieldCheck } from 'lucide-react';
// import SectionHeading from '../components/SectionHeading';
// import ProductCard from '../components/ProductCard';
// import RootDivider from '../components/RootDivider';
// import CategoryIconCard from '../components/CategoryIconCard';
// import { products, categories } from '../data/products';

// const WHY = [
//   { icon: Sprout,       title: 'Handmade',          desc: 'Every batch crafted by hand — never mass-produced.' },
//   { icon: Leaf,         title: 'Herbal Ingredients', desc: 'Real turmeric, neem, amla — not diluted extracts.' },
//   { icon: FlaskConical, title: 'Chemical-Free',      desc: 'No parabens, sulphates, or artificial fragrance.' },
//   { icon: PackageCheck, title: 'Small-Batch',        desc: 'Made fresh in small quantities for true potency.' },
// ];

// const TESTIMONIALS = [
//   { name: 'Ayesha R.',  rating: 5, text: 'The charcoal soap completely transformed my skin in two weeks. You can smell the real neem and charcoal — not a synthetic imitation.' },
//   { name: 'Fatima K.',  rating: 5, text: 'I switched my whole family to the hair oil. My mother-in-law now demands it every month. That says everything.' },
//   { name: 'Mariam A.',  rating: 5, text: 'The orange peel powder is genuinely fresh and smells incredible. So gentle on sensitive skin. Nothing else compares.' },
// ];

// const STATS = [
//   { value: '100%', label: 'Natural Ingredients' },
//   { value: '0',    label: 'Harmful Chemicals' },
//   { value: '10+',  label: 'Handmade Products' },
//   { value: '500+', label: 'Happy Customers' },
// ];

// export default function Home() {
//   return (
//     <div>
//       {/* ── HERO ─────────────────────────────────────────────────────── */}
//       <section className="relative min-h-[100svh] flex items-center pt-24 pb-12 sm:pt-20 sm:pb-10 overflow-hidden bg-[var(--color-ivory)]">
//         {/* Decorative blobs */}
//         <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(138,110,60,0.06) 0%, transparent 65%)' }} />
//         <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(201,96,58,0.06) 0%, transparent 65%)' }} />

//         <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full grid lg:grid-cols-2 gap-10 lg:gap-6 items-center relative z-10">

//           {/* ── LEFT / MOBILE FULL: Copy ── */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
//             className="flex flex-col items-center text-center lg:items-start lg:text-left"
//           >
//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-olive)]/8 border border-[var(--color-olive)]/15 mb-4">
//               <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta)] animate-pulse flex-shrink-0" />
//               <span className="text-[11px] sm:text-xs font-medium text-[var(--color-olive)] tracking-wide">Handcrafted · Chemical-Free · Rooted in Love</span>
//             </div>

//             {/* Script line — hidden on very small screens to keep it clean */}
//             <span className="font-script text-2xl sm:text-3xl lg:text-4xl text-[var(--color-terracotta)] block mb-2">
//               Handmade with love, since day one
//             </span>

//             <h1 className="font-display text-[34px] sm:text-[48px] lg:text-[60px] leading-[1.08] text-[var(--color-bark)] mb-4">
//               Pure Herbal Care,{' '}
//               <span className="text-[var(--color-olive)]">Handmade</span>{' '}
//               with{' '}
//               <span className="relative inline-block">
//                 Tradition
//                 <svg className="absolute -bottom-1.5 left-0 w-full h-3" viewBox="0 0 180 12" preserveAspectRatio="none" aria-hidden="true">
//                   <path d="M2 9 Q45 3 90 7 T178 5" stroke="var(--color-gold)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
//                 </svg>
//               </span>.
//             </h1>

//             <p className="text-[var(--color-bark)]/60 text-sm sm:text-base lg:text-lg leading-relaxed max-w-[360px] sm:max-w-[420px] mb-7">
//               Two generations. One promise. Real herbal ingredients, handcrafted with no shortcuts and no chemicals.
//             </p>

//             {/* CTA buttons */}
//             <div className="flex gap-3 mb-8 w-full sm:w-auto justify-center lg:justify-start">
//               <Link to="/shop"
//                 className="group inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-[var(--color-olive)] text-[var(--color-ivory)] text-sm sm:text-base font-medium hover:bg-[var(--color-terracotta)] transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-terracotta)]/20">
//                 Shop Now <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
//               </Link>
//               <Link to="/about"
//                 className="inline-flex items-center px-6 py-3 sm:px-7 sm:py-3.5 rounded-full border border-[var(--color-olive)]/30 text-[var(--color-olive)] text-sm sm:text-base font-medium hover:border-[var(--color-olive)] hover:bg-[var(--color-olive)]/5 transition-all duration-300">
//                 Our Story
//               </Link>
//             </div>

//             {/* Stats row — 2 cols on mobile (smaller labels), 4 on sm+ */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 pt-6 border-t border-[var(--color-cream-line)] w-full max-w-xs sm:max-w-none">
//               {STATS.map(s => (
//                 <div key={s.label} className="text-center lg:text-left">
//                   <p className="font-display text-xl sm:text-2xl text-[var(--color-olive)]">{s.value}</p>
//                   <p className="text-[10px] sm:text-xs text-[var(--color-bark)]/50 leading-tight mt-0.5">{s.label}</p>
//                 </div>
//               ))}
//             </div>
//           </motion.div>

//           {/* ── RIGHT: Product image collage — desktop only ── */}
//           <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
//             className="relative hidden lg:flex items-center justify-center">

//             {/* Soft circle backdrop */}
//             <div className="absolute w-[440px] h-[440px] rounded-full bg-[var(--color-beige)]/60 -z-10" />

//             {/* Main large image — banana powder, nice standalone product shot */}
//             <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.4 }}
//               className="relative w-[260px] h-[320px] rounded-[28px] overflow-hidden shadow-2xl shadow-[var(--color-bark)]/15 z-10">
//               <img src="/images/products/banana-powder.jpeg" alt="Banana Powder"
//                 className="w-full h-full object-cover object-center" />
//               {/* Product label overlay */}
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--color-bark)]/70 to-transparent px-4 py-4">
//                 <p className="text-white font-display text-sm">Banana Powder</p>
//                 <p className="text-white/60 text-xs">100% Pure & Organic</p>
//               </div>
//             </motion.div>

//             {/* Top-right floating card — charcoal soap */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.85, x: 20 }}
//               animate={{ opacity: 1, scale: 1, x: 0 }}
//               transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//               whileHover={{ y: -5 }}
//               className="absolute top-2 right-0 w-[155px] h-[190px] rounded-[20px] overflow-hidden shadow-xl shadow-[var(--color-bark)]/12 z-20">
//               <img src="/images/products/charcoal-soap.jpeg" alt="Charcoal Detox Soap"
//                 className="w-full h-full object-cover object-top" />
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--color-bark)]/70 to-transparent px-3 py-3">
//                 <p className="text-white font-display text-xs leading-tight">Charcoal Detox Bar</p>
//               </div>
//             </motion.div>

//             {/* Bottom-left floating card — beetroot powder */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.85, x: -20 }}
//               animate={{ opacity: 1, scale: 1, x: 0 }}
//               transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//               whileHover={{ y: -5 }}
//               className="absolute bottom-4 left-0 w-[155px] h-[180px] rounded-[20px] overflow-hidden shadow-xl shadow-[var(--color-bark)]/12 z-20">
//               <img src="/images/products/beetroot-powder.jpeg" alt="Beetroot Powder"
//                 className="w-full h-full object-cover object-center" />
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--color-bark)]/70 to-transparent px-3 py-3">
//                 <p className="text-white font-display text-xs leading-tight">Beetroot Powder</p>
//               </div>
//             </motion.div>

//             {/* Floating badge — chemical free */}
//             <motion.div
//               initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.8, duration: 0.5 }}
//               className="absolute -bottom-2 right-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5 z-30">
//               <div className="w-8 h-8 rounded-full bg-[var(--color-olive)]/10 flex items-center justify-center flex-shrink-0">
//                 <ShieldCheck size={15} className="text-[var(--color-olive)]" />
//               </div>
//               <div className="text-xs">
//                 <p className="font-semibold text-[var(--color-olive)]">100% Chemical-Free</p>
//                 <p className="text-[var(--color-bark)]/45">Handcrafted in small batches</p>
//               </div>
//             </motion.div>

//             {/* Top-left floating price tag */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 1, duration: 0.4, ease: 'backOut' }}
//               className="absolute top-10 left-2 bg-[var(--color-terracotta)] rounded-2xl shadow-lg px-3.5 py-2.5 z-30">
//               <p className="text-white text-xs font-medium">Starting at</p>
//               <p className="text-white font-display text-lg leading-tight">₹449</p>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       <RootDivider />

//       {/* ── CATEGORIES ───────────────────────────────────────────────── */}
//       <section className="py-20 sm:py-28 px-6 sm:px-8 max-w-7xl mx-auto">
//         <SectionHeading eyebrow="Browse by ritual" title="Find your herbal essential"
//           subtitle="From daily cleansing to deep hair therapy — every category rooted in tradition." />
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
//           {categories.map((cat, i) => (
//             <CategoryIconCard key={cat.id} category={cat} index={i} />
//           ))}
//         </div>
//       </section>

//       <RootDivider flip />

//       {/* ── BEST SELLERS ─────────────────────────────────────────────── */}
//       <section className="py-20 sm:py-28 px-6 sm:px-8 max-w-7xl mx-auto">
//         <SectionHeading eyebrow="Loved by our community" title="Best sellers"
//           subtitle="The handmade staples our customers keep coming back for." />
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
//           {products.slice(0, 5).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
//         </div>
//         <div className="flex justify-center mt-12">
//           <Link to="/shop"
//             className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[var(--color-olive)]/30 text-[var(--color-olive)] font-medium hover:bg-[var(--color-olive)] hover:text-white transition-all duration-300">
//             View All Products <ArrowRight size={15} />
//           </Link>
//         </div>
//       </section>

//       {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
//       <section className="py-20 sm:py-28 bg-[var(--color-ivory-deep)]/60">
//         <div className="max-w-7xl mx-auto px-6 sm:px-8">
//           <SectionHeading eyebrow="Our promise" title="Why Mother Daughter Roots" />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
//             {WHY.map((item, i) => (
//               <motion.div key={item.title}
//                 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: '-50px' }}
//                 transition={{ duration: 0.5, delay: i * 0.1 }}
//                 className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white/60 transition-colors duration-300">
//                 <div className="w-16 h-16 rounded-full bg-[var(--color-olive)]/8 flex items-center justify-center mb-5">
//                   <item.icon size={26} className="text-[var(--color-olive)]" strokeWidth={1.5} />
//                 </div>
//                 <h3 className="font-display text-lg text-[var(--color-bark)] mb-2">{item.title}</h3>
//                 <p className="text-sm text-[var(--color-bark)]/60 leading-relaxed">{item.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <RootDivider />

//       {/* ── ABOUT PREVIEW ────────────────────────────────────────────── */}
//       <section className="py-20 sm:py-28 px-6 sm:px-8 max-w-7xl mx-auto">
//         <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
//           <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.65 }}
//             className="flex justify-center order-1 lg:order-2">
//             <img src="/images/brand/logo.png" alt="Mother Daughter Roots"
//               className="w-64 sm:w-80 rounded-full shadow-2xl shadow-[var(--color-bark)]/12" />
//           </motion.div>
//           <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
//             className="order-2 lg:order-1">
//             <span className="font-script text-3xl text-[var(--color-terracotta)] block mb-3">Our story</span>
//             <h2 className="font-display text-3xl sm:text-4xl text-[var(--color-bark)] mb-5 leading-tight">
//               Two generations, rooted in one tradition
//             </h2>
//             <p className="text-[var(--color-bark)]/60 leading-relaxed mb-4">
//               Mother Daughter Roots began at a kitchen table, where age-old herbal remedies passed between mother and daughter became something more — a promise to bring honest, chemical-free skincare to every home, the way it was always meant to be made.
//             </p>
//             <p className="text-[var(--color-bark)]/60 leading-relaxed mb-7">
//               Every soap is poured, every oil is blended, every powder is measured by hand. Small batches. Real ingredients. No exceptions.
//             </p>
//             <Link to="/about"
//               className="inline-flex items-center gap-2 text-[var(--color-olive)] font-medium border-b-2 border-[var(--color-gold)] pb-0.5 hover:gap-3 transition-all duration-300">
//               Read our full story <ArrowRight size={15} />
//             </Link>
//           </motion.div>
//         </div>
//       </section>

//       {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
//       <section className="py-20 sm:py-28 bg-[var(--color-olive)] relative overflow-hidden">
//         <div className="noise-overlay absolute inset-0 pointer-events-none" />
//         <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
//           <SectionHeading eyebrow="What people are saying" title="Loved by real customers" light />
//           <div className="grid sm:grid-cols-3 gap-5">
//             {TESTIMONIALS.map((t, i) => (
//               <motion.div key={t.name}
//                 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: '-50px' }}
//                 transition={{ duration: 0.5, delay: i * 0.1 }}
//                 className="bg-white/8 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
//                 <div className="flex gap-1 mb-3">
//                   {Array.from({ length: t.rating }).map((_, j) => (
//                     <Star key={j} size={13} className="fill-[var(--color-gold-light)] text-[var(--color-gold-light)]" />
//                   ))}
//                 </div>
//                 <p className="text-white/80 text-sm leading-relaxed mb-4">"{t.text}"</p>
//                 <p className="font-display text-[var(--color-gold-light)]">{t.name}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── INSTAGRAM GRID ───────────────────────────────────────────── */}
//       <section className="py-20 sm:py-28 px-6 sm:px-8 max-w-7xl mx-auto">
//         <SectionHeading eyebrow="@motherdaughterroots" title="From our collection"
//           subtitle="Behind-the-scenes soap making, new launches, and herbal tips — all on Instagram." />
//         <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
//           {products.slice(0, 5).map(p => (
//             <a key={p.id} href="https://www.instagram.com/motherdaughterroots"
//               target="_blank" rel="noopener noreferrer"
//               className="group relative aspect-square rounded-xl overflow-hidden block">
//               <img src={p.image} alt="" loading="lazy"
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
//               <div className="absolute inset-0 bg-[var(--color-bark)]/0 group-hover:bg-[var(--color-bark)]/45 transition-colors duration-300 flex items-center justify-center">
//                 <Instagram size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//               </div>
//             </a>
//           ))}
//         </div>
//         <div className="flex justify-center mt-7">
//           <a href="https://www.instagram.com/motherdaughterroots" target="_blank" rel="noopener noreferrer"
//             className="inline-flex items-center gap-2 text-[var(--color-olive)] font-medium hover:text-[var(--color-terracotta)] transition-colors">
//             <Instagram size={16} /> @motherdaughterroots
//           </a>
//         </div>
//       </section>
//     </div>
//   );
// }



// ###################################################################################################

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Sprout, FlaskConical, PackageCheck, Star, Instagram, ShieldCheck } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import RootDivider from '../components/RootDivider';
import CategoryIconCard from '../components/CategoryIconCard';
import { products, categories } from '../data/products';

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

const STATS = [
  { value: '100%', label: 'Natural' },
  { value: '0',    label: 'Chemicals' },
  { value: '10+',  label: 'Products' },
  { value: '500+', label: 'Customers' },
];

// Products shown in the mobile scroll strip — pick the best-looking standalone images
const HERO_PRODUCTS = [
  { img: '/images/products/banana-powder.jpeg',        name: 'Banana Powder',      price: '₹449' },
  { img: '/images/products/beetroot-powder.jpeg',      name: 'Beetroot Powder',    price: '₹449' },
  { img: '/images/products/orange-peel-powder.jpeg',   name: 'Orange Peel Powder', price: '₹449' },
  { img: '/images/products/papaya-leaves-powder.jpeg', name: 'Papaya Leaves',      price: '₹449' },
  { img: '/images/products/ubtan-soap.jpeg',           name: 'Ubtan Glow Bar',     price: '₹999' },
];

export default function Home() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col lg:grid lg:grid-cols-2 lg:items-center min-h-[100svh] pt-20 overflow-hidden bg-[var(--color-ivory)]">

        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(138,110,60,0.06) 0%, transparent 65%)' }} />
        <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,96,58,0.06) 0%, transparent 65%)' }} />

        {/* ── COPY COLUMN ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 px-6 sm:px-8 lg:px-8 pt-8 pb-6 lg:py-16 flex flex-col items-center text-center lg:items-start lg:text-left max-w-xl mx-auto lg:mx-0 lg:max-w-none"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-olive)]/8 border border-[var(--color-olive)]/15 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta)] animate-pulse flex-shrink-0" />
            <span className="text-[11px] font-medium text-[var(--color-olive)] tracking-wide">
              Handcrafted · Chemical-Free · Rooted in Love
            </span>
          </div>

          <span className="font-script text-2xl sm:text-3xl lg:text-4xl text-[var(--color-terracotta)] block mb-2">
            Handmade with love, since day one
          </span>

          <h1 className="font-display text-[36px] sm:text-[50px] lg:text-[58px] leading-[1.08] text-[var(--color-bark)] mb-4">
            Pure Herbal Care,{' '}
            <span className="text-[var(--color-olive)]">Handmade</span>{' '}
            with{' '}
            <span className="relative inline-block">
              Tradition
              <svg className="absolute -bottom-1.5 left-0 w-full h-3" viewBox="0 0 180 12"
                preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 9 Q45 3 90 7 T178 5" stroke="var(--color-gold)"
                  strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>.
          </h1>

          <p className="text-[var(--color-bark)]/60 text-sm sm:text-base lg:text-lg leading-relaxed max-w-[360px] sm:max-w-[420px] mb-7">
            Two generations. One promise. Real herbal ingredients, handcrafted with no shortcuts and no chemicals.
          </p>

          {/* CTAs */}
          <div className="flex gap-3 mb-8 w-full sm:w-auto justify-center lg:justify-start">
            <Link to="/shop"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-olive)] text-[var(--color-ivory)] text-sm font-medium hover:bg-[var(--color-terracotta)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-terracotta)]/20">
              Shop Now <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/about"
              className="inline-flex items-center px-6 py-3 rounded-full border border-[var(--color-olive)]/30 text-[var(--color-olive)] text-sm font-medium hover:border-[var(--color-olive)] hover:bg-[var(--color-olive)]/5 transition-all duration-300">
              Our Story
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 sm:gap-6 pt-5 border-t border-[var(--color-cream-line)] w-full max-w-[320px] sm:max-w-sm lg:max-w-none">
            {STATS.map(s => (
              <div key={s.label} className="text-center lg:text-left">
                <p className="font-display text-lg sm:text-2xl text-[var(--color-olive)]">{s.value}</p>
                <p className="text-[10px] text-[var(--color-bark)]/50 leading-tight mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── MOBILE / TABLET: horizontal scroll product strip ─────────── */}
        {/* Shows on < lg, hidden on lg+ where the collage takes over */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="lg:hidden px-6 sm:px-8 pb-10 relative z-10"
        >
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
            {HERO_PRODUCTS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex-none w-[140px] sm:w-[160px] rounded-2xl overflow-hidden shadow-lg shadow-[var(--color-bark)]/10 relative"
              >
                <div className="aspect-[3/4] bg-[var(--color-beige)]">
                  <img src={p.img} alt={p.name}
                    className="w-full h-full object-cover object-center" />
                </div>
                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--color-bark)]/75 to-transparent px-3 py-3">
                  <p className="text-white text-xs font-medium leading-tight">{p.name}</p>
                  <p className="text-white/70 text-[11px]">{p.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Scroll hint */}
          <p className="text-center text-[11px] text-[var(--color-bark)]/35 mt-3 tracking-wide">
            scroll to explore →
          </p>
        </motion.div>

        {/* ── DESKTOP: floating image collage ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:flex items-center justify-center py-16 pr-8"
        >
          {/* Soft circle backdrop */}
          <div className="absolute w-[420px] h-[420px] rounded-full bg-[var(--color-beige)]/55 -z-10" />

          {/* Main large image */}
          <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.4 }}
            className="relative w-[255px] h-[315px] rounded-[28px] overflow-hidden shadow-2xl shadow-[var(--color-bark)]/15 z-10">
            <img src="/images/products/banana-powder.jpeg" alt="Banana Powder"
              className="w-full h-full object-cover object-center" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--color-bark)]/70 to-transparent px-4 py-4">
              <p className="text-white font-display text-sm">Banana Powder</p>
              <p className="text-white/60 text-xs">100% Pure & Organic</p>
            </div>
          </motion.div>

          {/* Top-right floating card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5 }}
            className="absolute top-8 right-4 w-[148px] h-[182px] rounded-[20px] overflow-hidden shadow-xl shadow-[var(--color-bark)]/12 z-20">
            <img src="/images/products/charcoal-soap.jpeg" alt="Charcoal Detox Soap"
              className="w-full h-full object-cover object-top" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--color-bark)]/70 to-transparent px-3 py-3">
              <p className="text-white font-display text-xs leading-tight">Charcoal Detox Bar</p>
            </div>
          </motion.div>

          {/* Bottom-left floating card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5 }}
            className="absolute bottom-10 left-4 w-[148px] h-[172px] rounded-[20px] overflow-hidden shadow-xl shadow-[var(--color-bark)]/12 z-20">
            <img src="/images/products/beetroot-powder.jpeg" alt="Beetroot Powder"
              className="w-full h-full object-cover object-center" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--color-bark)]/70 to-transparent px-3 py-3">
              <p className="text-white font-display text-xs leading-tight">Beetroot Powder</p>
            </div>
          </motion.div>

          {/* Chemical-free badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute -bottom-2 right-2 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5 z-30 max-w-[200px]">
            <div className="w-8 h-8 rounded-full bg-[var(--color-olive)]/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={15} className="text-[var(--color-olive)]" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[var(--color-olive)]">100% Chemical-Free</p>
              <p className="text-[var(--color-bark)]/45">Handcrafted in small batches</p>
            </div>
          </motion.div>

          {/* Price tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.4, ease: 'backOut' }}
            className="absolute top-16 left-2 bg-[var(--color-terracotta)] rounded-2xl shadow-lg px-3.5 py-2.5 z-30">
            <p className="text-white text-xs font-medium">Starting at</p>
            <p className="text-white font-display text-lg leading-tight">₹449</p>
          </motion.div>
        </motion.div>
      </section>

      <RootDivider />

      {/* ── CATEGORIES ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <SectionHeading eyebrow="Browse by ritual" title="Find your herbal essential"
          subtitle="From daily cleansing to deep hair therapy — every category rooted in tradition." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat, i) => (
            <CategoryIconCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </section>

      <RootDivider flip />

      {/* ── BEST SELLERS ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <SectionHeading eyebrow="Loved by our community" title="Best sellers"
          subtitle="The handmade staples our customers keep coming back for." />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.slice(0, 5).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        <div className="flex justify-center mt-10">
          <Link to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[var(--color-olive)]/30 text-[var(--color-olive)] font-medium hover:bg-[var(--color-olive)] hover:text-white transition-all duration-300">
            View All Products <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[var(--color-ivory-deep)]/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <SectionHeading eyebrow="Our promise" title="Why Mother Daughter Roots" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
            {WHY.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl hover:bg-white/60 transition-colors duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[var(--color-olive)]/8 flex items-center justify-center mb-4">
                  <item.icon size={22} className="text-[var(--color-olive)]" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-base sm:text-lg text-[var(--color-bark)] mb-1.5">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--color-bark)]/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <RootDivider />

      {/* ── ABOUT PREVIEW ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.65 }}
            className="flex justify-center order-1 lg:order-2">
            <img src="/images/brand/logo.png" alt="Mother Daughter Roots"
              className="w-52 sm:w-72 lg:w-80 rounded-full shadow-2xl shadow-[var(--color-bark)]/12" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
            className="order-2 lg:order-1">
            <span className="font-script text-2xl sm:text-3xl text-[var(--color-terracotta)] block mb-2">Our story</span>
            <h2 className="font-display text-2xl sm:text-4xl text-[var(--color-bark)] mb-4 leading-tight">
              Two generations, rooted in one tradition
            </h2>
            <p className="text-[var(--color-bark)]/60 leading-relaxed mb-4 text-sm sm:text-base">
              Mother Daughter Roots began at a kitchen table, where age-old herbal remedies passed between mother and daughter became something more — a promise to bring honest, chemical-free skincare to every home.
            </p>
            <p className="text-[var(--color-bark)]/60 leading-relaxed mb-6 text-sm sm:text-base">
              Every soap is poured, every oil is blended, every powder is measured by hand. Small batches. Real ingredients. No exceptions.
            </p>
            <Link to="/about"
              className="inline-flex items-center gap-2 text-[var(--color-olive)] font-medium border-b-2 border-[var(--color-gold)] pb-0.5 hover:gap-3 transition-all duration-300 text-sm sm:text-base">
              Read our full story <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[var(--color-olive)] relative overflow-hidden">
        <div className="noise-overlay absolute inset-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <SectionHeading eyebrow="What people are saying" title="Loved by real customers" light />
          {/* Mobile: horizontal scroll. sm+: grid */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar sm:grid sm:grid-cols-3 sm:overflow-visible pb-2 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex-none w-[280px] sm:w-auto bg-white/8 rounded-2xl p-5 sm:p-6 border border-white/10 backdrop-blur-sm">
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
      <section className="py-16 sm:py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <SectionHeading eyebrow="@motherdaughterroots" title="Follow our journey"
          subtitle="Behind-the-scenes soap making, new launches, and herbal tips — all on Instagram." />
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
          {products.slice(0, 5).map(p => (
            <a key={p.id} href="https://www.instagram.com/motherdaughterroots"
              target="_blank" rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden block">
              <img src={p.image} alt="" loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[var(--color-bark)]/0 group-hover:bg-[var(--color-bark)]/45 transition-colors duration-300 flex items-center justify-center">
                <Instagram size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <a href="https://www.instagram.com/motherdaughterroots" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--color-olive)] font-medium hover:text-[var(--color-terracotta)] transition-colors text-sm">
            <Instagram size={15} /> @motherdaughterroots
          </a>
        </div>
      </section>
    </div>
  );
}