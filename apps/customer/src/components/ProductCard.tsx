// ProductCard -- used in every product grid throughout the storefront.
// The entire card is wrapped in a Link so the full area is clickable,
// but the Quick Add button stops propagation so it doesn't navigate.

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Package, Plus } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import type { Product } from '@hb-tech/shared'

// Badge label and Tailwind color classes for each condition type.
const conditionLabels: Record<string, { label: string; color: string }> = {
  new: {
    label: 'New',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  },
  used: {
    label: 'Used',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  },
  refurbished: {
    label: 'Refurb',
    color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20',
  },
  open_box: {
    label: 'Open Box',
    color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20',
  },
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const badge = conditionLabels[product.condition]

  const handleAddToCart = (e: React.MouseEvent) => {
    // Prevent the Link from firing so clicking Quick Add doesn't open the detail page.
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? null,
      stock: product.stock,
    })
  }

  const discountPercent =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : 0

  return (
    <Link href={`/products/${product.slug}`}>
      <article className="group h-full flex flex-col bg-white dark:bg-hb-surface border border-slate-100 dark:border-hb-border rounded-2xl overflow-hidden hover:border-slate-200 dark:hover:border-hb-border2 hover:shadow-card-md transition-all duration-300">

        {/* Image container */}
        <div className="relative aspect-square bg-slate-50 dark:bg-hb-surface2 overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-2 group-hover:scale-[1.04] transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-200 dark:text-zinc-700">
              <Package size={36} strokeWidth={1.5} />
            </div>
          )}

          {/* Discount badge -- top-left, shown only when compare_price > price */}
          {discountPercent > 0 && (
            <div className="absolute top-2.5 left-2.5">
              <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-glow-red-sm">
                -{discountPercent}%
              </span>
            </div>
          )}

          {/* Condition badge -- top-right */}
          {badge && (
            <div className={`absolute top-2.5 right-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </div>
          )}

          {/* Out of stock overlay -- covers the whole image area */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/80 dark:bg-hb-bg/80 flex items-center justify-center backdrop-blur-sm">
              <span className="text-slate-600 dark:text-zinc-400 font-semibold text-[11px] px-3 py-1.5 rounded-full border border-slate-200 dark:border-hb-border bg-white dark:bg-hb-surface">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick Add button -- hidden offscreen below, slides up on card hover */}
          {product.stock > 0 && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <button
                onClick={handleAddToCart}
                className="w-full py-2.5 bg-accent hover:bg-accent-dark text-black text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus size={13} strokeWidth={2.5} />
                Add to Cart
              </button>
            </div>
          )}
        </div>

        {/* Text info */}
        <div className="p-3.5 flex flex-col gap-2 flex-1">
          <h3 className="text-[13px] font-semibold text-slate-800 dark:text-zinc-100 line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-base font-heading font-bold text-slate-900 dark:text-white">
              Rs.&nbsp;{product.price.toLocaleString('en-PK')}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-slate-400 dark:text-zinc-600 line-through text-xs">
                Rs.&nbsp;{product.compare_price.toLocaleString('en-PK')}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
