import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Pencil, Trash2, Package, Layers } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../components/AdminLayout'
import ConfirmModal from '../components/ConfirmModal'
import AdminToast from '../components/AdminToast'
import Toggle from '../components/Toggle'

export default function AdminCombos() {
  const navigate = useNavigate()
  const [combos, setCombos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const showToast = (type, message) => setToast({ type, message })

  const fetchCombos = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('combos')
      .select(`
        id, name, tagline, price, is_in_stock, is_featured, sort_order, image_url,
        combo_items ( id, quantity, sort_order, product_id )
      `)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      showToast('error', error.message || 'Failed to load combos')
      setLoading(false)
      return
    }

    setCombos(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchCombos() }, [fetchCombos])

  useEffect(() => {
    const channel = supabase
      .channel('admin-combos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'combos' }, () => {
        fetchCombos()
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [fetchCombos])

  const toggleField = async (id, field, current) => {
    setTogglingId(id + field)
    const { error } = await supabase
      .from('combos')
      .update({ [field]: !current })
      .eq('id', id)
    setTogglingId(null)
    if (error) { showToast('error', 'Failed to update combo'); return }
    setCombos((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: !current } : c)))
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)

    const { error } = await supabase
      .from('combos')
      .delete()
      .eq('id', deleteTarget.id)

    setDeleteLoading(false)
    setDeleteTarget(null)

    if (error) {
      showToast('error', 'Failed to delete combo')
      return
    }

    setCombos((prev) => prev.filter((c) => c.id !== deleteTarget.id))
    showToast('success', `"${deleteTarget.name}" deleted successfully`)
  }

  const visible = combos.filter((combo) => {
    if (!search) return true
    return combo.name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <AdminLayout>
      <AdminToast toast={toast} onClose={() => setToast(null)} />
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete combo?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />

      <div className="p-5 sm:p-7 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-[var(--color-bark)]">Combos</h1>
            <p className="text-sm text-[var(--color-bark)]/50 mt-0.5">{combos.length} combo packs</p>
          </div>
          <button
            onClick={() => navigate('/admin/combos/new')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-olive)] text-white text-sm font-medium hover:bg-[var(--color-terracotta)] transition-colors"
          >
            <Plus size={16} /> Add Combo
          </button>
        </div>

        <div className="relative max-w-sm mb-6">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-bark)]/35" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search combos..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--color-cream-line)] bg-white text-sm focus:outline-none focus:border-[var(--color-terracotta)] transition-colors"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-7 h-7 border-2 border-[var(--color-olive)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Layers size={36} className="text-[var(--color-bark)]/20 mb-3" />
            <p className="font-display text-lg text-[var(--color-bark)]/50">No combos found</p>
            {combos.length === 0 && (
              <button
                onClick={() => navigate('/admin/combos/new')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[var(--color-olive)] text-white text-sm font-medium"
              >
                Create your first combo
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[var(--color-cream-line)] overflow-hidden">
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-cream-line)] bg-[var(--color-ivory-deep)]/60">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide">Combo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide">Items</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide">Price</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide">In Stock</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide">Featured</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-bark)]/50 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-cream-line)]/60">
                  <AnimatePresence>
                    {visible.map((combo) => (
                      <motion.tr
                        key={combo.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-[var(--color-ivory-deep)]/40 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[var(--color-beige)] flex-shrink-0 overflow-hidden">
                              {combo.image_url
                                ? <img src={combo.image_url} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-[var(--color-bark)]/20"><Layers size={16} /></div>}
                            </div>
                            <div>
                              <p className="font-medium text-[var(--color-bark)] line-clamp-1">{combo.name}</p>
                              {combo.tagline && <p className="text-xs text-[var(--color-bark)]/45 line-clamp-1">{combo.tagline}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-bark)]/70">
                          {(combo.combo_items || []).length} product{(combo.combo_items || []).length !== 1 ? 's' : ''}
                        </td>
                        <td className="px-4 py-3 font-display text-[var(--color-olive)]">₹{combo.price}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <Toggle
                              checked={combo.is_in_stock}
                              disabled={togglingId === combo.id + 'is_in_stock'}
                              onChange={() => toggleField(combo.id, 'is_in_stock', combo.is_in_stock)}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            <Toggle
                              checked={combo.is_featured}
                              disabled={togglingId === combo.id + 'is_featured'}
                              onChange={() => toggleField(combo.id, 'is_featured', combo.is_featured)}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/admin/combos/${combo.id}`)}
                              className="p-2 rounded-lg text-[var(--color-bark)]/50 hover:bg-[var(--color-beige)] hover:text-[var(--color-olive)] transition-colors"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(combo)}
                              className="p-2 rounded-lg text-[var(--color-bark)]/50 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
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

            <div className="sm:hidden divide-y divide-[var(--color-cream-line)]/60">
              {visible.map((combo) => (
                <div key={combo.id} className="p-4 flex gap-3 items-start">
                  <div className="w-14 h-14 rounded-xl bg-[var(--color-beige)] flex-shrink-0 overflow-hidden">
                    {combo.image_url
                      ? <img src={combo.image_url} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Package size={18} className="text-[var(--color-bark)]/20" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-bark)] text-sm line-clamp-1 mb-1">{combo.name}</p>
                    <p className="text-xs text-[var(--color-bark)]/50 mb-2">
                      ₹{combo.price} · {(combo.combo_items || []).length} products
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-[var(--color-bark)]/50">Stock</span>
                        <Toggle
                          checked={combo.is_in_stock}
                          disabled={togglingId === combo.id + 'is_in_stock'}
                          onChange={() => toggleField(combo.id, 'is_in_stock', combo.is_in_stock)}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-[var(--color-bark)]/50">Featured</span>
                        <Toggle
                          checked={combo.is_featured}
                          disabled={togglingId === combo.id + 'is_featured'}
                          onChange={() => toggleField(combo.id, 'is_featured', combo.is_featured)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => navigate(`/admin/combos/${combo.id}`)}
                      className="p-2 rounded-lg bg-[var(--color-beige)] text-[var(--color-olive)]"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(combo)}
                      className="p-2 rounded-lg bg-red-50 text-red-500"
                    >
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
