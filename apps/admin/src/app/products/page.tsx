import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Product } from '@hb-tech/shared'
import ProductsTable from '@/components/ProductsTable'

export default async function AdminProductsPage() {
  const supabase = createSupabaseServerClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <Link
            href="/products/new"
            className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
        <ProductsTable products={(products as Product[]) ?? []} />
      </div>
    </AdminLayout>
  )
}
