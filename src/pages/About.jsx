import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Heart, Sprout, FlaskConical } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import RootDivider from '../components/RootDivider';
import { usePageTitle } from '../hooks/usePageTitle';

const VALUES = [
  { icon: Heart,        title: 'Rooted in Love',      desc: 'Every product carries the warmth of a mother\'s care and a daughter\'s passion for natural living.' },
  { icon: Leaf,         title: 'Pure Ingredients',     desc: 'We source real botanicals — turmeric, neem, amla — and never dilute them with fillers or synthetics.' },
  { icon: FlaskConical, title: 'Lab-Tested Safety',    desc: 'Handmade does not mean unscientific. Our formulations are tested to ensure safety and efficacy.' },
  { icon: Sprout,       title: 'Small-Batch Always',   desc: 'We will never scale at the cost of quality. Every batch is made fresh, in limited quantities.' },
];

const PROCESS = [
  { step: '01', title: 'Sourcing',      desc: 'We hand-select herbs, botanicals, and cold-pressed carrier oils from trusted, natural sources.' },
  { step: '02', title: 'Blending',      desc: 'Ingredients are blended by hand following traditional recipes, refined through years of experimentation.' },
  { step: '03', title: 'Curing',        desc: 'Cold-process soaps cure for 4–6 weeks. Oils and powders are freshly bottled in small runs.' },
  { step: '04', title: 'Quality Check', desc: 'Every batch is checked for consistency, scent, and texture before it reaches you.' },
];

export default function About() {
  usePageTitle('Our Story — Mother Daughter Roots');
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-6 sm:px-8 bg-[var(--color-olive)] overflow-hidden">
        <div className="noise-overlay absolute inset-0 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}>
            <span className="font-script text-3xl sm:text-4xl text-[var(--color-gold-light)] block mb-3">Our story</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[var(--color-ivory)] leading-[1.1] mb-6">
              Two generations,<br />rooted in one tradition
            </h1>
            <p className="text-[var(--color-ivory)]/65 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Mother Daughter Roots was born at a kitchen table — where age-old herbal wisdom passed quietly between a mother and daughter found its calling.
            </p>
          </motion.div>
        </div>
      </section>

      <RootDivider flip />

      {/* Story */}
      <section className="py-16 sm:py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.65 }}
            className="relative flex justify-center">
            <img src="/images/brand/logo.png" alt="Mother Daughter Roots"
              className="w-72 sm:w-96 rounded-full shadow-2xl shadow-[var(--color-bark)]/12" />
            <div className="absolute -bottom-4 -right-4 bg-[var(--color-beige)] rounded-2xl px-5 py-3 shadow-lg hidden sm:block">
              <p className="font-script text-2xl text-[var(--color-terracotta)]">Rooted in Love</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
            <span className="font-script text-2xl text-[var(--color-terracotta)] block mb-3">How it started</span>
            <h2 className="font-display text-3xl sm:text-4xl text-[var(--color-bark)] mb-5 leading-tight">
              A kitchen table. A mother's recipes. A daughter's dream.
            </h2>
            <div className="space-y-4 text-[var(--color-bark)]/65 leading-relaxed text-[15px]">
              <p>
                It started the way the best things always do — not with a business plan, but with a conversation. A daughter watching her mother grind turmeric paste, asking questions, writing things down. Generations of herbal knowledge that had never been written anywhere, passed in kitchens, in whispers.
              </p>
              <p>
                We looked around at what was being sold as "natural" — and found diluted extracts, hidden sulphates, marketing language designed to confuse. We decided to do the opposite: make products exactly as they should be made, using real ingredients, in small batches, with nothing hidden.
              </p>
              <p>
                Mother Daughter Roots is not a factory. It is two people who care deeply about what goes on your skin — and won't compromise on that, ever.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <RootDivider />

      {/* Values */}
      <section className="py-16 sm:py-24 bg-[var(--color-ivory-deep)]/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <SectionHeading eyebrow="What we stand for" title="Our values" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-[var(--color-cream-line)] hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 rounded-full bg-[var(--color-olive)]/8 flex items-center justify-center mb-4">
                  <v.icon size={22} className="text-[var(--color-olive)]" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg text-[var(--color-bark)] mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--color-bark)]/60 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <RootDivider flip />

      {/* Process */}
      <section className="py-16 sm:py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <SectionHeading eyebrow="How we make it" title="Our process" align="left"
          subtitle="Handmade does not mean haphazard. Every step is deliberate." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PROCESS.map((step, i) => (
            <motion.div key={step.step}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}>
              <p className="font-display text-4xl text-[var(--color-gold)]/25 mb-3">{step.step}</p>
              <h3 className="font-display text-xl text-[var(--color-bark)] mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--color-bark)]/60 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 bg-[var(--color-beige)]/50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="font-script text-2xl text-[var(--color-terracotta)] block mb-2">Ready to try?</span>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--color-bark)] mb-4">Experience the difference</h2>
          <p className="text-[var(--color-bark)]/60 mb-8">Browse our collection and find your new herbal ritual.</p>
          <Link to="/shop"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[var(--color-olive)] text-white font-medium hover:bg-[var(--color-terracotta)] transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-terracotta)]/20">
            Shop the Collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
