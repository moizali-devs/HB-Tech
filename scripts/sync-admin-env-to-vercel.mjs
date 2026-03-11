/**
 * Sync apps/admin/.env.local to Vercel hb-tech-admin project env vars.
 * Requires VERCEL_TOKEN in env (from https://vercel.com/account/tokens).
 *
 * Run: node scripts/sync-admin-env-to-vercel.mjs
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const PROJECT_ID = 'prj_QwfRVxD60PY01XbCLWTPr4vIO09o'
const TEAM_ID = 'team_ELo8O4cdp2blVKosunlCTiY0'
const ENV_FILE = join(__dirname, '..', 'apps', 'admin', '.env.local')

const token = process.env.VERCEL_TOKEN
if (!token) {
  console.error('Set VERCEL_TOKEN (from https://vercel.com/account/tokens) and run again.')
  process.exit(1)
}

if (!existsSync(ENV_FILE)) {
  console.error('Missing apps/admin/.env.local')
  process.exit(1)
}

const raw = readFileSync(ENV_FILE, 'utf8')
const vars = []
for (const line of raw.split('\n')) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
  if (m) {
    const value = m[2].replace(/^["']|["']$/g, '').trim()
    if (value) vars.push({ key: m[1], value })
  }
}

const base = `https://api.vercel.com/v10/projects/${PROJECT_ID}/env`
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}

for (const { key, value } of vars) {
  try {
    const res = await fetch(`${base}?teamId=${TEAM_ID}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        key,
        value,
        type: 'plain',
        target: ['production', 'preview'],
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      console.log(`Set ${key}`)
    } else {
      if (data.error?.code === 'ENV_ALREADY_EXISTS') {
        const envs = await fetch(`${base}?teamId=${TEAM_ID}`, { headers }).then((r) => r.json())
        const existing = envs.envs?.find((e) => e.key === key)
        if (existing?.id) {
          await fetch(`${base}/${existing.id}?teamId=${TEAM_ID}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ value, type: 'plain', target: ['production', 'preview'] }),
          })
          console.log(`Updated ${key}`)
        }
      } else {
        console.error(`Failed ${key}:`, res.status, data)
      }
    }
  } catch (e) {
    console.error(`Error ${key}:`, e.message)
  }
}

console.log('Done. Redeploy hb-tech-admin on Vercel for changes to take effect.')
