// Checkout page -- client component because it reads from the Zustand cart store.
// There is no server-side order creation here. Instead, the user fills in their
// details, then the form builds a pre-filled WhatsApp message and opens wa.me.
// The team confirms the order manually over WhatsApp (Cash on Delivery model).

'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import Image from 'next/image'
import { whatsAppOrderUrl } from '@/lib/constants'
import { Banknote } from 'lucide-react'

// Builds the WhatsApp message text from cart items and customer details.
// Each item gets its own block so it reads cleanly in the chat.
function buildOrderMessage(
  items: { name: string; price: number; quantity: number }[],
  customerName: string,
  address: string,
  notes?: string
): string {
  const lines: string[] = ['Hello, I want to place an order.', '']
  for (const item of items) {
    lines.push(`Product: ${item.name}`)
    lines.push(`Quantity: ${item.quantity}`)
    lines.push(`Price: Rs. ${(item.price * item.quantity).toLocaleString('en-PK')}`)
    lines.push('')
  }
  lines.push(`Customer Name: ${customerName}`)
  lines.push(`Address: ${address}`)
  if (notes?.trim()) lines.push(`Notes: ${notes.trim()}`)
  return lines.join('\n')
}

export default function CheckoutPage() {
  const { items, total } = useCartStore()
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    city: '',
    notes: '',
  })

  // Show an empty-cart fallback before the form renders.
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-hb-bg flex items-center justify-center px-4">
        <div className="text-center rounded-2xl card-surface p-12 max-w-md">
          <p className="text-slate-500 dark:text-hb-muted text-lg">Your cart is empty.</p>
          <a href="/products" className="link-accent mt-4 inline-block">
            Browse products
          </a>
        </div>
      </div>
    )
  }

  const subtotal = total()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Combine address and city into a single string for the WhatsApp message.
    const address = [form.delivery_address, form.city].filter(Boolean).join(', ')
    const message = buildOrderMessage(items, form.customer_name, address, form.notes)
    const url = whatsAppOrderUrl(message)
    // Open WhatsApp in a new tab so the customer keeps the checkout page open.
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Field config array keeps the JSX DRY. 'as const' preserves the literal types
  // so TypeScript can check that field.name is a valid key of the form state.
  const fields = [
    { name: 'customer_name', label: 'Full Name', type: 'text', required: true },
    { name: 'customer_email', label: 'Email Address', type: 'email', required: false },
    { name: 'customer_phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'delivery_address', label: 'Delivery Address', type: 'text', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
  ] as const

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-hb-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <h1 className="section-heading mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">
          {/* Left column: customer details */}
          <div className="space-y-5">
            <h2 className="font-semibold text-lg text-slate-900 dark:text-white">
              Delivery Information
            </h2>

            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {field.label} {field.required && <span className="text-accent">*</span>}
                </label>
                <input
                  type={field.type}
                  required={field.required}
                  value={form[field.name]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  className="input-field"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Order Notes (optional)
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any special instructions..."
                className="input-field resize-none"
              />
            </div>

            {/* Payment method badge -- hardcoded to COD for now */}
            <div className="rounded-xl card-surface p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Banknote size={24} className="text-emerald-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Cash on Delivery</p>
                <p className="text-xs text-slate-500 dark:text-hb-muted mt-0.5">
                  Pay when your order arrives
                </p>
              </div>
            </div>
          </div>

          {/* Right column: order summary */}
          <div>
            <h2 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">
              Order Summary
            </h2>
            <div className="rounded-2xl card-surface p-5 space-y-4 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-hb-surface2 shrink-0">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-hb-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white shrink-0">
                    Rs. {(item.price * item.quantity).toLocaleString('en-PK')}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500 dark:text-hb-muted">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-hb-muted">
                <span>Delivery</span>
                <span className="text-emerald-500 font-medium">Free</span>
              </div>
            </div>
            <div className="flex justify-between items-center font-bold text-lg text-slate-900 dark:text-white border-t border-slate-200 dark:border-hb-border pt-4 mt-4">
              <span>Total</span>
              <span className="text-accent">Rs. {subtotal.toLocaleString('en-PK')}</span>
            </div>

            {/* Submitting opens a pre-filled WhatsApp chat rather than posting to an API */}
            <button
              type="submit"
              className="w-full mt-6 btn-primary py-4 text-lg"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
