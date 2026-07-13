import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, GripVertical, Upload, X, Video,
  Image as ImageIcon, ChevronUp, ChevronDown, Loader
} from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { supabase } from '../../lib/supabase'
import { PRODUCT_CATEGORIES } from '../constants/productCategories'
import Toggle from './Toggle'
import AdminToast from './AdminToast'

const EMPTY_FORM = {
  name: '', category: 'soaps', tagline: '', price: '',
  net_qty: '', description: '', how_to_use: '', suitable_for: '',
  discount_percent: 0, sort_order: 0,
  is_in_stock: true, is_featured: false,
}

// ── Upload a single file to Supabase Storage ─────────────────────────────────
async function uploadFile(bucket, path, file) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true, contentType: file.type,
  })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
  return publicUrl
}

async function requireSuccess(request) {
  const { data, error } = await request
  if (error) throw error
  return data
}

async function rollbackNewProduct(productId, uploadedFiles) {
  const cleanup = [
    ...uploadedFiles.map(({ bucket, path }) => requireSuccess(supabase.storage.from(bucket).remove([path]))),
    requireSuccess(supabase.from('product_media').delete().eq('product_id', productId)),
    requireSuccess(supabase.from('product_benefits').delete().eq('product_id', productId)),
    requireSuccess(supabase.from('product_ingredients').delete().eq('product_id', productId)),
  ]

  const results = await Promise.allSettled(cleanup)
  const { error: productDeleteError } = await supabase.from('products').delete().eq('id', productId)

  if (results.some(result => result.status === 'rejected') || productDeleteError) {
    console.error('Could not fully roll back failed product creation', productDeleteError)
  }
}

// ── Compress image before upload ─────────────────────────────────────────────
async function compressImage(file) {
  try {
    return await imageCompression(file, {
      maxSizeMB: 0.8, maxWidthOrHeight: 1200, useWebWorker: true,
      fileType: 'image/webp',
    })
  } catch {
    return file // fallback to original if compression fails
  }
}

export default function ProductForm({ productId = null }) {
  const navigate  = useNavigate()
  const isEdit    = !!productId
  const fileRef   = useRef(null)
  const videoRef  = useRef(null)

  const [form, setForm]               = useState(EMPTY_FORM)
  const [benefits, setBenefits]       = useState([''])
  const [keyIngredients, setKeyIngredients] = useState([''])
  const [baseOils, setBaseOils]       = useState([''])

  // Existing media from DB
  const [existingImages, setExistingImages] = useState([])
  const [existingVideo, setExistingVideo]   = useState(null)

  // New files selected by user (not yet uploaded)
  const [newImageFiles, setNewImageFiles]   = useState([])   // { file, preview }
  const [newVideoFile, setNewVideoFile]     = useState(null)  // { file, preview }

  // Media to delete on save
  const [imagesToDelete, setImagesToDelete] = useState([]) // existing media IDs

  const [loading,       setLoading]       = useState(isEdit)
  const [saving,        setSaving]        = useState(false)
  const [uploadProgress,setUploadProgress]= useState('')
  const [toast,         setToast]         = useState(null)

  const showToast = (type, message) => setToast({ type, message })
  const dismissToast = useCallback(() => setToast(null), [])
  const setInStock = useCallback((value) => {
    setForm(current => ({ ...current, is_in_stock: Boolean(value) }))
  }, [])
  const setFeatured = useCallback((value) => {
    setForm(current => ({ ...current, is_featured: Boolean(value) }))
  }, [])

  // ── Load existing product data ──────────────────────────────────────────
  useEffect(() => {
    if (!isEdit) return
    async function load() {
      setLoading(true)
      try {
        const product = await requireSuccess(supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single())

        setForm({
          name: product.name || '',
          category: product.category || 'soaps',
          tagline: product.tagline || '',
          price: product.price || '',
          net_qty: product.net_qty || '',
          description: product.description || '',
          how_to_use: product.how_to_use || '',
          suitable_for: product.suitable_for || '',
          discount_percent: product.discount_percent || 0,
          sort_order: product.sort_order || 0,
          is_in_stock: product.is_in_stock ?? true,
          is_featured: product.is_featured ?? false,
        })

        const ben = await requireSuccess(supabase
          .from('product_benefits')
          .select('*').eq('product_id', productId).order('sort_order'))
        setBenefits(ben?.length ? ben.map(b => b.benefit) : [''])

        const ing = await requireSuccess(supabase
          .from('product_ingredients')
          .select('*').eq('product_id', productId).order('sort_order'))
        const keys = ing?.filter(i => i.type === 'key').map(i => i.name) || ['']
        const oils = ing?.filter(i => i.type === 'base_oil').map(i => i.name) || ['']
        setKeyIngredients(keys.length ? keys : [''])
        setBaseOils(oils.length ? oils : [''])

        const media = await requireSuccess(supabase
          .from('product_media')
          .select('*').eq('product_id', productId).order('sort_order'))
        setExistingImages(media?.filter(m => m.type === 'image') || [])
        setExistingVideo(media?.find(m => m.type === 'video') || null)
      } catch (err) {
        showToast('error', err.message || 'Failed to load product details')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [productId, isEdit])

  // ── Dynamic list helpers ────────────────────────────────────────────────
  const listUpdater = (setter) => ({
    update: (i, val) => setter(prev => prev.map((v, idx) => idx === i ? val : v)),
    add:    ()       => setter(prev => [...prev, '']),
    remove: (i)      => setter(prev => prev.length === 1 ? [''] : prev.filter((_, idx) => idx !== i)),
  })

  const ben = listUpdater(setBenefits)
  const key = listUpdater(setKeyIngredients)
  const oil = listUpdater(setBaseOils)

  // ── Image file selection ────────────────────────────────────────────────
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || [])
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).slice(2),
    }))
    setNewImageFiles(prev => [...prev, ...previews])
    e.target.value = ''
  }

  const removeNewImage = (id) => {
    setNewImageFiles(prev => {
      const item = prev.find(i => i.id === id)
      if (item) URL.revokeObjectURL(item.preview)
      return prev.filter(i => i.id !== id)
    })
  }

  const removeExistingImage = (mediaId) => {
    setImagesToDelete(prev => [...prev, mediaId])
    setExistingImages(prev => prev.filter(i => i.id !== mediaId))
  }

  const moveNewImage = (idx, dir) => {
    setNewImageFiles(prev => {
      const arr = [...prev]
      const target = idx + dir
      if (target < 0 || target >= arr.length) return arr
      ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
      return arr
    })
  }

  // ── Video file selection ────────────────────────────────────────────────
  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setNewVideoFile({ file, preview: URL.createObjectURL(file) })
    e.target.value = ''
  }

  const removeNewVideo = () => {
    if (newVideoFile) URL.revokeObjectURL(newVideoFile.preview)
    setNewVideoFile(null)
  }

  const removeExistingVideo = () => setExistingVideo(null)

  const handleFormKeyDown = (event) => {
    if (event.key === 'Enter' && ['INPUT', 'SELECT'].includes(event.target.tagName)) {
      event.preventDefault()
    }
  }

  // ── Save ────────────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { showToast('error', 'Product name is required'); return }
    if (!form.price || Number(form.price) <= 0) { showToast('error', 'Price must be greater than 0'); return }

    setSaving(true)
    let createdProductId = null
    const uploadedFiles = []

    try {
      // 1. Save / update main product row
      setUploadProgress('Saving product info...')
      const productData = {
        ...form,
        price: Number(form.price),
        discount_percent: Number(form.discount_percent) || 0,
        sort_order: Number(form.sort_order) || 0,
      }

      let pid = productId
      if (isEdit) {
        await requireSuccess(supabase.from('products').update(productData).eq('id', pid))
      } else {
        const data = await requireSuccess(supabase.from('products').insert(productData).select('id').single())
        pid = data.id
        createdProductId = pid
      }

      // 2. Replace benefits
      setUploadProgress('Saving benefits...')
      await requireSuccess(supabase.from('product_benefits').delete().eq('product_id', pid))
      const validBenefits = benefits.filter(b => b.trim())
      if (validBenefits.length) {
        await requireSuccess(supabase.from('product_benefits').insert(
          validBenefits.map((benefit, i) => ({ product_id: pid, benefit, sort_order: i }))
        ))
      }

      // 3. Replace ingredients
      setUploadProgress('Saving ingredients...')
      await requireSuccess(supabase.from('product_ingredients').delete().eq('product_id', pid))
      const ingredientRows = [
        ...keyIngredients.filter(k => k.trim()).map((name, i) => ({ product_id: pid, name, type: 'key', sort_order: i })),
        ...baseOils.filter(o => o.trim()).map((name, i) => ({ product_id: pid, name, type: 'base_oil', sort_order: i })),
      ]
      if (ingredientRows.length) await requireSuccess(supabase.from('product_ingredients').insert(ingredientRows))

      // 4. Delete marked images from storage + DB
      if (imagesToDelete.length) {
        setUploadProgress('Removing old images...')
        for (const mediaId of imagesToDelete) {
          const rec = await requireSuccess(supabase.from('product_media').select('url').eq('id', mediaId).single())
          if (rec?.url?.includes('product-images')) {
            const path = rec.url.split('/product-images/')[1]
            if (path) await requireSuccess(supabase.storage.from('product-images').remove([path]))
          }
          await requireSuccess(supabase.from('product_media').delete().eq('id', mediaId))
        }
      }

      // 5. Upload new images
      if (newImageFiles.length) {
        setUploadProgress(`Uploading images...`)
        // Get current max sort_order of remaining images
        const remainingMedia = await requireSuccess(supabase
          .from('product_media')
          .select('sort_order')
          .eq('product_id', pid)
          .eq('type', 'image')
          .order('sort_order', { ascending: false })
          .limit(1))
        let startOrder = (remainingMedia?.[0]?.sort_order ?? -1) + 1

        for (let i = 0; i < newImageFiles.length; i++) {
          setUploadProgress(`Uploading image ${i + 1} of ${newImageFiles.length}...`)
          const { file } = newImageFiles[i]
          const compressed = await compressImage(file)
          const ext = 'webp'
          const path = `${pid}/${Date.now()}-${i}.${ext}`
          const url = await uploadFile('product-images', path, compressed)
          uploadedFiles.push({ bucket: 'product-images', path })
          await requireSuccess(supabase.from('product_media').insert({
            product_id: pid, url, type: 'image', sort_order: startOrder + i,
          }))
        }
      }

      // 6. Handle video
      if (newVideoFile) {
        setUploadProgress('Uploading video...')
        // Delete existing video from storage if any
        if (existingVideo) {
          const path = existingVideo.url.split('/product-videos/')[1]
          if (path) await requireSuccess(supabase.storage.from('product-videos').remove([path]))
          await requireSuccess(supabase.from('product_media').delete().eq('id', existingVideo.id))
        }
        const ext = newVideoFile.file.name.split('.').pop() || 'mp4'
        const path = `${pid}/${Date.now()}.${ext}`
        const url = await uploadFile('product-videos', path, newVideoFile.file)
        uploadedFiles.push({ bucket: 'product-videos', path })
        await requireSuccess(supabase.from('product_media').insert({
          product_id: pid, url, type: 'video', sort_order: 0,
        }))
      } else if (existingVideo === null && isEdit) {
        // User removed existing video without adding new one
        const oldVid = await requireSuccess(supabase
          .from('product_media').select('*').eq('product_id', pid).eq('type', 'video').maybeSingle())
        if (oldVid) {
          const path = oldVid.url.split('/product-videos/')[1]
          if (path) await requireSuccess(supabase.storage.from('product-videos').remove([path]))
          await requireSuccess(supabase.from('product_media').delete().eq('id', oldVid.id))
        }
      }

      setUploadProgress('')
      showToast('success', isEdit ? 'Product updated!' : 'Product added!')
      setTimeout(() => navigate('/admin/products'), 900)

    } catch (err) {
      console.error(err)
      if (createdProductId) await rollbackNewProduct(createdProductId, uploadedFiles)
      showToast('error', err.message || 'Something went wrong. Please try again.')
      setUploadProgress('')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-7 h-7 border-2 border-[var(--color-olive)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-5 sm:p-7">
      <AdminToast toast={toast} onClose={dismissToast} />

      <form onSubmit={handleSave} onKeyDown={handleFormKeyDown} className="space-y-8">

        {/* ── SECTION 1: Basic Info ── */}
        <FormSection title="Basic Information">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product Name *" className="sm:col-span-2">
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Ubtan Glow Bathing Bar"
                className={inputCls} />
            </Field>
            <Field label="Category *">
              <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className={inputCls}>
                {PRODUCT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Tagline">
              <input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                placeholder="e.g. Natural glow & tan care."
                className={inputCls} />
            </Field>
            <Field label="Price (₹) *">
              <input required type="number" min="1" value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="999" className={inputCls} />
            </Field>
            <Field label="Net Quantity">
              <input value={form.net_qty} onChange={e => setForm(f => ({ ...f, net_qty: e.target.value }))}
                placeholder="e.g. 100 gm" className={inputCls} />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <textarea rows={4} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe the product..."
                className={`${inputCls} resize-none`} />
            </Field>
          </div>
        </FormSection>

        {/* ── SECTION 2: Details ── */}
        <FormSection title="Details">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="How to Use" className="sm:col-span-2">
              <textarea rows={3} value={form.how_to_use}
                onChange={e => setForm(f => ({ ...f, how_to_use: e.target.value }))}
                placeholder="Step-by-step usage instructions..."
                className={`${inputCls} resize-none`} />
            </Field>
            <Field label="Suitable For">
              <input value={form.suitable_for}
                onChange={e => setForm(f => ({ ...f, suitable_for: e.target.value }))}
                placeholder="e.g. All Skin Types | Men & Women"
                className={inputCls} />
            </Field>
            <Field label="Discount %">
              <input type="number" min="0" max="100" value={form.discount_percent}
                onChange={e => setForm(f => ({ ...f, discount_percent: e.target.value }))}
                placeholder="0" className={inputCls} />
            </Field>
            <Field label="Sort Order">
              <input type="number" min="0" value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))}
                placeholder="0" className={inputCls} />
            </Field>
          </div>
        </FormSection>

        {/* ── SECTION 3: Toggles ── */}
        <FormSection title="Availability">
          <div className="flex flex-wrap gap-6">
            <Toggle checked={form.is_in_stock}
              onChange={setInStock}
              label="In Stock" />
            <Toggle checked={form.is_featured}
              onChange={setFeatured}
              label="Featured / Best Seller" />
          </div>
        </FormSection>

        {/* ── SECTION 4: Benefits ── */}
        <FormSection title="Key Benefits">
          <div className="space-y-2.5">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex gap-2">
                <input value={benefit} onChange={e => ben.update(i, e.target.value)}
                  placeholder={`Benefit ${i + 1}`} className={`${inputCls} flex-1`} />
                <button type="button" onClick={() => ben.remove(i)}
                  className="p-2.5 rounded-xl border border-[var(--color-cream-line)] text-[var(--color-bark)]/40 hover:text-red-500 hover:border-red-200 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button type="button" onClick={ben.add}
              className="flex items-center gap-2 text-sm text-[var(--color-olive)] hover:text-[var(--color-terracotta)] transition-colors font-medium">
              <Plus size={15} /> Add benefit
            </button>
          </div>
        </FormSection>

        {/* ── SECTION 5: Ingredients ── */}
        <FormSection title="Ingredients">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide mb-2.5">Key Ingredients</p>
              <div className="space-y-2.5">
                {keyIngredients.map((ing, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={ing} onChange={e => key.update(i, e.target.value)}
                      placeholder={`e.g. Turmeric`} className={`${inputCls} flex-1`} />
                    <button type="button" onClick={() => key.remove(i)}
                      className="p-2.5 rounded-xl border border-[var(--color-cream-line)] text-[var(--color-bark)]/40 hover:text-red-500 hover:border-red-200 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={key.add}
                  className="flex items-center gap-2 text-sm text-[var(--color-olive)] hover:text-[var(--color-terracotta)] transition-colors font-medium">
                  <Plus size={15} /> Add ingredient
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide mb-2.5">Base Oils</p>
              <div className="space-y-2.5">
                {baseOils.map((oil_name, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={oil_name} onChange={e => oil.update(i, e.target.value)}
                      placeholder={`e.g. Coconut Oil`} className={`${inputCls} flex-1`} />
                    <button type="button" onClick={() => oil.remove(i)}
                      className="p-2.5 rounded-xl border border-[var(--color-cream-line)] text-[var(--color-bark)]/40 hover:text-red-500 hover:border-red-200 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={oil.add}
                  className="flex items-center gap-2 text-sm text-[var(--color-olive)] hover:text-[var(--color-terracotta)] transition-colors font-medium">
                  <Plus size={15} /> Add base oil
                </button>
              </div>
            </div>
          </div>
        </FormSection>

        {/* ── SECTION 6: Media ── */}
        <FormSection title="Images & Video">
          {/* Images */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-[var(--color-bark)]/70">
                Product Images <span className="text-xs text-[var(--color-bark)]/40">(first = main image)</span>
              </p>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 text-sm text-[var(--color-olive)] font-medium hover:text-[var(--color-terracotta)] transition-colors">
                <Upload size={14} /> Upload Images
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={handleImageSelect} />
            </div>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {existingImages.map((img, i) => (
                  <div key={img.id} className="relative group">
                    <img src={img.url} alt=""
                      className="w-20 h-20 rounded-xl object-cover border border-[var(--color-cream-line)]" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-[var(--color-olive)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        MAIN
                      </span>
                    )}
                    <button type="button" onClick={() => removeExistingImage(img.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New image previews */}
            {newImageFiles.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {newImageFiles.map((item, i) => (
                  <div key={item.id} className="relative group">
                    <img src={item.preview} alt=""
                      className="w-20 h-20 rounded-xl object-cover border-2 border-dashed border-[var(--color-olive)]/40" />
                    {existingImages.length === 0 && i === 0 && (
                      <span className="absolute top-1 left-1 bg-[var(--color-terracotta)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        MAIN
                      </span>
                    )}
                    <div className="absolute -top-1.5 -right-1.5 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {i > 0 && (
                        <button type="button" onClick={() => moveNewImage(i, -1)}
                          className="w-5 h-5 bg-[var(--color-olive)] text-white rounded-full flex items-center justify-center">
                          <ChevronUp size={9} />
                        </button>
                      )}
                      {i < newImageFiles.length - 1 && (
                        <button type="button" onClick={() => moveNewImage(i, 1)}
                          className="w-5 h-5 bg-[var(--color-olive)] text-white rounded-full flex items-center justify-center">
                          <ChevronDown size={9} />
                        </button>
                      )}
                      <button type="button" onClick={() => removeNewImage(item.id)}
                        className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                        <X size={9} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {existingImages.length === 0 && newImageFiles.length === 0 && (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-full h-28 border-2 border-dashed border-[var(--color-cream-line)] rounded-2xl flex flex-col items-center justify-center gap-2 text-[var(--color-bark)]/40 hover:border-[var(--color-olive)]/40 hover:text-[var(--color-olive)] transition-colors">
                <ImageIcon size={24} />
                <span className="text-sm">Tap to upload images</span>
              </button>
            )}
          </div>

          {/* Video */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-[var(--color-bark)]/70">Product Video <span className="text-xs text-[var(--color-bark)]/40">(optional)</span></p>
              {!newVideoFile && (
                <button type="button" onClick={() => videoRef.current?.click()}
                  className="flex items-center gap-1.5 text-sm text-[var(--color-olive)] font-medium hover:text-[var(--color-terracotta)] transition-colors">
                  <Upload size={14} /> Upload Video
                </button>
              )}
              <input ref={videoRef} type="file" accept="video/*" className="hidden"
                onChange={handleVideoSelect} />
            </div>

            {existingVideo && !newVideoFile && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-beige)]/50 border border-[var(--color-cream-line)]">
                <Video size={20} className="text-[var(--color-olive)] flex-shrink-0" />
                <p className="text-sm text-[var(--color-bark)]/70 flex-1 truncate">Current video</p>
                <button type="button" onClick={removeExistingVideo}
                  className="text-red-400 hover:text-red-600 transition-colors">
                  <X size={16} />
                </button>
              </div>
            )}

            {newVideoFile && (
              <div className="relative rounded-xl overflow-hidden border border-[var(--color-cream-line)]">
                <video src={newVideoFile.preview} controls className="w-full max-h-48 object-cover" />
                <button type="button" onClick={removeNewVideo}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <X size={14} />
                </button>
              </div>
            )}

            {!existingVideo && !newVideoFile && (
              <button type="button" onClick={() => videoRef.current?.click()}
                className="w-full h-20 border-2 border-dashed border-[var(--color-cream-line)] rounded-2xl flex items-center justify-center gap-2 text-[var(--color-bark)]/40 hover:border-[var(--color-olive)]/40 hover:text-[var(--color-olive)] transition-colors">
                <Video size={20} />
                <span className="text-sm">Tap to upload a video</span>
              </button>
            )}
          </div>
        </FormSection>

        {/* ── Submit ── */}
        <div className="flex items-center gap-3 pt-2 pb-8">
          <button type="button" onClick={() => navigate('/admin/products')}
            disabled={saving}
            className="px-6 py-3 rounded-xl border border-[var(--color-cream-line)] text-sm font-medium text-[var(--color-bark)]/70 hover:bg-[var(--color-beige)] transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-[var(--color-olive)] text-white text-sm font-medium hover:bg-[var(--color-terracotta)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {saving
              ? <><Loader size={15} className="animate-spin" /> {uploadProgress || 'Saving...'}</>
              : isEdit ? 'Update Product' : 'Add Product'
            }
          </button>
        </div>
      </form>
    </div>
  )
}

// ── Small helper components ───────────────────────────────────────────────────
function FormSection({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-lg text-[var(--color-bark)] mb-4 pb-2 border-b border-[var(--color-cream-line)]">
        {title}
      </h2>
      {children}
    </div>
  )
}

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-[var(--color-bark)]/55 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-cream-line)] bg-white text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors placeholder:text-[var(--color-bark)]/30"
