import { supabase } from '@/lib/supabase'
import HeroCarousel from '@/components/HeroCarousel'
import ProductCard from '@/components/ProductCard'
import CategoryGrid from '@/components/CategoryGrid'
import type { Product, Category } from '@hb-tech/shared'
import Link from 'next/link'
import { ArrowRight, MessageSquare } from 'lucide-react'

export const revalidate = 60

async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('featured', true)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return (data as Product[]) ?? []
}

async function getCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('name')
  return (data as Category[]) ?? []
}

async function getNewArrivals(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return (data as Product[]) ?? []
}

export default async function HomePage() {
  const [featuredProducts, categories, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getNewArrivals(),
  ])

  return (
    <div className="min-h-screen bg-white dark:bg-hb-bg">
      <HeroCarousel products={featuredProducts} />

      {/* ── Categories ─────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="section-label mb-2">Explore</p>
              <h2 className="section-heading">Shop by Category</h2>
            </div>
            <Link href="/category" className="link-accent text-sm flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <CategoryGrid categories={categories} />
        </section>
      )}

      {/* ── Featured Products ──────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="border-t border-slate-100 dark:border-hb-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label mb-2">Hand-picked</p>
                <h2 className="section-heading">Featured Products</h2>
              </div>
              <Link href="/products?featured=true" className="link-accent text-sm flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Promo Banner ───────────────────────────────────── */}
      <section className="border-t border-slate-100 dark:border-hb-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 dark:bg-hb-surface border border-slate-800 dark:border-hb-border2 px-8 sm:px-12 py-12 sm:py-16 text-center">
            {/* Background glow */}
            <div className="absolute inset-0 hero-glow pointer-events-none" />
            <div className="dot-grid absolute inset-0 pointer-events-none" />

            <div className="relative">
              <p className="section-label mb-4 text-accent">Get in touch</p>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-4 tracking-tight">
                Need help choosing the right gear?
              </h2>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                Our team is available on WhatsApp for personalized recommendations, price inquiries, and bulk orders.
              </p>
              <a
                href="https://wa.me/923208378859"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm sm:text-base px-8 py-3"
              >
                <MessageSquare size={16} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ───────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="border-t border-slate-100 dark:border-hb-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label mb-2">Just in</p>
                <h2 className="section-heading">New Arrivals</h2>
              </div>
              <Link href="/products" className="link-accent text-sm flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
