// ProductFilters -- client component that drives the /products page via URL search params.
// Every filter change pushes a new URL so the server re-fetches with the new params.
// This means filters are shareable, bookmarkable, and work without any client state.

'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import type { Category } from '@hb-tech/shared'
import { Search, X } from 'lucide-react'

const CONDITIONS = [
  { value: '', label: 'All Conditions' },
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
  { value: 'refurbished', label: 'Refurbished' },
  { value: 'open_box', label: 'Open Box' },
]

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Merge a single key/value pair into the current search params and navigate.
  // Passing an empty string removes the param so the URL stays clean.
  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  // Show the clear button only when at least one filter is active.
  const filterKeys = ['category', 'condition', 'min', 'max', 'q']
  const hasFilters = filterKeys.some((k) => searchParams.get(k) != null)

  return (
    <div className="space-y-6 p-4 rounded-2xl card-surface">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-900 dark:text-white">Filters</span>
        {hasFilters && (
          <button
            onClick={() => router.push(pathname)}
            className="text-xs font-medium text-accent hover:opacity-90 flex items-center gap-1"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Search -- triggers on Enter to avoid a request on every keystroke */}
      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-hb-muted uppercase tracking-wider mb-2 block">
          Search
        </label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            defaultValue={searchParams.get('q') ?? ''}
            placeholder="Search products..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateParam('q', (e.target as HTMLInputElement).value)
              }
            }}
            className="input-field pl-9"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-hb-muted uppercase tracking-wider mb-2 block">
          Category
        </label>
        <select
          value={searchParams.get('category') ?? ''}
          onChange={(e) => updateParam('category', e.target.value)}
          className="input-field"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-hb-muted uppercase tracking-wider mb-2 block">
          Condition
        </label>
        <div className="space-y-2">
          {CONDITIONS.map((c) => (
            <label key={c.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="condition"
                value={c.value}
                checked={(searchParams.get('condition') ?? '') === c.value}
                onChange={(e) => updateParam('condition', e.target.value)}
                className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-hb-border accent-blue-600 focus:ring-accent/30"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {c.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range -- triggers on blur (when the user leaves the input) to avoid
          refetching on every digit typed */}
      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-hb-muted uppercase tracking-wider mb-2 block">
          Price (Rs.)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get('min') ?? ''}
            onBlur={(e) => updateParam('min', e.target.value)}
            className="input-field"
          />
          <span className="text-slate-400">to</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get('max') ?? ''}
            onBlur={(e) => updateParam('max', e.target.value)}
            className="input-field"
          />
        </div>
      </div>
    </div>
  )
}
