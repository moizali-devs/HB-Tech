import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Product } from '@hb-tech/shared'
import ProductDetail from '@/components/ProductDetail'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

async function getProduct(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('active', true)
    .single()
  return data as Product | null
}

export async function generateMetadata({ params }: Props) {
  const product = await getProduct(params.slug)
  if (!product) return {}
  return {
    title: `${product.name} — HB Tech & Gaming`,
    description: product.description?.slice(0, 155),
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
