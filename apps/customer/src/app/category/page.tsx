import { supabase } from '@/lib/supabase'
import CategoryGrid from '@/components/CategoryGrid'
import type { Category } from '@hb-tech/shared'

export const revalidate = 60

export default async function CategoryPage() {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('name')
  const categories = (data as Category[]) ?? []

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-hb-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <h1 className="section-heading mb-8">All Categories</h1>
        {categories.length === 0 ? (
          <div className="rounded-2xl card-surface p-12 text-center">
            <p className="text-slate-500 dark:text-hb-muted">No categories yet.</p>
          </div>
        ) : (
          <CategoryGrid categories={categories} />
        )}
      </div>
    </div>
  )
}
