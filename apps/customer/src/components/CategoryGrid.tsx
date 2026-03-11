import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@hb-tech/shared'

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className="group flex flex-col items-center gap-3 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-hb-surface border border-slate-100 dark:border-hb-border hover:border-accent/30 dark:hover:border-accent/25 hover:bg-white dark:hover:bg-hb-surface2 hover:shadow-card transition-all duration-300"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white dark:bg-hb-surface2 flex items-center justify-center shrink-0 border border-slate-100 dark:border-hb-border group-hover:border-accent/25 transition-all duration-300">
            {cat.image_url ? (
              <Image
                src={cat.image_url}
                alt={cat.name}
                width={56}
                height={56}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <span className="text-lg font-heading font-bold text-slate-300 dark:text-zinc-600 group-hover:text-accent dark:group-hover:text-accent transition-colors duration-300">
                {cat.name.charAt(0)}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-center text-slate-600 dark:text-zinc-400 group-hover:text-accent dark:group-hover:text-accent transition-colors duration-200 line-clamp-2 leading-snug">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  )
}
