import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminLayout from '@/components/AdminLayout'
import CategoriesManager from '@/components/CategoriesManager'
import type { Category } from '@hb-tech/shared'

export default async function CategoriesPage() {
  const supabase = createSupabaseServerClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Categories</h1>
        <CategoriesManager categories={(categories as Category[]) ?? []} />
      </div>
    </AdminLayout>
  )
}
