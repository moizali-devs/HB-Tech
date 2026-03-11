import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminLayout from '@/components/AdminLayout'
import { ShoppingBag, DollarSign, Clock, AlertTriangle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient()

  const [
    { count: totalOrders },
    { data: revenueData },
    { count: pendingOrders },
    { data: lowStockProducts },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total').in('status', ['confirmed', 'processing', 'shipped', 'delivered']),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('products').select('id, name, stock').lt('stock', 5).eq('active', true).order('stock'),
  ])

  const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total || 0), 0) ?? 0

  const stats = [
    { label: 'Total Orders', value: totalOrders ?? 0, icon: ShoppingBag, color: 'text-blue-600 bg-blue-100' },
    { label: 'Revenue (Confirmed+)', value: `Rs. ${totalRevenue.toLocaleString('en-PK')}`, icon: DollarSign, color: 'text-green-600 bg-green-100' },
    { label: 'Pending Orders', value: pendingOrders ?? 0, icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
    { label: 'Low Stock Items', value: lowStockProducts?.length ?? 0, icon: AlertTriangle, color: 'text-accent bg-red-100' },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-4`}>
                <Icon size={20} />
              </div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Low stock warning */}
        {lowStockProducts && lowStockProducts.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-accent" />
              Low Stock Products
            </h2>
            <div className="space-y-2">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="text-sm">{p.name}</span>
                  <span className={`text-sm font-bold ${p.stock === 0 ? 'text-accent' : 'text-yellow-600'}`}>
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
