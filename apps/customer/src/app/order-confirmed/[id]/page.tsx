import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import type { Order } from '@hb-tech/shared'
import WhatsAppButton from '@/components/WhatsAppButton'
import Link from 'next/link'

interface Props {
  params: { id: string }
}

export default async function OrderConfirmedPage({ params }: Props) {
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!order) notFound()

  const o = order as Order

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-hb-bg flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 mb-8">
          <CheckCircle size={44} strokeWidth={2} />
        </div>

        <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mb-2 tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-slate-500 dark:text-hb-muted mb-8">
          Thank you {o.customer_name}! Your order has been received and will be processed shortly.
        </p>

        <div className="rounded-2xl card-surface p-6 mb-6 text-left space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-hb-muted">Order Number</span>
            <span className="font-bold text-accent font-mono">{o.order_number}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-hb-muted">Payment</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              Cash on Delivery
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-hb-muted">Total</span>
            <span className="font-bold text-slate-900 dark:text-white">
              Rs. {o.total.toLocaleString('en-PK')}
            </span>
          </div>
          <div className="flex justify-between gap-4 pt-2 border-t border-slate-200 dark:border-hb-border">
            <span className="text-sm text-slate-500 dark:text-hb-muted shrink-0">Delivery to</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white text-right">
              {o.delivery_address}, {o.city}
            </span>
          </div>
        </div>

        <WhatsAppButton orderNumber={o.order_number} customerName={o.customer_name} total={o.total} />

        <p className="text-xs text-slate-400 dark:text-hb-muted mt-6">
          We'll contact you on {o.customer_phone} to confirm your order.
        </p>

        <Link
          href="/products"
          className="inline-block mt-8 link-accent text-sm font-medium"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
