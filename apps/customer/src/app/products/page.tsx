import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'
import type { Product, Category } from '@hb-tech/shared'

export const revalidate = 60

interface PageProps {
  searchParams: { category?: string; condition?: string; min?: string; max?: string; featured?: string; q?: string }
}

async function getProducts(params: PageProps['searchParams']): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, categories(*)')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (params.featured === 'true') query = query.eq('featured', true)
  if (params.condition) query = query.eq('condition', params.condition)
  if (params.min) query = query.gte('price', Number(params.min))
  if (params.max) query = query.lte('price', Number(params.max))
  if (params.q) query = query.ilike('name', `%${params.q}%`)

  if (params.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  const { data } = await query.limit(48)
  return (data as Product[]) ?? []
}

async function getCategories(): Promise<Category[]> {
  const { data } = await supabase.from('categories').select('*').order('name')
  return (data as Category[]) ?? []
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ])

  const title =
    searchParams.featured === 'true'
      ? 'Featured Products'
      : searchParams.q
        ? `Results for "${searchParams.q}"`
        : 'All Products'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-hb-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <h1 className="section-heading mb-2">{title}</h1>

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <aside className="lg:w-64 shrink-0">
            <ProductFilters categories={categories} />
          </aside>

          <div className="flex-1 min-w-0">
            {products.length === 0 ? (
              <div className="text-center py-20 rounded-2xl card-surface">
                <p className="text-slate-500 dark:text-hb-muted text-lg">No products found</p>
                <p className="text-sm text-slate-400 dark:text-hb-muted mt-1">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-500 dark:text-hb-muted mb-4">
                  {products.length} product{products.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
