// POST /api/admins -- creates a new admin account.
// Uses the service-role client to bypass RLS and call the Supabase Auth Admin API.
// The operation is atomic: if the DB insert fails, the auth user is deleted so we
// don't leave orphaned accounts in auth.users.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  // Service-role client -- bypasses RLS, never expose to the browser.
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json()

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = getAdminClient()

  // Step 1: create the Supabase Auth user.
  // email_confirm: true skips the confirmation email and activates the account immediately.
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message ?? 'Failed to create user' }, { status: 400 })
  }

  // Step 2: insert into the admins table using the same UUID as auth.users.
  const { data: adminRecord, error: dbError } = await supabase
    .from('admins')
    .insert({ id: authData.user.id, email, name, role: 'admin' })
    .select()
    .single()

  if (dbError) {
    // Rollback: delete the auth user so we don't leave orphaned credentials.
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ admin: adminRecord })
}
