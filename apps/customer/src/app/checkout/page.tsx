'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Banknote } from 'lucide-react'

function generateOrderNumber() {
  const num = Math.floor(Math.random() * 90000) + 10000
  return `HBT-${num}`
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    city: '',
    notes: '',
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const order_number = generateOrderNumber()
    const orderItems = items.map((i) => ({
      product_id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    }))

    const { data, error } = await supabase
      .from('orders')
      .insert({
        ...form,
        order_number,
        items: orderItems,
        subtotal,
        total: subtotal,
        payment_method: 'cod',
        status: 'pending',
      })
      .select('id')
      .single()

    setLoading(false)

    if (error || !data) {
      alert('Failed to place order. Please try again.')
      return
    }

    clearCart()
    router.push(`/order-confirmed/${data.id}`)
  }

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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 btn-primary py-4 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
