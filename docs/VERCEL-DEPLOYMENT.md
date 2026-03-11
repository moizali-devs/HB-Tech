# Deploy Admin & Customer to Vercel (same repo)

Use **one GitHub repo** and **two Vercel projects**. Every push to the repo triggers builds for both apps so both stay up to date.

---

## 1. Connect the repo to Vercel (first project – e.g. Customer)

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. **Import** your Git repository (this repo).
3. Configure the **Customer** app:
   - **Project Name:** e.g. `hb-tech-store` (or your preferred name).
   - **Root Directory:** click **Edit** → set to `apps/customer`.
   - **Framework Preset:** Next.js (auto-detected).
   - **Build Command:** leave default (uses `apps/customer/vercel.json`).
   - **Output Directory:** leave default.
   - **Install Command:** leave default (uses `vercel.json`).
4. Add **Environment Variables** (Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.

---

## 2. Create the second project (Admin)

1. **Add New** → **Project** again.
2. **Import the same repository** (this repo).
3. Configure the **Admin** app:
   - **Project Name:** e.g. `hb-tech-admin`.
   - **Root Directory:** `apps/admin`.
   - **Framework Preset:** Next.js.
   - Build/Install use `apps/admin/vercel.json`.
4. Add **Environment Variables** for Admin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (needed for admin API and middleware).
5. Click **Deploy**.

---

## 3. How updates work

- Both projects are linked to the **same repo**.
- When you **push** (e.g. to `main`), Vercel runs a build for **each** project.
- **Customer** project builds from `apps/customer` (root dir).
- **Admin** project builds from `apps/admin` (root dir).
- No extra steps: push once, both deployments update.

---

## 4. Sync env from `.env.local` to Vercel (admin)

To push `apps/admin/.env.local` to the **hb-tech-admin** project on Vercel (so you don’t have to copy-paste in the dashboard):

1. Create a token at [vercel.com/account/tokens](https://vercel.com/account/tokens).
2. In PowerShell (from repo root):
   ```powershell
   $env:VERCEL_TOKEN = "your_token_here"
   node scripts/sync-admin-env-to-vercel.mjs
   ```
3. Redeploy **hb-tech-admin** (or push a commit) so the new env vars are used.

## 5. Optional: Vercel MCP

To manage projects from Cursor with the Vercel MCP:

1. In Cursor: **Settings** → **MCP** (or **Features** → **MCP**).
2. Add the **Vercel** MCP server (from the list or via config).
3. Connect your Vercel account when prompted.
4. After it’s connected, you can use it to create/link projects and configure deployments from the editor.

If the Vercel MCP is not connected, use the steps above in the Vercel dashboard.
