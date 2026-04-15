'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight, CreditCard, MessageCircle, ShieldCheck } from 'lucide-react'
import type { Product } from '@hb-tech/shared'
import { LampContainer } from '@/components/ui/lamp'

const TRUST_BADGES = [
  { icon: CreditCard, label: 'Cash on Delivery' },
  { icon: MessageCircle, label: 'WhatsApp Support' },
  { icon: ShieldCheck, label: 'Warranty Available' },
]

export default function HeroCarousel({ products }: { products: Product[] }) {
  const [current, setCurrent] = useState(0)
  const slides = products.length > 0 ? products : null

  useEffect(() => {
    if (!slides || slides.length <= 1) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000)
    return () => clearInterval(timer)
  }, [slides])

  return (
    <section className="border-b border-slate-200 dark:border-hb-border">
      {!slides ? (
        /* ── Static hero with lamp effect ─────────────────── */
        <LampContainer className="min-h-[540px] sm:min-h-[580px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center text-center w-full max-w-3xl mx-auto"
          >
            {/* Trust badges — above the headline, lit by the lamp */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 mb-10 flex-wrap">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={13} className="text-cyan-400" />
                  <span className="text-[11px] font-medium text-zinc-400 tracking-wide">{label}</span>
                </div>
              ))}
            </div>

            {/* Headline — visually "lit" by the lamp bar above */}
            <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-white mb-5 tracking-tight text-balance leading-[1.05]">
              Upgrade Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-cyan-500">
                Setup.
              </span>
            </h1>

            <p className="text-zinc-500 text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
              Premium hardware &amp; gaming peripherals. New, used &amp; refurbished.
              Delivered across Pakistan.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/products" className="btn-primary text-sm sm:text-base px-7 py-3">
                Shop Now <ArrowRight size={15} />
              </Link>
              <Link href="/category" className="btn-secondary text-sm sm:text-base px-7 py-3">
                Browse Categories
              </Link>
            </div>
          </motion.div>
        </LampContainer>

      ) : (
        /* ── Product carousel ─────────────────────────────── */
        <div className="relative overflow-hidden bg-hb-bg">
          <div className="dot-grid absolute inset-0 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20 py-10 lg:py-16"
                >
                  {/* Text */}
                  <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
                    <p className="section-label mb-4">Featured Product</p>
                    <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-tight mb-6 text-balance">
                      {slides[current].name}
                    </h2>
                    <div className="flex items-baseline justify-center lg:justify-start gap-3 mb-8 flex-wrap">
                      <span className="text-3xl sm:text-4xl font-heading font-bold text-white">
                        Rs.&nbsp;{slides[current].price.toLocaleString('en-PK')}
                      </span>
                      {slides[current].compare_price && slides[current].compare_price! > slides[current].price && (
                        <>
                          <span className="text-zinc-500 line-through text-base">
                            Rs.&nbsp;{slides[current].compare_price!.toLocaleString('en-PK')}
                          </span>
                          <span className="text-[11px] font-bold bg-accent/10 text-accent border border-accent/25 px-2.5 py-1 rounded-full">
                            Save {Math.round(((slides[current].compare_price! - slides[current].price) / slides[current].compare_price!) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                    <Link
                      href={`/products/${slides[current].slug}`}
                      className="btn-primary text-sm sm:text-base px-7 py-3"
                    >
                      View Product <ArrowRight size={15} />
                    </Link>
                  </div>

                  {/* Image */}
                  <div className="flex-1 w-full max-w-sm lg:max-w-none order-1 lg:order-2">
                    <div className="relative aspect-square max-h-[240px] sm:max-h-[300px] lg:max-h-[380px] mx-auto">
                      <div className="absolute inset-[20%] rounded-full bg-accent/5 blur-3xl" />
                      {slides[current].images[0] ? (
                        <Image
                          src={slides[current].images[0]}
                          alt={slides[current].name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-contain relative z-10 drop-shadow-2xl"
                          priority
                        />
                      ) : (
                        <div className="absolute inset-0 rounded-2xl bg-hb-surface2" />
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Nav arrows */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full border border-hb-border2 bg-hb-surface text-zinc-400 hover:border-accent/40 hover:text-accent transition-all shadow-card z-10"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCurrent((c) => (c + 1) % slides.length)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full border border-hb-border2 bg-hb-surface text-zinc-400 hover:border-accent/40 hover:text-accent transition-all shadow-card z-10"
                    aria-label="Next"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Dots */}
            {slides.length > 1 && (
              <div className="flex justify-center gap-2 pb-8">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === current ? 'w-6 bg-accent' : 'w-1.5 bg-hb-border2 hover:bg-hb-border2'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
