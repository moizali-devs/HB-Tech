/**
 * Seed a default admin user in Supabase (Auth + admins table).
 * Uses: email admin@admin.com, password admin
 *
 * Run from repo root: pnpm exec node apps/admin/scripts/seed-admin.mjs
 * Or from apps/admin: node scripts/seed-admin.mjs
 *
 * Requires .env.local in apps/admin with:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local from apps/admin
const envPath = join(__dirname, '..', '.env.local')
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in apps/admin/.env.local')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const EMAIL = 'admin@admin.com'
const PASSWORD = 'admin'
const NAME = 'Admin'

async function main() {
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  })

  if (authError) {
    if (authError.message?.includes('already been registered')) {
      console.log('Auth user already exists. Ensuring admins row exists...')
      const { data: existing } = await supabase.from('admins').select('id').eq('email', EMAIL).single()
      if (existing) {
        console.log('Admin already in admins table. Use email:', EMAIL, 'password:', PASSWORD)
        return
      }
      const { data: users } = await supabase.auth.admin.listUsers()
      const user = users?.users?.find((u) => u.email === EMAIL)
      if (!user) {
        console.error('User exists in Auth but could not list. Create admins row manually with that user id.')
        process.exit(1)
      }
      const { error: insertErr } = await supabase.from('admins').insert({
        id: user.id,
        email: EMAIL,
        name: NAME,
        role: 'admin',
      })
      if (insertErr) {
        console.error('Insert admins:', insertErr.message)
        process.exit(1)
      }
      console.log('Admins row added. Login with email:', EMAIL, 'password:', PASSWORD)
      return
    }
    console.error('Auth error:', authError.message)
    process.exit(1)
  }

  const { error: dbError } = await supabase
    .from('admins')
    .insert({ id: authData.user.id, email: EMAIL, name: NAME, role: 'admin' })

  if (dbError) {
    await supabase.auth.admin.deleteUser(authData.user.id)
    console.error('DB error:', dbError.message)
    process.exit(1)
  }

  console.log('Admin created. Login with:')
  console.log('  Email:', EMAIL)
  console.log('  Password:', PASSWORD)
}

main()
