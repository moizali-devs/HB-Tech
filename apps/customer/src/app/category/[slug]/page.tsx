import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import type { Product, Category } from '@hb-tech/shared'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

export default async function CategorySlugPage({ params }: Props) {
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!category) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('category_id', (category as Category).id)
    .eq('active', true)
    .order('created_at', { ascending: false })

  const productList = (products as Product[]) ?? []
  const cat = category as Category

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-hb-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <h1 className="section-heading mb-1">{cat.name}</h1>
        <p className="text-slate-500 dark:text-hb-muted text-sm mb-8">
          {productList.length} product{productList.length !== 1 ? 's' : ''}
        </p>

        {productList.length === 0 ? (
          <div className="text-center py-20 rounded-2xl card-surface">
            <p className="text-slate-500 dark:text-hb-muted">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {productList.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
