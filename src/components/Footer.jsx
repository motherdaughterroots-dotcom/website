// import { Link } from 'react-router-dom';
// import { Instagram, Youtube, MessageCircle } from 'lucide-react';
// import { getWhatsAppGeneralLink } from '../utils/whatsapp';

// const socials = [
//   { href: getWhatsAppGeneralLink(), icon: MessageCircle, label: 'WhatsApp' },
//   { href: 'https://www.instagram.com/motherdaughterroots', icon: Instagram, label: 'Instagram' },
//   { href: 'https://www.youtube.com/@SanaKhan-81258', icon: Youtube, label: 'YouTube' },
// ];

// export default function Footer() {
//   return (
//     <footer className="bg-[var(--color-bark)] text-[var(--color-ivory)] relative overflow-hidden">
//       <div className="noise-overlay absolute inset-0 pointer-events-none" />
//       <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-8 relative z-10">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
//           {/* Brand */}
//           <div>
//             <div className="flex items-center gap-3 mb-3">
//               <img src="/images/brand/logo.png" alt="" className="w-11 h-11 rounded-full object-cover" />
//               <span className="font-display text-[17px] leading-tight">Mother<br />Daughter Roots</span>
//             </div>
//             <p className="font-script text-xl text-[var(--color-gold-light)] mb-3">Rooted in love</p>
//             <p className="text-sm text-[var(--color-ivory)]/50 leading-relaxed">
//               Handmade herbal skincare and haircare, crafted with tradition and care.
//             </p>
//           </div>

//           {/* Explore */}
//           <div>
//             <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold-light)] mb-4">Explore</h4>
//             <ul className="space-y-2.5 text-sm text-[var(--color-ivory)]/60">
//               {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About Us'], ['/faq', 'FAQ'], ['/contact', 'Contact']].map(([to, label]) => (
//                 <li key={to}><Link to={to} className="hover:text-[var(--color-ivory)] transition-colors">{label}</Link></li>
//               ))}
//             </ul>
//           </div>

//           {/* Categories */}
//           <div>
//             <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold-light)] mb-4">Categories</h4>
//             <ul className="space-y-2.5 text-sm text-[var(--color-ivory)]/60">
//               {[['face-care','Face Care'],['body-care','Body Care'],['hair-care','Hair Care'],['lip-care','Lip Care'],['fragrances','Fragrances'],['herbal-essentials','Herbal Essentials']].map(([id, label]) => (
//                 <li key={id}><Link to={`/shop?category=${id}`} className="hover:text-[var(--color-ivory)] transition-colors">{label}</Link></li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact */}
//           <div>
//             <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold-light)] mb-4">Connect</h4>
//             <div className="flex gap-3 mb-5">
//               {socials.map(({ href, icon: Icon, label }) => (
//                 <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
//                   className="w-10 h-10 rounded-full bg-[var(--color-ivory)]/8 flex items-center justify-center hover:bg-[var(--color-terracotta)] transition-colors duration-300">
//                   <Icon size={17} />
//                 </a>
//               ))}
//             </div>
//             <p className="text-sm text-[var(--color-ivory)]/55">+91 63044 60957</p>
//             <p className="text-xs text-[var(--color-ivory)]/35 mt-1">@motherdaughterroots</p>
//           </div>
//         </div>

//         <div className="mt-12 pt-6 border-t border-[var(--color-ivory)]/8 flex flex-col sm:flex-row items-center justify-between gap-2">
//           <p className="text-xs text-[var(--color-ivory)]/35">© {new Date().getFullYear()} Mother Daughter Roots. All rights reserved.</p>
//           <p className="text-xs text-[var(--color-ivory)]/35">Handcrafted with 🤍 — small batch, every time.</p>
//         </div>
//       </div>
//     </footer>
//   );
// }


// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { Instagram, Youtube, MessageCircle } from 'lucide-react';
import { getWhatsAppGeneralLink } from '../utils/whatsapp';

const socials = [
  { href: getWhatsAppGeneralLink(), icon: MessageCircle, label: 'WhatsApp' },
  { href: 'https://www.instagram.com/motherdaughterroots', icon: Instagram, label: 'Instagram' },
  { href: 'https://www.youtube.com/@SanaKhan-81258', icon: Youtube, label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bark)] text-[var(--color-ivory)] relative overflow-hidden">
      <div className="noise-overlay absolute inset-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <img src="/images/brand/logo.png" alt="" className="w-11 h-11 rounded-full object-cover" />
              <span className="font-display text-[17px] leading-tight">Mother<br />Daughter Roots</span>
            </div>
            <p className="font-script text-xl text-[var(--color-gold-light)] mb-3">Rooted in love</p>
            <p className="text-sm text-[var(--color-ivory)]/50 leading-relaxed max-w-xs">
              Handmade herbal skincare, haircare, and live training programs — crafted with tradition and care.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold-light)] mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-[var(--color-ivory)]/60">
              {[['/', 'Home'], ['/shop', 'Shop'], ['/courses', 'Courses'], ['/about', 'About Us'], ['/faq', 'FAQ'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-[var(--color-ivory)] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold-light)] mb-4">Products</h4>
            <ul className="space-y-2.5 text-sm text-[var(--color-ivory)]/60">
              {[['soaps', 'Soaps'], ['hair-care', 'Hair Care'], ['oils', 'Oils'], ['powders', 'Herbal Powders']].map(([id, label]) => (
                <li key={id}>
                  <Link to={`/shop?category=${id}`} className="hover:text-[var(--color-ivory)] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold-light)] mb-4">Connect</h4>
            <div className="flex gap-3 mb-5">
              {socials.map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-10 h-10 rounded-full bg-[var(--color-ivory)]/8 flex items-center justify-center hover:bg-[var(--color-terracotta)] transition-colors duration-300">
                  <Icon size={17} />
                </a>
              ))}
            </div>
            <p className="text-sm text-[var(--color-ivory)]/55 mb-1">+91 63044 60957</p>
            <p className="text-xs text-[var(--color-ivory)]/35">@motherdaughterroots</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-ivory)]/8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--color-ivory)]/35">© {new Date().getFullYear()} Mother Daughter Roots. All rights reserved.</p>
          <p className="text-xs text-[var(--color-ivory)]/35">Handcrafted with 🤍 — small batch, every time.</p>
        </div>
      </div>
    </footer>
  );
}