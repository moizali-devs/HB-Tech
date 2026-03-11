import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminLayout from '@/components/AdminLayout'
import ProductForm from '@/components/ProductForm'
import type { Category } from '@hb-tech/shared'

export default async function NewProductPage() {
  const supabase = createSupabaseServerClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Add Product</h1>
        <ProductForm categories={(categories as Category[]) ?? []} />
      </div>
    </AdminLayout>
  )
}
