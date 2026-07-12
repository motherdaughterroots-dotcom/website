// src/components/LearnWithUs.jsx
// Home page section — shows 3 featured courses + CTA to /courses
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Star } from 'lucide-react';
import { getFeaturedCourses } from '../data/courses';
import SectionHeading from './SectionHeading';

export default function LearnWithUs() {
  const featured = getFeaturedCourses().slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-[var(--color-ivory-deep)]/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SectionHeading
          eyebrow="Train with the maker herself"
          title="Learn with us"
          subtitle="Live 1-to-1 WhatsApp training or offline group classes (10–20 members). No recordings — personal guidance from scratch to sellable product. Arrange a group in your city and get offline training."
        />

        <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 mb-10">
          {featured.map((course, i) => (
            <motion.div key={course.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-2xl border border-[var(--color-cream-line)] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[var(--color-bark)]/8 transition-all duration-300"
            >
              <Link to={`/courses/${course.id}`} className="block">
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-[var(--color-beige)]">
                  <img src={course.image} alt={course.name} loading="lazy" decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bark)]/30 to-transparent" />
                  {/* Popular badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-gold)] text-white text-[10px] font-bold shadow">
                    <Star size={9} fill="white" /> Popular
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-display text-[17px] text-[var(--color-bark)] mb-1.5 leading-snug">{course.name}</h3>
                  <p className="text-xs text-[var(--color-bark)]/55 line-clamp-2 mb-3">{course.shortDesc}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color-cream-line)]">
                    <div>
                      <p className="text-[10px] text-[var(--color-bark)]/40">Starting from</p>
                      <p className="font-display text-base text-[var(--color-olive)]">₹{course.prices.beginner.toLocaleString()}</p>
                    </div>
                    <span className="text-xs text-[var(--color-terracotta)] font-medium flex items-center gap-1">
                      View details <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8">
          {['Live 1-to-1 on WhatsApp', 'Certificate of Completion', 'Lifetime Support', '3–5 Day Training'].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm text-[var(--color-bark)]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta)] flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link to="/courses"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[var(--color-olive)] text-white font-medium hover:bg-[var(--color-terracotta)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-terracotta)]/20">
            View All Training Programs <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}