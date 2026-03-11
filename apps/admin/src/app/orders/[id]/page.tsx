import { createSupabaseServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import OrderDetail from '@/components/OrderDetail'
import type { Order } from '@hb-tech/shared'

interface Props {
  params: { id: string }
}

export default async function OrderDetailPage({ params }: Props) {
  const supabase = createSupabaseServerClient()
  const { data: order } = await supabase.from('orders').select('*').eq('id', params.id).single()

  if (!order) notFound()

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Order {(order as Order).order_number}</h1>
        <OrderDetail order={order as Order} />
      </div>
    </AdminLayout>
  )
}
