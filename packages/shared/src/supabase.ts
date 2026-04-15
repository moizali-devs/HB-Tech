import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Anon client -- safe to use in browser and server components.
// Respects RLS policies: public reads, no admin writes.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service-role client -- bypasses RLS entirely.
// ONLY use this in server-side code (API routes, server actions).
// Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceRoleKey, {
    // Disable session management since this runs server-side per-request.
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
