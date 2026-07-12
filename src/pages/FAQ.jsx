import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle } from 'lucide-react';
import { getWhatsAppGeneralLink } from '../utils/whatsapp';
import RootDivider from '../components/RootDivider';
import { usePageTitle } from '../hooks/usePageTitle';

const FAQS = [
  {
    category: 'Orders & Delivery',
    items: [
      { q: 'How do I place an order?', a: 'Add products to your basket, then click "Order on WhatsApp". Your full order summary will be pre-filled in WhatsApp — just send it and we\'ll confirm availability and arrange delivery.' },
      { q: 'Do you ship across India?', a: 'Yes! We ship pan-India. Shipping charges and timelines are confirmed via WhatsApp once you place your order.' },
      { q: 'Can I order your products from outside India?', a: 'Yes! We ship to select countries. Please message us on WhatsApp with your country and we will confirm if we can ship there and the shipping charges.' },
      { q: 'How long does delivery take?', a: 'Typically 5–8 business days depending on your location. Express delivery options can be discussed on WhatsApp.' },
      { q: 'What payment methods do you accept?', a: 'We accept UPI, bank transfer, and cash on delivery in select areas. Payment details are shared when your order is confirmed.' },
    ],
  },
  {
    category: 'Products & Ingredients',
    items: [
      { q: 'Are your products truly chemical-free?', a: 'Yes. We do not use parabens, sulphates, synthetic fragrances, artificial preservatives, or mineral oil. Our ingredient lists are fully transparent — every ingredient on the label is there for a purpose.' },
      { q: 'Are your soaps cold-process or melt-and-pour?', a: 'Our soaps are cold-process, made from scratch using raw oils, lye, and botanicals. This preserves the natural glycerin and gives a superior, longer-lasting bar.' },
      { q: 'Are the herbal powders food-grade?', a: 'Our herbal powders are 100% pure and organic, suitable for both skincare use and traditional consumption (like in smoothies or face packs). They are not processed in a food-certified facility, so please use your judgement.' },
      { q: 'Is your hair oil suitable for all hair types?', a: 'Yes — the Botanical Strength Hair Oil is formulated for all hair types including oily, dry, and combination scalps, and is suitable for both men and women.' },
      { q: 'Do you test on animals?', a: 'Never. All our products are cruelty-free.' },
    ],
  },
  {
    category: 'Usage & Storage',
    items: [
      { q: 'How should I store my products?', a: 'Store in a cool, dry place away from direct sunlight. Soaps should be kept on a draining soap dish between uses to extend their life. Powders should be kept sealed and away from moisture.' },
      { q: 'What is the shelf life?', a: 'Soaps: 18–24 months. Oils: 12–24 months. Herbal powders: 12–18 months. Best-before dates are printed on each product.' },
      { q: 'Can I use the soaps on my face?', a: 'Yes — all our soaps are gentle enough for face use. The Ubtan Glow Bar is specifically popular for facial use. Always patch test first, especially for sensitive skin.' },
      { q: 'Can I use the coconut oil on my baby?', a: 'Yes. The Cold Pressed Virgin Coconut Oil is suitable for baby massage. It is 100% pure with no additives.' },
    ],
  },
  {
    category: 'Courses & Training',
    items: [
      { q: 'What format are the courses taught in?', a: 'Our regular courses are live, personal online training sessions on WhatsApp video call. You learn in real time with guidance at every step â€” there are no pre-recorded lessons.' },
      { q: 'Do I need prior experience to join?', a: 'No. Our Beginner package is designed for complete newcomers. You can choose Intermediate or Premium if you already make products and would like more advanced formulation or business guidance.' },
      { q: 'How long does a course take?', a: 'Most courses are taught over 3â€“5 days, depending on the course and your pace. Your exact schedule is confirmed personally on WhatsApp before training begins.' },
      { q: 'Will I receive a certificate?', a: 'Yes. A certificate of completion is included with every course.' },
      { q: 'Do you offer offline classes?', a: 'Yes. We can conduct an in-person, hands-on workshop at your preferred location when you arrange a group of 10â€“20 learners. Message us on WhatsApp to discuss the location and dates.' },
      { q: 'Can learners outside India join?', a: 'Yes. International learners can join our online courses. Share your country and preferred time zone when you enquire; we will confirm suitable timings and available international payment methods.' },
      { q: 'How do I enrol in a course?', a: 'Open the course you want, choose your package, enter your details, and select Enrol on WhatsApp. We will then confirm the next available training slot and payment details.' },
    ],
  },
  {
    category: 'About the Brand',
    items: [
      { q: 'Are your products handmade?', a: 'Absolutely. Every product is made by hand, in small batches, by us — a mother and daughter. We do not outsource manufacturing.' },
      { q: 'Do you offer workshops?', a: 'Yes! We run online and offline soap-making workshops. Follow our Instagram @motherdaughterroots or message us on WhatsApp for upcoming dates.' },
      { q: 'Can I resell your products?', a: 'We do offer wholesale and reseller options. Reach out via WhatsApp to discuss pricing and minimum order quantities.' },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-cream-line)] last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={`faq-answer-${q.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}`}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className={`font-medium text-[15px] leading-snug transition-colors ${open ? 'text-[var(--color-terracotta)]' : 'text-[var(--color-bark)]'}`}>{q}</span>
        <span className="flex-shrink-0 mt-0.5 text-[var(--color-olive)]">
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden">
            <p className="pb-5 text-sm text-[var(--color-bark)]/65 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  usePageTitle('FAQ — Mother Daughter Roots');
  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="py-14 sm:py-20 px-6 sm:px-8 bg-[var(--color-ivory-deep)]/60 border-b border-[var(--color-cream-line)] mb-14">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-script text-3xl text-[var(--color-terracotta)] block mb-2">Got questions?</span>
          <h1 className="font-display text-4xl sm:text-5xl text-[var(--color-bark)]">Frequently Asked Questions</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <div className="space-y-10">
          {FAQS.map((section) => (
            <motion.div key={section.category}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.55 }}>
              <h2 className="font-display text-xl sm:text-2xl text-[var(--color-olive)] mb-1">{section.category}</h2>
              <div className="w-10 h-0.5 bg-[var(--color-gold)] mb-4" />
              <div className="bg-white rounded-2xl border border-[var(--color-cream-line)] px-5 sm:px-7">
                {section.items.map(item => <FAQItem key={item.q} {...item} />)}
              </div>
            </motion.div>
          ))}
        </div>

        <RootDivider className="my-12" />

        {/* Still have questions CTA */}
        <div className="text-center bg-[var(--color-beige)]/50 rounded-3xl border border-[var(--color-cream-line)] p-10">
          <span className="font-script text-2xl text-[var(--color-terracotta)] block mb-2">Still wondering?</span>
          <h3 className="font-display text-2xl text-[var(--color-bark)] mb-3">We're happy to help</h3>
          <p className="text-sm text-[var(--color-bark)]/60 mb-6 max-w-md mx-auto">
            No question is too small. Send us a message on WhatsApp and we'll get back to you personally.
          </p>
          <a href={getWhatsAppGeneralLink('Hi! I have a question about your products.')}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#25D366] text-white font-medium hover:bg-[#1ebe5d] transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30">
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
