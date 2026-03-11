import Link from 'next/link'
import { MessageCircle, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-slate-100 dark:border-hb-border bg-slate-50 dark:bg-hb-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-glow-red-sm">
                <span className="font-heading font-bold text-white text-[13px] leading-none">HB</span>
              </div>
              <span className="font-heading font-semibold text-slate-900 dark:text-white text-base tracking-tight">
                Tech <span className="text-accent">&</span> Gaming
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-zinc-500 leading-relaxed max-w-xs">
              Pakistan&rsquo;s trusted source for computer hardware &amp; gaming peripherals — new, used &amp; refurbished.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <a
                href="https://wa.me/923208378859"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-500 hover:text-accent dark:hover:text-accent transition-colors"
              >
                <MessageCircle size={14} />
                +92 320 8378859
              </a>
              <span className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-500">
                <MapPin size={14} />
                Lahore, Pakistan
              </span>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-[0.15em] mb-4">
              Shop
            </p>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/products?featured=true', label: 'Featured' },
                { href: '/category', label: 'Categories' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support links */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-[0.15em] mb-4">
              Support
            </p>
            <nav className="flex flex-col gap-2.5">
              <a
                href="https://wa.me/923208378859"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                WhatsApp
              </a>
              <Link href="/" className="text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                Home
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-hb-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 dark:text-zinc-600">
            © {year} HB Tech &amp; Gaming. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-zinc-600">
            Lahore, Pakistan
          </p>
        </div>
      </div>
    </footer>
  )
}
