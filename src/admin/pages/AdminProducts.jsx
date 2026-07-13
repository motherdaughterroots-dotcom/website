import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Pencil, Trash2, Star, Package } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { PRODUCT_CATEGORIES } from '../constants/productCategories'
import AdminLayout from '../components/AdminLayout'
import ConfirmModal from '../components/ConfirmModal'
import AdminToast from '../components/AdminToast'
import Toggle from '../components/Toggle'

const CATEGORIES = [{ id: 'all', label: 'All' }, ...PRODUCT_CATEGORIES]

export default function AdminProducts() {
  const navigate = useNavigate()
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast]           = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const showToast = (type, message) => setToast({ type, message })

  // ── Fetch products ──────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, category, price, net_qty,
        is_in_stock, is_featured, discount_percent, sort_order,
        product_media ( url, type, sort_order )
      `)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) { showToast('error', 'Failed to load products'); setLoading(false); return }

    // Attach main image to each product
    const enriched = (data || []).map(p => {
      const images = (p.product_media || [])
        .filter(m => m.type === 'image')
        .sort((a, b) => a.sort_order - b.sort_order)
      return { ...p, mainImage: images[0]?.url || null }
    })
    setProducts(enriched)
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // ── Real-time subscription ──────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('admin-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts()
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [fetchProducts])

  // ── Toggle in_stock / is_featured ───────────────────────────────────────
  const toggleField = async (id, field, current) => {
    setTogglingId(id + field)
    const { error } = await supabase
      .from('products')
      .update({ [field]: !current })
      .eq('id', id)
    setTogglingId(null)
    if (error) { showToast('error', `Failed to update`); return }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: !current } : p))
  }

  // ── Delete product ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)

    const { data: mediaFiles, error: mediaError } = await supabase
      .from('product_media')
      .select('url')
      .eq('product_id', deleteTarget.id)

    if (mediaError) {
      setDeleteLoading(false)
      showToast('error', 'Failed to prepare product files for deletion')
      return
    }

    const imagePaths = (mediaFiles || [])
      .filter(m => m.url.includes('product-images'))
      .map(m => m.url.split('/product-images/')[1])
    const videoPaths = (mediaFiles || [])
      .filter(m => m.url.includes('product-videos'))
      .map(m => m.url.split('/product-videos/')[1])

    // Delete product row (CASCADE handles related rows)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteTarget.id)

    setDeleteLoading(false)
    setDeleteTarget(null)

    if (error) { showToast('error', 'Failed to delete product'); return }
    setProducts(prev => prev.filter(p => p.id !== deleteTarget.id))

    const storageErrors = []
    if (imagePaths.length) {
      const { error: imageError } = await supabase.storage.from('product-images').remove(imagePaths)
      if (imageError) storageErrors.push(imageError)
    }
    if (videoPaths.length) {
      const { error: videoError } = await supabase.storage.from('product-videos').remove(videoPaths)
      if (videoError) storageErrors.push(videoError)
    }

    showToast(
      storageErrors.length ? 'error' : 'success',
      storageErrors.length
        ? `Product deleted, but ${storageErrors.length} file cleanup task(s) failed`
        : `"${deleteTarget.name}" deleted successfully`
    )
  }

  // ── Filtered list ────────────────────────────────────────────────────────
  const visible = products.filter(p => {
    const matchCat    = category === 'all' || p.category === category
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <AdminLayout>
      <AdminToast toast={toast} onClose={() => setToast(null)} />
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete product?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />

      <div className="p-5 sm:p-7 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-[var(--color-bark)]">Products</h1>
            <p className="text-sm text-[var(--color-bark)]/50 mt-0.5">{products.length} total products</p>
          </div>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-olive)] text-white text-sm font-medium hover:bg-[var(--color-terracotta)] transition-colors"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-bark)]/35" />
            <input type="search" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--color-cream-line)] bg-white text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-[var(--color-cream-line)] bg-white text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors cursor-pointer">
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-7 h-7 border-2 border-[var(--color-olive)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package size={36} className="text-[var(--color-bark)]/20 mb-3" />
            <p className="font-display text-lg text-[var(--color-bark)]/50">No products found</p>
            {products.length === 0 && (
              <button onClick={() => navigate('/admin/products/new')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[var(--color-olive)] text-white text-sm font-medium">
                Add your first product
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[var(--color-cream-line)] overflow-hidden">
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-cream-line)] bg-[var(--color-ivory-deep)]/60">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide">Price</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide">In Stock</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide">Featured</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-cream-line)]/60">
                  <AnimatePresence>
                    {visible.map((product) => (
                      <motion.tr key={product.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="hover:bg-[var(--color-ivory-deep)]/40 transition-colors">
                        {/* Product name + image */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[var(--color-beige)] flex-shrink-0 overflow-hidden">
                              {product.mainImage
                                ? <img src={product.mainImage} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-[var(--color-bark)]/20"><Package size={16} /></div>
                              }
                            </div>
                            <div>
                              <p className="font-medium text-[var(--color-bark)] line-clamp-1">{product.name}</p>
                              {product.discount_percent > 0 && (
                                <span className="text-[10px] font-semibold text-[var(--color-terracotta)] bg-[var(--color-terracotta)]/10 px-1.5 py-0.5 rounded-full">
                                  {product.discount_percent}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        {/* Category */}
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-beige)] text-[var(--color-bark)]/70 capitalize">
                            {product.category.replace('-', ' ')}
                          </span>
                        </td>
                        {/* Price */}
                        <td className="px-4 py-3 font-display text-[var(--color-olive)]">₹{product.price}</td>
                        {/* In Stock toggle */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <Toggle
                              checked={product.is_in_stock}
                              disabled={togglingId === product.id + 'is_in_stock'}
                              onChange={() => toggleField(product.id, 'is_in_stock', product.is_in_stock)}
                            />
                          </div>
                        </td>
                        {/* Featured toggle */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <Toggle
                              checked={product.is_featured}
                              disabled={togglingId === product.id + 'is_featured'}
                              onChange={() => toggleField(product.id, 'is_featured', product.is_featured)}
                            />
                          </div>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => navigate(`/admin/products/${product.id}`)}
                              className="p-2 rounded-lg text-[var(--color-bark)]/50 hover:bg-[var(--color-beige)] hover:text-[var(--color-olive)] transition-colors">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => setDeleteTarget(product)}
                              className="p-2 rounded-lg text-[var(--color-bark)]/50 hover:bg-red-50 hover:text-red-500 transition-colors">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile card layout */}
            <div className="sm:hidden divide-y divide-[var(--color-cream-line)]/60">
              {visible.map(product => (
                <div key={product.id} className="p-4 flex gap-3 items-start">
                  <div className="w-14 h-14 rounded-xl bg-[var(--color-beige)] flex-shrink-0 overflow-hidden">
                    {product.mainImage
                      ? <img src={product.mainImage} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Package size={18} className="text-[var(--color-bark)]/20" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-bark)] text-sm line-clamp-1 mb-1">{product.name}</p>
                    <p className="text-xs text-[var(--color-bark)]/50 mb-2">₹{product.price} · {product.category.replace('-', ' ')}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-[var(--color-bark)]/50">Stock</span>
                        <Toggle checked={product.is_in_stock}
                          disabled={togglingId === product.id + 'is_in_stock'}
                          onChange={() => toggleField(product.id, 'is_in_stock', product.is_in_stock)} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star size={12} className="text-[var(--color-gold)]" />
                        <Toggle checked={product.is_featured}
                          disabled={togglingId === product.id + 'is_featured'}
                          onChange={() => toggleField(product.id, 'is_featured', product.is_featured)} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button onClick={() => navigate(`/admin/products/${product.id}`)}
                      className="p-2 rounded-lg bg-[var(--color-beige)] text-[var(--color-olive)]">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(product)}
                      className="p-2 rounded-lg bg-red-50 text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
