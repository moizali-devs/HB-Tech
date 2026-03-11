'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Edit, Trash2 } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import type { Product } from '@hb-tech/shared'

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter()
  const [list, setList] = useState(products)
  const supabase = createSupabaseBrowserClient()

  const toggleField = async (id: string, field: 'active' | 'featured', value: boolean) => {
    await supabase.from('products').update({ [field]: value }).eq('id', id)
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setList((prev) => prev.filter((p) => p.id !== id))
  }

  if (list.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        No products yet.{' '}
        <Link href="/products/new" className="text-accent hover:underline">
          Add one.
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Product</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Price</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Stock</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Active</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Featured</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {list.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                      {product.images[0] && (
                        <Image src={product.images[0]} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {(product.categories as any)?.name ?? '—'}
                </td>
                <td className="px-4 py-3 font-medium">
                  Rs. {product.price.toLocaleString('en-PK')}
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${product.stock === 0 ? 'text-accent' : product.stock < 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleField(product.id, 'active', !product.active)}
                    className={`w-10 h-6 rounded-full transition-colors ${product.active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${product.active ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleField(product.id, 'featured', !product.featured)}
                    className={`w-10 h-6 rounded-full transition-colors ${product.featured ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${product.featured ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-accent hover:bg-accent/10 transition-colors"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-accent hover:bg-accent/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
