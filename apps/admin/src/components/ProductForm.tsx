'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Trash2, Upload, X } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import type { Category, Product } from '@hb-tech/shared'

interface Props {
  categories: Category[]
  product?: Product
}

const CONDITIONS = ['new', 'used', 'refurbished', 'open_box'] as const

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    compare_price: product?.compare_price?.toString() ?? '',
    category_id: product?.category_id ?? '',
    condition: product?.condition ?? 'new',
    stock: product?.stock?.toString() ?? '',
    featured: product?.featured ?? false,
    active: product?.active ?? true,
  })
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const addImageUrl = () => {
    const url = urlInput.trim()
    if (url && !images.includes(url)) {
      setImages((prev) => [...prev, url])
      setUrlInput('')
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    const urls: string[] = []

    for (const file of acceptedFiles) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (!error) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
        urls.push(data.publicUrl)
      }
    }

    setImages((prev) => [...prev, ...urls])
    setUploading(false)
  }, [supabase])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  })

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((i) => i !== url))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      price: parseFloat(form.price),
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      category_id: form.category_id || null,
      condition: form.condition,
      stock: parseInt(form.stock, 10),
      featured: form.featured,
      active: form.active,
      images,
    }

    if (product) {
      await supabase.from('products').update(payload).eq('id', product.id)
    } else {
      await supabase.from('products').insert(payload)
    }

    setSaving(false)
    router.push('/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* Basic info */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h2 className="font-semibold">Basic Information</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-accent resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (Rs.) *</label>
            <input
              required
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Compare Price (Rs.)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.compare_price}
              onChange={(e) => setForm({ ...form, compare_price: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock *</label>
            <input
              required
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-accent"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Condition *</label>
            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-accent"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {(['active', 'featured'] as const).map((field) => (
            <label key={field} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.checked })}
                className="w-4 h-4 accent-accent"
              />
              <span className="text-sm font-medium capitalize">{field}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="font-semibold mb-4">Product Images</h2>

        {/* URL input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5">Add Image via URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="px-4 py-2.5 rounded-xl bg-accent text-black text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Add URL
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Paste any image URL from the web — ROG, MSI, or any product page.</p>
        </div>

        <div className="relative flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400 font-medium">OR UPLOAD FILE</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-accent bg-accent/5'
              : 'border-gray-300 dark:border-gray-700 hover:border-accent'
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            {uploading ? 'Uploading...' : 'Drag & drop images or click to browse'}
          </p>
        </div>

        {images.length > 0 && (
          <div className="flex gap-3 mt-4 flex-wrap">
            {images.map((url) => (
              <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                <Image src={url} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-accent text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-600 disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
