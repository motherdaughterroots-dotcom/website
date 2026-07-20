import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Loader } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { supabase } from '../../lib/supabase'
import Toggle from './Toggle'
import AdminToast from './AdminToast'

const EMPTY_FORM = {
  name: '',
  tagline: '',
  description: '',
  price: '',
  sort_order: 0,
  is_in_stock: true,
  is_featured: false,
}

async function requireSuccess(request) {
  const { data, error } = await request
  if (error) throw error
  return data
}

async function uploadComboImage(comboId, file) {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/webp',
  })
  const path = `combos/${comboId}/${Date.now()}.webp`
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, compressed, { upsert: true, contentType: 'image/webp' })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
  return publicUrl
}

export default function ComboForm({ comboId = null }) {
  const navigate = useNavigate()
  const isEdit = !!comboId

  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedItems, setSelectedItems] = useState([])
  const [availableProducts, setAvailableProducts] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [existingImageUrl, setExistingImageUrl] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (type, message) => setToast({ type, message })
  const dismissToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, price, net_qty,
          product_media ( url, type, sort_order )
        `)
        .order('name')

      if (error) {
        showToast('error', 'Failed to load products for combo builder')
        return
      }

      const enriched = (data || []).map((product) => {
        const images = (product.product_media || [])
          .filter((m) => m.type === 'image')
          .sort((a, b) => a.sort_order - b.sort_order)
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          netQty: product.net_qty,
          image: images[0]?.url || '/images/brand/logo.png',
        }
      })
      setAvailableProducts(enriched)
    }

    loadProducts()
  }, [])

  useEffect(() => {
    if (!isEdit) return

    async function loadCombo() {
      setLoading(true)
      try {
        const combo = await requireSuccess(
          supabase.from('combos').select('*').eq('id', comboId).single(),
        )
        const items = await requireSuccess(
          supabase.from('combo_items').select('*').eq('combo_id', comboId).order('sort_order'),
        )

        setForm({
          name: combo.name || '',
          tagline: combo.tagline || '',
          description: combo.description || '',
          price: combo.price || '',
          sort_order: combo.sort_order || 0,
          is_in_stock: combo.is_in_stock ?? true,
          is_featured: combo.is_featured ?? false,
        })
        setExistingImageUrl(combo.image_url || '')
        setSelectedItems((items || []).map((item) => ({
          productId: item.product_id,
          quantity: item.quantity || 1,
        })))
      } catch (err) {
        showToast('error', err.message || 'Failed to load combo')
      } finally {
        setLoading(false)
      }
    }

    loadCombo()
  }, [comboId, isEdit])

  const addProduct = (productId) => {
    if (!productId) return
    if (selectedItems.some((item) => item.productId === productId)) {
      showToast('error', 'Product already added to this combo')
      return
    }
    setSelectedItems((prev) => [...prev, { productId, quantity: 1 }])
  }

  const updateQuantity = (productId, quantity) => {
    const nextQty = Math.max(1, Number(quantity) || 1)
    setSelectedItems((prev) => prev.map((item) =>
      item.productId === productId ? { ...item, quantity: nextQty } : item,
    ))
  }

  const removeItem = (productId) => {
    setSelectedItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  const suggestedTotal = selectedItems.reduce((sum, item) => {
    const product = availableProducts.find((p) => p.id === item.productId)
    return sum + (Number(product?.price) || 0) * item.quantity
  }, 0)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { showToast('error', 'Combo name is required'); return }
    if (!form.price || Number(form.price) <= 0) { showToast('error', 'Combo price must be greater than 0'); return }
    if (selectedItems.length < 2) { showToast('error', 'Add at least 2 products to create a combo'); return }

    setSaving(true)
    let createdComboId = null

    try {
      setUploadProgress('Saving combo...')
      const comboData = {
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        sort_order: Number(form.sort_order) || 0,
        is_in_stock: form.is_in_stock,
        is_featured: form.is_featured,
        updated_at: new Date().toISOString(),
      }

      let cid = comboId
      if (isEdit) {
        await requireSuccess(supabase.from('combos').update(comboData).eq('id', cid))
      } else {
        const data = await requireSuccess(
          supabase.from('combos').insert(comboData).select('id').single(),
        )
        cid = data.id
        createdComboId = cid
      }

      setUploadProgress('Saving combo items...')
      await requireSuccess(supabase.from('combo_items').delete().eq('combo_id', cid))
      await requireSuccess(supabase.from('combo_items').insert(
        selectedItems.map((item, index) => ({
          combo_id: cid,
          product_id: item.productId,
          quantity: item.quantity,
          sort_order: index,
        })),
      ))

      if (imageFile) {
        setUploadProgress('Uploading combo image...')
        const imageUrl = await uploadComboImage(cid, imageFile)
        await requireSuccess(supabase.from('combos').update({ image_url: imageUrl }).eq('id', cid))
      }

      setUploadProgress('')
      showToast('success', isEdit ? 'Combo updated!' : 'Combo created!')
      setTimeout(() => navigate('/admin/combos'), 900)
    } catch (err) {
      console.error(err)
      if (createdComboId) {
        await supabase.from('combo_items').delete().eq('combo_id', createdComboId)
        await supabase.from('combos').delete().eq('id', createdComboId)
      }
      showToast('error', err.message || 'Something went wrong. Please try again.')
      setUploadProgress('')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-7 h-7 border-2 border-[var(--color-olive)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <AdminToast toast={toast} onClose={dismissToast} />

      <form onSubmit={handleSave} className="p-5 sm:p-7 max-w-4xl mx-auto space-y-8 pb-24">
        <section className="bg-white rounded-2xl border border-[var(--color-cream-line)] p-5 sm:p-6 space-y-4">
          <h2 className="font-display text-lg text-[var(--color-bark)]">Combo details</h2>

          <div>
            <label className="block text-sm font-medium text-[var(--color-bark)] mb-1.5">Combo name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Glow Care Combo"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-bark)] mb-1.5">Tagline</label>
            <input
              value={form.tagline}
              onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
              placeholder="Short line shown on shop card"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-bark)] mb-1.5">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What makes this combo special?"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)] resize-y"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-bark)] mb-1.5">Combo price (₹) *</label>
              <input
                required
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)]"
              />
              {suggestedTotal > 0 && (
                <p className="text-xs text-[var(--color-bark)]/50 mt-1.5">
                  Individual total: ₹{suggestedTotal}
                  {Number(form.price) > 0 && Number(form.price) < suggestedTotal
                    ? ` · Save ₹${suggestedTotal - Number(form.price)}`
                    : ''}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-bark)] mb-1.5">Sort order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm focus:outline-none focus:border-[var(--color-terracotta)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <Toggle checked={form.is_in_stock} onChange={(v) => setForm((f) => ({ ...f, is_in_stock: v }))} />
              <span className="text-sm text-[var(--color-bark)]">In stock</span>
            </div>
            <div className="flex items-center gap-3">
              <Toggle checked={form.is_featured} onChange={(v) => setForm((f) => ({ ...f, is_featured: v }))} />
              <span className="text-sm text-[var(--color-bark)]">Featured on home</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[var(--color-cream-line)] p-5 sm:p-6 space-y-4">
          <h2 className="font-display text-lg text-[var(--color-bark)]">Products in this combo</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              defaultValue=""
              onChange={(e) => { addProduct(e.target.value); e.target.value = '' }}
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--color-cream-line)] bg-white text-sm focus:outline-none focus:border-[var(--color-terracotta)]"
            >
              <option value="" disabled>Add a product...</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — ₹{product.price}
                </option>
              ))}
            </select>
          </div>

          {selectedItems.length === 0 ? (
            <p className="text-sm text-[var(--color-bark)]/50 py-6 text-center border border-dashed border-[var(--color-cream-line)] rounded-xl">
              Pick at least 2 products for this combo.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedItems.map((item) => {
                const product = availableProducts.find((p) => p.id === item.productId)
                if (!product) return null
                return (
                  <div key={item.productId} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-cream-line)]">
                    <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-[var(--color-beige)]" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[var(--color-bark)] line-clamp-1">{product.name}</p>
                      <p className="text-xs text-[var(--color-bark)]/50">₹{product.price} · {product.netQty}</p>
                    </div>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, e.target.value)}
                      className="w-16 px-2 py-2 rounded-lg border border-[var(--color-cream-line)] text-sm text-center"
                      aria-label={`Quantity for ${product.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-[var(--color-cream-line)] p-5 sm:p-6 space-y-4">
          <h2 className="font-display text-lg text-[var(--color-bark)]">Combo image</h2>
          <p className="text-sm text-[var(--color-bark)]/50">Optional. If skipped, the first product image is used on the shop.</p>

          {(imagePreview || existingImageUrl) && (
            <img
              src={imagePreview || existingImageUrl}
              alt=""
              className="w-32 h-32 rounded-xl object-cover border border-[var(--color-cream-line)]"
            />
          )}

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-cream-line)] text-sm cursor-pointer hover:bg-[var(--color-beige)] transition-colors">
            <Plus size={16} />
            Upload image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setImageFile(file)
                setImagePreview(URL.createObjectURL(file))
              }}
            />
          </label>
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-olive)] text-white text-sm font-medium hover:bg-[var(--color-terracotta)] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader size={16} className="animate-spin" /> : null}
            {isEdit ? 'Update Combo' : 'Create Combo'}
          </button>
          {uploadProgress && <span className="text-sm text-[var(--color-bark)]/50">{uploadProgress}</span>}
        </div>
      </form>
    </>
  )
}
