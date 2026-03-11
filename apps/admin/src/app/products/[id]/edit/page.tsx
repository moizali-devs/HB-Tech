import { createSupabaseServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import ProductForm from '@/components/ProductForm'
import type { Category, Product } from '@hb-tech/shared'

interface Props {
  params: { id: string }
}

export default async function EditProductPage({ params }: Props) {
  const supabase = createSupabaseServerClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!product) notFound()

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <ProductForm
          categories={(categories as Category[]) ?? []}
          product={product as Product}
        />
      </div>
    </AdminLayout>
  )
}
