'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, total } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-hb-bg/70 backdrop-blur-sm z-50"
          />

          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.35 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-hb-surface border-l border-slate-200 dark:border-hb-border z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-hb-border">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                Shopping Cart
              </h2>
              <button
                onClick={closeCart}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-hb-surface2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[280px] gap-4 text-slate-400 dark:text-hb-muted">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-hb-surface2 flex items-center justify-center">
                    <ShoppingBag size={28} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-medium">Your cart is empty</p>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="link-accent text-sm"
                  >
                    Browse products
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-hb-surface2/80 border border-slate-100 dark:border-hb-border"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 dark:bg-hb-bg shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-hb-muted text-xs">
                          —
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-accent font-semibold text-sm mt-0.5">
                        Rs. {(item.price * item.quantity).toLocaleString('en-PK')}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg border border-slate-200 dark:border-hb-border flex items-center justify-center text-sm text-slate-600 dark:text-slate-400 hover:border-accent hover:text-accent transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm w-6 text-center font-medium text-slate-700 dark:text-slate-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, item.stock))}
                          className="w-7 h-7 rounded-lg border border-slate-200 dark:border-hb-border flex items-center justify-center text-sm text-slate-600 dark:text-slate-400 hover:border-accent hover:text-accent transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-400 dark:hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-200 dark:border-hb-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-hb-muted">Subtotal</span>
                  <span className="font-bold text-lg text-slate-900 dark:text-white">
                    Rs. {total().toLocaleString('en-PK')}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full btn-primary py-3.5 text-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
