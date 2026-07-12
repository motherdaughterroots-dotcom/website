// src/pages/Courses.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Monitor, ArrowRight, CheckCircle, Star, MapPin, Users, MessageCircle } from 'lucide-react';
import { courses, courseCategories, packages } from '../data/courses';
import SectionHeading from '../components/SectionHeading';
import RootDivider from '../components/RootDivider';
import { getWhatsAppGeneralLink } from '../utils/whatsapp';

const ALL = { id: 'all', name: 'All Courses', emoji: '🌱' };
const CATS = [ALL, ...courseCategories];
const OFFLINE_WORKSHOP_LINK = getWhatsAppGeneralLink(
  'Hi! I would like to arrange an offline training workshop at our location. We have a group of 10–20 participants. Please share the details.'
);

// Why choose MRD training
const WHY = [
  { emoji: '📱', title: 'Live 1-to-1 on WhatsApp', desc: 'No recorded classes. Real-time, personal training on a video call — at your pace.' },
  { emoji: '🎓', title: 'Certificate of Completion', desc: 'Receive a certificate after every course to validate your skills.' },
  { emoji: '♾️', title: 'Lifetime Support', desc: 'Ask questions anytime, even months after your course. We\'re always here.' },
  { emoji: '👩‍🏫', title: 'Personal Attention', desc: 'You\'re not in a batch. Every session is designed around you and your pace.' },
];

function CourseCard({ course, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl border border-[var(--color-cream-line)] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[var(--color-bark)]/8 transition-all duration-300"
    >
      <Link to={`/courses/${course.id}`} className="block">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-[var(--color-beige)]">
          <img
            src={course.image}
            alt={course.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bark)]/40 to-transparent" />

          {/* Featured badge */}
          {course.isFeatured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-gold)] text-white text-[10px] font-bold shadow">
              <Star size={9} fill="white" /> Popular
            </div>
          )}

          {/* Price starting from */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5">
            <p className="text-[10px] text-[var(--color-bark)]/50">Starting from</p>
            <p className="font-display text-sm text-[var(--color-olive)]">₹{course.prices.beginner.toLocaleString()}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-gold)] font-medium mb-1.5">
            {courseCategories.find(c => c.id === course.category)?.emoji}{' '}
            {courseCategories.find(c => c.id === course.category)?.name}
          </p>
          <h3 className="font-display text-lg text-[var(--color-bark)] mb-2 leading-snug">{course.name}</h3>
          <p className="text-sm text-[var(--color-bark)]/60 leading-relaxed line-clamp-2 mb-4">{course.shortDesc}</p>

          <div className="flex items-center justify-between text-xs text-[var(--color-bark)]/45 pt-3 border-t border-[var(--color-cream-line)]">
            <span className="flex items-center gap-1.5"><Clock size={12} /> {course.duration}</span>
            <span className="flex items-center gap-1.5"><Monitor size={12} /> {course.mode}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Courses() {
  const [active, setActive] = useState('all');

  const visible = active === 'all' ? courses : courses.filter(c => c.category === active);

  return (
    <div className="pt-24 pb-20">

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <div className="relative py-16 sm:py-24 px-6 sm:px-8 bg-[var(--color-olive)] overflow-hidden mb-14">
        <div className="noise-overlay absolute inset-0 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}>
            <span className="font-script text-3xl sm:text-4xl text-[var(--color-gold-light)] block mb-2">
              Learn with us
            </span>
            <h1 className="font-display text-4xl sm:text-5xl text-[var(--color-ivory)] leading-[1.1] mb-5">
              Live Training Programs
            </h1>
            <p className="text-[var(--color-ivory)]/65 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              Personal, live 1-to-1 WhatsApp video training. No batch classes, no recorded videos — just you, your product, and a mentor who's made it herself.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8">

        {/* ── PACKAGES OVERVIEW ───────────────────────────────────────── */}
        <div className="mb-20">
          <SectionHeading eyebrow="Choose your level" title="Three packages, one goal"
            subtitle="Every course is available in 3 levels. Pick the one that matches where you are right now." />

          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
            {packages.map((pkg, i) => (
              <motion.div key={pkg.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-[var(--color-cream-line)] bg-white p-6 hover:shadow-lg hover:shadow-[var(--color-bark)]/8 transition-all duration-300"
              >
                {/* Colour accent top bar */}
                <div className="w-10 h-1 rounded-full mb-4" style={{ background: pkg.color }} />
                <h3 className="font-display text-xl text-[var(--color-bark)] mb-1">{pkg.name}</h3>
                <p className="text-sm text-[var(--color-bark)]/55 mb-5">{pkg.tagline}</p>
                <ul className="space-y-2.5 mb-5">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[var(--color-bark)]/70">
                      <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: pkg.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-medium px-3 py-2 rounded-xl text-center"
                  style={{ background: `color-mix(in srgb, ${pkg.color} 10%, transparent)`, color: pkg.color }}>
                  {pkg.highlight}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-[var(--color-olive)] px-6 py-9 sm:px-10 sm:py-11 mb-16 sm:mb-20">
          <div className="noise-overlay absolute inset-0 pointer-events-none" />
          <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full border border-[var(--color-gold-light)]/25" />
          <div className="absolute -right-4 -top-8 w-40 h-40 rounded-full border border-[var(--color-gold-light)]/20" />
          <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold-light)] font-semibold mb-3">Offline workshops available</p>
              <h2 className="font-display text-3xl sm:text-4xl text-[var(--color-ivory)] leading-tight mb-4">Bring the workshop to your location.</h2>
              <p className="text-[var(--color-ivory)]/70 leading-relaxed text-sm sm:text-base">Have a group ready to learn? Arrange an in-person, hands-on training workshop at your preferred location for 10–20 participants.</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-2 text-xs font-medium text-[var(--color-ivory)]"><Users size={14} className="text-[var(--color-gold-light)]" /> Group of 10–20 learners</span>
                <span className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-2 text-xs font-medium text-[var(--color-ivory)]"><MapPin size={14} className="text-[var(--color-gold-light)]" /> Your preferred location</span>
              </div>
            </div>
            <a href={OFFLINE_WORKSHOP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-[var(--color-gold-light)] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-gold)] hover:shadow-lg hover:shadow-black/20"><MessageCircle size={18} /> Enquire about a workshop</a>
          </div>
        </div>

        <RootDivider />

        {/* ── COURSE LISTING ──────────────────────────────────────────── */}
        <div className="mt-16 sm:mt-20">
          <SectionHeading eyebrow="All training programs" title="Pick your product" />

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-10">
            {CATS.map(cat => (
              <button key={cat.id} onClick={() => setActive(cat.id)}
                className={`relative overflow-hidden px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap
                  ${active === cat.id
                    ? 'text-white shadow-md'
                    : 'bg-white border border-[var(--color-cream-line)] text-[var(--color-olive)] hover:border-[var(--color-olive)]'}`}>
                {active === cat.id && (
                  <motion.span layoutId="course-cat-pill"
                    className="absolute inset-0 rounded-full bg-[var(--color-olive)] -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <span className="relative z-10">{cat.emoji} {cat.name}</span>
              </button>
            ))}
          </div>

          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {visible.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <RootDivider className="mt-16 sm:mt-20" />

        {/* ── WHY MRD ─────────────────────────────────────────────────── */}
        <div className="mt-16 sm:mt-20 mb-16">
          <SectionHeading eyebrow="Why train with us" title="What makes MRD different" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
            {WHY.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.09 }}
                className="flex flex-col items-center text-center p-5 rounded-2xl bg-[var(--color-ivory-deep)]/60 hover:bg-white border border-transparent hover:border-[var(--color-cream-line)] transition-all duration-300">
                <span className="text-3xl mb-4">{item.emoji}</span>
                <h3 className="font-display text-base sm:text-lg text-[var(--color-bark)] mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--color-bark)]/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
