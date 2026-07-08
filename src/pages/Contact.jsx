import { motion } from 'framer-motion';
import { MessageCircle, Instagram, Youtube, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';
import { getWhatsAppGeneralLink } from '../utils/whatsapp';
import RootDivider from '../components/RootDivider';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Contact() {
  usePageTitle('Contact — Mother Daughter Roots');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    const text = `Hi! My name is ${form.name}.\n\nSubject: ${form.subject}\n\n${form.message}\n\nEmail: ${form.email}`;
    window.open(getWhatsAppGeneralLink(text), '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="py-14 sm:py-20 px-6 sm:px-8 bg-[var(--color-ivory-deep)]/60 border-b border-[var(--color-cream-line)] mb-14">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-script text-3xl text-[var(--color-terracotta)] block mb-2">We'd love to hear from you</span>
          <h1 className="font-display text-4xl sm:text-5xl text-[var(--color-bark)]">Get in Touch</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-2xl sm:text-3xl text-[var(--color-bark)] mb-6">The quickest way to reach us</h2>
            <p className="text-[var(--color-bark)]/60 leading-relaxed mb-8">
              We're a small team — a mother and daughter — so we respond personally to every message. WhatsApp is the fastest way to reach us for orders or questions.
            </p>

            <div className="space-y-4 mb-10">
              <a href={getWhatsAppGeneralLink()} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#25D366]/8 border border-[#25D366]/20 hover:bg-[#25D366]/15 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-[var(--color-bark)]">WhatsApp</p>
                  <p className="text-sm text-[var(--color-bark)]/55">+91 63044 60957</p>
                </div>
              </a>

              <a href="https://www.instagram.com/motherdaughterroots" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-beige)]/50 border border-[var(--color-cream-line)] hover:bg-[var(--color-beige)] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center flex-shrink-0">
                  <Instagram size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-[var(--color-bark)]">Instagram</p>
                  <p className="text-sm text-[var(--color-bark)]/55">@motherdaughterroots</p>
                </div>
              </a>

              <a href="https://www.youtube.com/@SanaKhan-81258" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-beige)]/50 border border-[var(--color-cream-line)] hover:bg-[var(--color-beige)] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-[#FF0000] flex items-center justify-center flex-shrink-0">
                  <Youtube size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-[var(--color-bark)]">YouTube</p>
                  <p className="text-sm text-[var(--color-bark)]/55">@SanaKhan-81258</p>
                </div>
              </a>
            </div>

            <div className="flex items-start gap-3 text-sm text-[var(--color-bark)]/55">
              <Clock size={16} className="flex-shrink-0 mt-0.5 text-[var(--color-gold)]" />
              <p>We typically respond within a few hours. Orders and availability questions get priority.</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="bg-white rounded-3xl border border-[var(--color-cream-line)] p-7 sm:p-9 shadow-sm">
              <h2 className="font-display text-xl text-[var(--color-bark)] mb-6">Send a message</h2>
              <form onSubmit={handle} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-bark)]/60 mb-1.5 uppercase tracking-wide">Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors placeholder:text-[var(--color-bark)]/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-bark)]/60 mb-1.5 uppercase tracking-wide">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors placeholder:text-[var(--color-bark)]/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-bark)]/60 mb-1.5 uppercase tracking-wide">Subject *</label>
                  <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Order inquiry, product question, etc."
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors placeholder:text-[var(--color-bark)]/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-bark)]/60 mb-1.5 uppercase tracking-wide">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us what's on your mind…"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors resize-none placeholder:text-[var(--color-bark)]/30" />
                </div>
                <button type="submit"
                  className={`w-full py-3.5 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2
                    ${sent ? 'bg-[var(--color-olive)] text-white' : 'bg-[var(--color-bark)] text-white hover:bg-[var(--color-terracotta)] hover:shadow-lg hover:shadow-[var(--color-terracotta)]/20'}`}>
                  <MessageCircle size={17} />
                  {sent ? 'Opening WhatsApp…' : 'Send via WhatsApp'}
                </button>
                <p className="text-[11px] text-center text-[var(--color-bark)]/40">
                  This opens WhatsApp with your message pre-filled — no form submissions, no spam.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
