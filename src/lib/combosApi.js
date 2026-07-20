import { supabase } from './supabase';

function groupBy(rows, key) {
  return rows.reduce((acc, row) => {
    const k = row[key];
    if (!acc[k]) acc[k] = [];
    acc[k].push(row);
    return acc;
  }, {});
}

/**
 * Map a combo row + items into the same catalog shape products use on the storefront.
 */
export function mapCombo(row, items = [], productLookup = {}) {
  const comboItems = (items || [])
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((item) => {
      const product = productLookup[item.product_id];
      return {
        productId: item.product_id,
        quantity: item.quantity || 1,
        name: product?.name || 'Product',
        image: product?.image || '/images/brand/logo.png',
        price: product?.price || 0,
        netQty: product?.netQty || '',
      };
    });

  const totalItems = comboItems.reduce((sum, item) => sum + item.quantity, 0);
  const image = row.image_url || comboItems[0]?.image || '/images/brand/logo.png';
  const originalTotal = comboItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    kind: 'combo',
    id: row.id,
    name: row.name,
    category: 'combos',
    subcategory: 'Combo Pack',
    tagline: row.tagline || '',
    price: Number(row.price) || 0,
    netQty: `${totalItems} item${totalItems !== 1 ? 's' : ''}`,
    image,
    images: [image],
    videoUrl: '',
    videoType: null,
    description: row.description || '',
    benefits: [],
    keyIngredients: [],
    baseOils: [],
    howToUse: '',
    suitableFor: 'All Skin Types',
    badges: [
      ...(row.is_in_stock === false ? ['Out of Stock'] : ['In Stock']),
      ...(row.is_featured ? ['Featured'] : []),
      'Combo',
    ],
    isInStock: row.is_in_stock !== false,
    isFeatured: !!row.is_featured,
    discountPercent: 0,
    sortOrder: Number(row.sort_order) || 0,
    comboItems,
    originalTotal,
  };
}

export async function fetchCombosFromSupabase(productLookup = {}) {
  const [
    { data: combos, error: comboErr },
    { data: items, error: itemsErr },
  ] = await Promise.all([
    supabase.from('combos').select('*').order('sort_order', { ascending: true }),
    supabase.from('combo_items').select('*').order('sort_order', { ascending: true }),
  ]);

  if (comboErr) {
    if (comboErr.code === 'PGRST205') return [];
    throw comboErr;
  }
  if (itemsErr) throw itemsErr;

  const itemsByCombo = groupBy(items || [], 'combo_id');
  return (combos || []).map((row) =>
    mapCombo(row, itemsByCombo[row.id] || [], productLookup),
  );
}
