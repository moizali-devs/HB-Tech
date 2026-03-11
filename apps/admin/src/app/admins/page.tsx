import { createSupabaseServerClient } from '@/lib/supabase-server'
import AdminLayout from '@/components/AdminLayout'
import AdminsManager from '@/components/AdminsManager'
import type { Admin } from '@hb-tech/shared'

export default async function AdminsPage() {
  const supabase = createSupabaseServerClient()
  const { data: admins } = await supabase.from('admins').select('*').order('created_at')

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Users</h1>
        <AdminsManager admins={(admins as Admin[]) ?? []} />
      </div>
    </AdminLayout>
  )
}
