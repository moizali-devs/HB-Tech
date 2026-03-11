'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import type { Order, OrderStatus } from '@hb-tech/shared'

const STATUS_OPTIONS: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
]

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrderDetail({ order }: { order: Order }) {
  const [status, setStatus] = useState<OrderStatus>(order.status)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const updateStatus = async (newStatus: OrderStatus) => {
    setSaving(true)
    await supabase.from('orders').update({ status: newStatus }).eq('id', order.id)
    setStatus(newStatus)
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Status */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[status]}`}>
            {status}
          </span>
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value as OrderStatus)}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-accent disabled:opacity-60"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-400">
          Placed on {new Date(order.created_at).toLocaleString('en-PK')}
        </p>
      </div>

      {/* Customer info */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="font-semibold mb-4">Customer Information</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Name', value: order.customer_name },
            { label: 'Email', value: order.customer_email || '—' },
            { label: 'Phone', value: order.customer_phone },
            { label: 'City', value: order.city },
            { label: 'Delivery Address', value: order.delivery_address },
            { label: 'Payment', value: order.payment_method.toUpperCase() },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-gray-500 text-xs mb-0.5">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </div>
        {order.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-gray-500 text-xs mb-0.5">Notes</p>
            <p className="text-sm">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Order items */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="font-semibold mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity} × Rs. {item.price.toLocaleString('en-PK')}</p>
              </div>
              <p className="font-semibold text-sm">
                Rs. {(item.price * item.quantity).toLocaleString('en-PK')}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center font-bold">
          <span>Total</span>
          <span className="text-accent text-lg">Rs. {order.total.toLocaleString('en-PK')}</span>
        </div>
      </div>
    </div>
  )
}
