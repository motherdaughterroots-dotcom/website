// src/pages/CourseDetail.jsx
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Monitor, CheckCircle, Phone, Instagram, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { getCourseById, courses, packages } from '../data/courses';
import { isInternationalCustomer } from '../utils/whatsapp';
import RootDivider from '../components/RootDivider';

const CALL_NUMBER = '8125826495';
const ENROLL_WA   = '916304460957';

function buildEnrollMessage(course, pkg, name, city, country) {
  if (isInternationalCustomer(country)) {
    return [
      'Hi! I would like to enroll in an international online training program.',
      '',
      `Course: ${course.name}`,
      `Package: ${pkg.name}`,
      '',
      `Name: ${name}`,
      `Country: ${country}`,
      `City / location: ${city}`,
      '',
      'Please share the next available batch, suitable time zones, and international payment methods. Thank you!',
    ].join('\n');
  }

  const lines = [
    `Hi! I'd like to enroll in a training program. 🌿`,
    ``,
    `Course: ${course.name}`,
    `Package: ${pkg.name} (₹${course.prices[pkg.id].toLocaleString()})`,
    ``,
    name ? `Name: ${name}` : `Name: _______`,
    country ? `Country: ${country}` : `Country: _______`,
    city ? `City: ${city}` : `City: _______`,
    ``,
    `Please share the next available batch details. Thank you!`,
  ];
  return lines.join('\n');
}

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = getCourseById(id);

  const [selectedPkg, setSelectedPkg] = useState('beginner');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [showForm, setShowForm] = useState(false);
  const [detailsError, setDetailsError] = useState(false);

  if (!course) return (
    <div className="pt-40 text-center">
      <p className="font-display text-2xl text-[var(--color-olive)] mb-4">Course not found</p>
      <Link to="/courses" className="text-[var(--color-terracotta)] hover:underline">← Back to courses</Link>
    </div>
  );

  const pkg = packages.find(p => p.id === selectedPkg);
  const price = course.prices[selectedPkg];
  const enrollMessage = buildEnrollMessage(course, pkg, name, city, country);
  const waLink = `https://wa.me/${ENROLL_WA}?text=${encodeURIComponent(enrollMessage)}`;

  function handleEnroll(event) {
    if (!name.trim() || !city.trim() || !country.trim()) {
      event.preventDefault();
      setShowForm(true);
      setDetailsError(true);
      return;
    }
    setDetailsError(false);
  }

  const related = courses.filter(c => c.category === course.category && c.id !== course.id).slice(0, 3);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-bark)]/50 mb-8 pt-4">
          <button onClick={() => navigate(-1)} aria-label="Go back"
            className="flex items-center gap-1.5 hover:text-[var(--color-terracotta)] transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
          <span>/</span>
          <Link to="/courses" className="hover:text-[var(--color-terracotta)] transition-colors">Courses</Link>
          <span>/</span>
          <span className="text-[var(--color-bark)]">{course.name}</span>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 mb-20">

          {/* ── LEFT: Course info ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}>

            {/* Hero image */}
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[var(--color-beige)] mb-8">
              <img src={course.image} alt={course.name}
                className="w-full h-full object-cover" loading="eager" />
            </div>

            <p className="text-xs uppercase tracking-widest text-[var(--color-gold)] font-medium mb-2">Training Program</p>
            <h1 className="font-display text-3xl sm:text-4xl text-[var(--color-bark)] mb-4 leading-tight">{course.name}</h1>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="flex items-center gap-1.5 text-xs text-[var(--color-bark)]/60 px-3 py-1.5 rounded-full bg-[var(--color-beige)]">
                <Clock size={12} /> {course.duration}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[var(--color-bark)]/60 px-3 py-1.5 rounded-full bg-[var(--color-beige)]">
                <Monitor size={12} /> {course.mode}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[var(--color-olive)] font-medium px-3 py-1.5 rounded-full bg-[var(--color-olive)]/8">
                🎓 Certificate included
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[var(--color-olive)] font-medium px-3 py-1.5 rounded-full bg-[var(--color-olive)]/8">
                ♾️ Lifetime support
              </span>
            </div>

            <p className="text-[var(--color-bark)]/65 leading-relaxed text-base mb-8">{course.description}</p>

            {/* What you'll learn */}
            <div className="mb-8 p-6 rounded-2xl bg-[var(--color-ivory-deep)]/60 border border-[var(--color-cream-line)]">
              <h2 className="font-display text-lg text-[var(--color-bark)] mb-4">What you'll learn</h2>
              <ul className="space-y-2.5">
                {course.whatYouLearn.map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-bark)]/70">
                    <CheckCircle size={15} className="text-[var(--color-olive)] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Package comparison */}
            <h2 className="font-display text-xl text-[var(--color-bark)] mb-5">Compare packages</h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {packages.map(p => (
                <button key={p.id} onClick={() => setSelectedPkg(p.id)}
                  className={`text-left p-4 rounded-2xl border-2 transition-all duration-250 ${
                    selectedPkg === p.id
                      ? 'border-[var(--color-terracotta)] bg-[var(--color-terracotta)]/5 shadow-md'
                      : 'border-[var(--color-cream-line)] bg-white hover:border-[var(--color-olive)]/40'
                  }`}>
                  <p className="font-display text-base text-[var(--color-bark)] mb-0.5">{p.name}</p>
                  <p className="font-display text-xl text-[var(--color-olive)]">₹{course.prices[p.id].toLocaleString()}</p>
                  <p className="text-xs text-[var(--color-bark)]/50 mt-1 leading-snug">{p.tagline}</p>
                </button>
              ))}
            </div>

            {/* Selected package features */}
            <motion.div key={selectedPkg}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-white border border-[var(--color-cream-line)] mb-8">
              <p className="font-medium text-sm text-[var(--color-bark)] mb-3">{pkg.name} package includes:</p>
              <ul className="space-y-2">
                {pkg.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--color-bark)]/70">
                    <CheckCircle size={13} className="text-[var(--color-olive)] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Enrollment card (sticky) ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:sticky lg:top-28 lg:self-start">

            <div className="bg-white rounded-3xl border border-[var(--color-cream-line)] shadow-xl shadow-[var(--color-bark)]/8 overflow-hidden">
              {/* Top accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-gold)] via-[var(--color-terracotta)] to-[var(--color-olive)]" />

              <div className="p-6">
                <p className="text-sm text-[var(--color-bark)]/55 mb-1">Selected: <strong className="text-[var(--color-bark)]">{pkg.name}</strong></p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-display text-4xl text-[var(--color-olive)]">₹{price.toLocaleString()}</span>
                  <span className="text-sm text-[var(--color-bark)]/45">one-time</span>
                </div>

                {/* Package selector (mobile-friendly) */}
                <div className="flex rounded-xl border border-[var(--color-cream-line)] overflow-hidden mb-5">
                  {packages.map(p => (
                    <button key={p.id} onClick={() => setSelectedPkg(p.id)}
                      className={`flex-1 py-2 text-xs font-medium transition-colors ${
                        selectedPkg === p.id
                          ? 'bg-[var(--color-olive)] text-white'
                          : 'text-[var(--color-bark)]/60 hover:bg-[var(--color-beige)]'
                      }`}>
                      {p.name}
                    </button>
                  ))}
                </div>

                {/* Enroll form toggle */}
                <button
                  onClick={() => setShowForm(f => !f)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-ivory-deep)]/60 border border-[var(--color-cream-line)] text-sm text-[var(--color-olive)] font-medium mb-3"
                >
                  Add your details (required)
                  {showForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-3"
                  >
                    <div className="space-y-3 pt-1">
                      <input type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors placeholder:text-[var(--color-bark)]/35" />
                      <input type="text" value={city} onChange={e => setCity(e.target.value)}
                        placeholder="Your city / location"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors placeholder:text-[var(--color-bark)]/35" />
                      <input type="text" value={country} onChange={e => setCountry(e.target.value)}
                        placeholder="Country"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors placeholder:text-[var(--color-bark)]/35" />
                      {detailsError && <p className="text-xs text-[var(--color-terracotta)]">Please enter your name, city/location, and country to continue.</p>}
                    </div>
                  </motion.div>
                )}

                {/* Primary CTA — WhatsApp */}
                <a href={waLink} target="_blank" rel="noopener noreferrer" onClick={handleEnroll}
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe5d] transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30 mb-3">
                  <MessageCircle size={18} />
                  Enroll on WhatsApp
                </a>

                {/* Secondary — Call */}
                <a href={`tel:+91${CALL_NUMBER}`}
                  className="flex items-center justify-center gap-2.5 w-full py-3 rounded-full border border-[var(--color-cream-line)] text-[var(--color-olive)] font-medium hover:bg-[var(--color-beige)] transition-colors text-sm mb-3">
                  <Phone size={16} /> Call to enquire — {CALL_NUMBER}
                </a>

                {/* Tertiary — Instagram DM */}
                <a href="https://www.instagram.com/motherdaughterroots"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3 rounded-full border border-[var(--color-cream-line)] text-[var(--color-bark)]/60 font-medium hover:bg-[var(--color-beige)] transition-colors text-sm">
                  <Instagram size={16} /> DM on Instagram
                </a>

                <p className="text-[11px] text-center text-[var(--color-bark)]/40 mt-4 leading-relaxed">
                  No payment now. We'll confirm the training format, timing, and payment details on WhatsApp.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related courses */}
        {related.length > 0 && (
          <>
            <RootDivider />
            <div className="mt-14">
              <h2 className="font-display text-2xl sm:text-3xl text-[var(--color-bark)] mb-8">More in this category</h2>
              <div className="grid sm:grid-cols-3 gap-5 sm:gap-6">
                {related.map((c, i) => (
                  <motion.div key={c.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    className="group bg-white rounded-2xl border border-[var(--color-cream-line)] overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <Link to={`/courses/${c.id}`} className="block">
                      <div className="h-36 overflow-hidden bg-[var(--color-beige)]">
                        <img src={c.image} alt={c.name} loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="p-4">
                        <p className="font-display text-base text-[var(--color-bark)] mb-1">{c.name}</p>
                        <p className="text-xs text-[var(--color-bark)]/50 mb-3 line-clamp-2">{c.shortDesc}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-display text-[var(--color-olive)]">from ₹{c.prices.beginner.toLocaleString()}</span>
                          <span className="text-xs text-[var(--color-terracotta)] flex items-center gap-1 font-medium">
                            View <ArrowRight size={11} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
