import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminLayout from '@/components/AdminLayout'
import OrdersTable from '@/components/OrdersTable'
import type { Order } from '@hb-tech/shared'

interface PageProps {
  searchParams: { status?: string }
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const supabase = createSupabaseServerClient()

  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  const { data: orders } = await query.limit(100)

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        <OrdersTable orders={(orders as Order[]) ?? []} currentStatus={searchParams.status} />
      </div>
    </AdminLayout>
  )
}
