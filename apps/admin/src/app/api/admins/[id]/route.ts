import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = getAdminClient()

  // Remove from admins table first
  await supabase.from('admins').delete().eq('id', params.id)

  // Delete auth user
  const { error } = await supabase.auth.admin.deleteUser(params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
