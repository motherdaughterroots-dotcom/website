import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import ProductForm from '../components/ProductForm'

export default function AdminProductEdit() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isNew    = id === 'new'

  return (
    <AdminLayout>
      <div className="border-b border-[var(--color-cream-line)] bg-white px-5 sm:px-7 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/admin/products')}
          className="p-2 rounded-xl hover:bg-[var(--color-beige)] text-[var(--color-bark)]/60 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl text-[var(--color-bark)]">
            {isNew ? 'Add New Product' : 'Edit Product'}
          </h1>
          <p className="text-xs text-[var(--color-bark)]/45 mt-0.5">
            {isNew ? 'Fill in the details below' : 'Update product information'}
          </p>
        </div>
      </div>

      <ProductForm productId={isNew ? null : id} />
    </AdminLayout>
  )
}