'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import type { Order, OrderStatus } from '@hb-tech/shared'

const STATUSES: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrdersTable({ orders, currentStatus }: { orders: Order[]; currentStatus?: string }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="space-y-4">
      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => router.push(value ? `${pathname}?status=${value}` : pathname)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              (currentStatus ?? '') === value
                ? 'bg-accent text-white'
                : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-accent'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Order #</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">City</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-accent">{order.order_number}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-gray-500 text-xs">{order.customer_phone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{order.city}</td>
                    <td className="px-4 py-3 font-medium">Rs. {order.total.toLocaleString('en-PK')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] ?? ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString('en-PK')}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-accent text-xs hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
