'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, ChevronLeft, Package } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import type { Product } from '@hb-tech/shared'

const conditionLabels: Record<string, string> = {
  new: 'New',
  used: 'Used',
  refurbished: 'Refurbished',
  open_box: 'Open Box',
}

export default function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0)
  const addItem = useCartStore((s) => s.addItem)

  const discountPercent =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-hb-muted hover:text-accent mb-8 transition-colors"
      >
        <ChevronLeft size={18} /> Back to Products
      </Link>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-hb-surface2 border border-slate-200 dark:border-hb-border relative">
            {product.images[activeImage] ? (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-hb-muted">
                <Package size={64} strokeWidth={1.5} />
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImage
                      ? 'border-accent ring-2 ring-accent/30'
                      : 'border-transparent hover:border-slate-300 dark:hover:border-hb-muted'
                  }`}
                >
                  <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {product.categories && (
            <Link
              href={`/category/${(product.categories as any).slug}`}
              className="text-sm font-medium text-accent hover:opacity-90"
            >
              {(product.categories as any).name}
            </Link>
          )}

          <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight tracking-tight">
            {product.name}
          </h1>

          <span className="inline-block px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-hb-surface2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-hb-border">
            {conditionLabels[product.condition]}
          </span>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Rs. {product.price.toLocaleString('en-PK')}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <>
                <span className="text-slate-400 dark:text-hb-muted line-through text-lg">
                  Rs. {product.compare_price.toLocaleString('en-PK')}
                </span>
                <span className="bg-accent/10 text-accent border border-accent/20 text-xs font-bold px-2.5 py-1 rounded-full">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          <button
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] ?? null,
                stock: product.stock,
              })
            }
            disabled={product.stock === 0}
            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart size={22} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {product.description && (
            <div className="pt-6 border-t border-slate-200 dark:border-hb-border">
              <h2 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">
                Description
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
