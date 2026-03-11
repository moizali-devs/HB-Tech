'use client'

import Link from 'next/link'
import { ShoppingCart, Sun, Moon, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { useThemeStore } from '@/store/theme'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())
  const openCart = useCartStore((s) => s.openCart)
  const { isDark, toggle } = useThemeStore()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/category', label: 'Categories' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 dark:border-hb-border bg-white/80 dark:bg-hb-bg/90 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[62px] flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-glow-red-sm group-hover:shadow-glow-red transition-all duration-300">
            <span className="font-heading font-bold text-white text-[13px] leading-none tracking-tight">HB</span>
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-heading font-semibold text-slate-900 dark:text-white text-[15px] tracking-tight">
              Tech <span className="text-accent">&</span> Gaming
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            onClick={openCart}
            className="relative p-2.5 rounded-xl text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            aria-label="Open cart"
          >
            <ShoppingCart size={19} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1 shadow-glow-red-sm">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2.5 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden overflow-hidden border-t border-slate-100 dark:border-hb-border bg-white/95 dark:bg-hb-surface/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col px-4 py-3 gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 px-3 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
