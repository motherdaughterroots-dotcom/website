import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play } from 'lucide-react';

/**
 * Multi-image + video gallery.
 * The video appears as a thumbnail in the strip.
 * Clicking it replaces the main image with the YouTube embed.
 *
 * @param {string[]} images       - Array of image paths (≥1).
 * @param {string}   videoUrl     - YouTube embed URL.
 * @param {string}   [productName] - Used as alt text on images.
 */
export default function ProductGallery({ images, videoUrl, productName = 'Product image' }) {
  // Items = all images + optionally a video entry at the end
  const items = [
    ...images.map((src) => ({ type: 'image', src })),
    ...(videoUrl ? [{ type: 'video', src: videoUrl }] : []),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!items.length) return null;

  const selected = items[selectedIndex];

  return (
    <div className="flex flex-col gap-3">

      {/* ── Main viewer ── */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#E8DFC8]">
        <AnimatePresence mode="sync">
          {selected.type === 'image' ? (
            <motion.img
              key={`img-${selectedIndex}`}
              src={selected.src}
              alt={productName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <iframe
                src={`${selected.src}?autoplay=1`}
                title="Product video"
                allowFullScreen
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-full rounded-3xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Thumbnail strip (hidden when only 1 item total) ── */}
      {items.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
          role="list"
          aria-label="Product media"
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              role="listitem"
              aria-label={item.type === 'video' ? 'View product video' : `View image ${i + 1}`}
              aria-pressed={i === selectedIndex}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden transition-all duration-200 focus-visible:outline-none bg-[#E8DFC8]
                ${i === selectedIndex
                  ? 'ring-2 ring-[#C9603A] ring-offset-1 opacity-100'
                  : 'ring-2 ring-transparent opacity-55 hover:opacity-90'}`}
            >
              {item.type === 'image' ? (
                <img
                  src={item.src}
                  alt={`${productName} — view ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Video thumbnail — play icon overlay */
                <div className="w-full h-full flex items-center justify-center bg-[#2B2118]/80">
                  <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                    <Play size={13} className="text-[#C9603A] ml-0.5" fill="#C9603A" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
