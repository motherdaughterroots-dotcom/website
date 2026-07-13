import { supabase } from './supabase';

/** Display labels / emoji for category ids used by admin + legacy static data */
export const CATEGORY_META = {
  'face-care':         { name: 'Face Care',        emoji: '🌿' },
  'body-care':         { name: 'Body Care',        emoji: '🛁' },
  'hair-care':         { name: 'Hair Care',        emoji: '💇' },
  'lip-care':          { name: 'Lip Care',         emoji: '💋' },
  fragrances:          { name: 'Fragrances',       emoji: '🌸' },
  'herbal-essentials': { name: 'Herbal Essentials', emoji: '🌱' },
  soaps:               { name: 'Soaps',            emoji: '🧼' },
  skincare:            { name: 'Skin Care',        emoji: '✨' },
  haircare:            { name: 'Hair Care',        emoji: '💆' },
  cosmetics:           { name: 'Cosmetics',        emoji: '💄' },
  powders:             { name: 'Powders',          emoji: '🪴' },
  oils:                { name: 'Oils',             emoji: '🫒' },
};

function titleCase(id = '') {
  return id
    .split(/[-_]/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getCategoryMeta(id) {
  if (CATEGORY_META[id]) return { id, ...CATEGORY_META[id] };
  return { id, name: titleCase(id) || 'Other', emoji: '🌱' };
}

function isYouTubeEmbed(url = '') {
  return /^https?:\/\/(www\.)?youtube\.com\/embed\//i.test(url);
}

/** Map a YouTube watch/share URL to an embed URL when possible */
function toEmbedOrRaw(url = '') {
  if (!url) return '';
  if (isYouTubeEmbed(url)) return url;
  const watch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  return url;
}

/**
 * Normalize a Supabase product row (+ related rows) into the shape the UI expects.
 */
export function mapProduct(row, media = [], benefits = [], ingredients = []) {
  const images = media
    .filter(m => m.type === 'image')
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(m => m.url)
    .filter(Boolean);

  const video = media
    .filter(m => m.type === 'video')
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0];

  const keyIngredients = ingredients
    .filter(i => i.type === 'key')
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(i => i.name)
    .filter(Boolean);

  const baseOils = ingredients
    .filter(i => i.type === 'base_oil')
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(i => i.name)
    .filter(Boolean);

  const benefitList = benefits
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(b => b.benefit)
    .filter(Boolean);

  const catMeta = getCategoryMeta(row.category);
  const image = images[0] || '/images/brand/logo.png';

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    subcategory: catMeta.name,
    tagline: row.tagline || '',
    price: Number(row.price) || 0,
    netQty: row.net_qty || '',
    image,
    images: images.length ? images : [image],
    videoUrl: toEmbedOrRaw(video?.url || ''),
    videoType: video?.url
      ? (isYouTubeEmbed(toEmbedOrRaw(video.url)) || /youtu\.?be/i.test(video.url) ? 'youtube' : 'file')
      : null,
    description: row.description || '',
    benefits: benefitList,
    keyIngredients,
    baseOils,
    howToUse: row.how_to_use || '',
    suitableFor: row.suitable_for || '',
    badges: [
      ...(row.is_in_stock === false ? ['Out of Stock'] : ['In Stock']),
      ...(row.is_featured ? ['Featured'] : []),
    ],
    isInStock: row.is_in_stock !== false,
    isFeatured: !!row.is_featured,
    discountPercent: Number(row.discount_percent) || 0,
    sortOrder: Number(row.sort_order) || 0,
  };
}

/**
 * Fetch all products and related media/benefits/ingredients from Supabase.
 */
export async function fetchProductsFromSupabase() {
  const [
    { data: products, error: pErr },
    { data: media, error: mErr },
    { data: benefits, error: bErr },
    { data: ingredients, error: iErr },
  ] = await Promise.all([
    supabase.from('products').select('*').order('sort_order', { ascending: true }),
    supabase.from('product_media').select('*').order('sort_order', { ascending: true }),
    supabase.from('product_benefits').select('*').order('sort_order', { ascending: true }),
    supabase.from('product_ingredients').select('*').order('sort_order', { ascending: true }),
  ]);

  if (pErr) throw pErr;
  if (mErr) throw mErr;
  if (bErr) throw bErr;
  if (iErr) throw iErr;

  const mediaBy = groupBy(media || [], 'product_id');
  const benefitsBy = groupBy(benefits || [], 'product_id');
  const ingredientsBy = groupBy(ingredients || [], 'product_id');

  return (products || []).map(row =>
    mapProduct(
      row,
      mediaBy[row.id] || [],
      benefitsBy[row.id] || [],
      ingredientsBy[row.id] || [],
    )
  );
}

function groupBy(rows, key) {
  return rows.reduce((acc, row) => {
    const k = row[key];
    if (!acc[k]) acc[k] = [];
    acc[k].push(row);
    return acc;
  }, {});
}

export function categoriesFromProducts(products = []) {
  const seen = new Map();
  for (const p of products) {
    if (!p.category || seen.has(p.category)) continue;
    seen.set(p.category, getCategoryMeta(p.category));
  }
  return [...seen.values()];
}
