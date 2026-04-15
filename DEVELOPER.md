# HB Tech Developer Guide

A full-stack e-commerce platform for computer hardware and gaming peripherals in Pakistan.
Built as a pnpm monorepo with two Next.js 14 apps and a shared package.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [Database](#database)
6. [Customer App](#customer-app)
7. [Admin App](#admin-app)
8. [Shared Package](#shared-package)
9. [Styling System](#styling-system)
10. [State Management](#state-management)
11. [Authentication](#authentication)
12. [Image Storage](#image-storage)
13. [Checkout Flow](#checkout-flow)
14. [Deployment](#deployment)
15. [Common Tasks](#common-tasks)

---

## Project Structure

```
D:/Projects/HB Tech/
├── apps/
│   ├── customer/           Customer storefront (port 3000)
│   └── admin/              Admin panel (port 3001)
├── packages/
│   └── shared/             Types, utilities, and Supabase client factories
├── supabase/
│   ├── schema.sql          Full database schema with RLS policies
│   └── seed-products.sql   Sample product data
├── pnpm-workspace.yaml
└── package.json            Root-level scripts
```

Each app is a fully independent Next.js 14 project. They share types and utilities via
`@hb-tech/shared` (the `packages/shared` workspace package).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v3 (dark mode via `class` strategy) |
| Animation | Framer Motion |
| State | Zustand with localStorage persistence |
| Database | Supabase (PostgreSQL + PostgREST) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (`product-images` bucket) |
| Package manager | pnpm workspaces |
| Deployment | Vercel (two separate projects) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (installed globally)

```bash
npm install -g pnpm
```

### Install dependencies

```bash
# From the repo root
pnpm install
```

### Set up environment files

Copy the example files and fill in your Supabase credentials:

```bash
cp apps/customer/.env.local.example apps/customer/.env.local
cp apps/admin/.env.local.example    apps/admin/.env.local
```

### Run the database schema

Open the Supabase SQL Editor for the `hb-tech-gaming` project and run:

```
supabase/schema.sql
```

This creates all tables, enums, indexes, and RLS policies. The 14 default categories
are seeded automatically at the end of the file.

### Start dev servers

```bash
pnpm dev:customer   # http://localhost:3000
pnpm dev:admin      # http://localhost:3001
```

Both servers can run simultaneously. The admin panel requires the first admin account
to be seeded -- see [Common Tasks](#common-tasks).

---

## Environment Variables

### Customer app (`apps/customer/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://fezlxkwwfjwwmqmgywar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

### Admin app (`apps/admin/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://fezlxkwwfjwwmqmgywar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
```

The service role key bypasses RLS entirely. It is used only in server-side API routes
(`/api/admins`) and must never be included in any client-side bundle.

---

## Database

### Supabase project

- **Project ID**: `fezlxkwwfjwwmqmgywar`
- **Region**: `ap-south-1` (Mumbai)
- **URL**: `https://fezlxkwwfjwwmqmgywar.supabase.co`

### Tables

#### `categories`

Supports one level of nesting via `parent_id`. The homepage and `/category` page
show only root categories (`parent_id IS NULL`).

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| name | text | |
| slug | text | UNIQUE, used in URLs |
| parent_id | uuid | FK to self, null = root |
| image_url | text | Optional cover image |
| created_at | timestamptz | |

#### `products`

`images` is a `text[]` array. Index 0 is always the primary/display image.
`active = false` hides the product from the storefront without deleting it.

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| name | text | |
| slug | text | UNIQUE, used in URLs |
| description | text | |
| price | numeric | Selling price in PKR |
| compare_price | numeric | Optional crossed-out price |
| category_id | uuid | FK to categories |
| condition | product_condition | `new / used / refurbished / open_box` |
| stock | int | 0 = out of stock |
| images | text[] | Ordered array of image URLs |
| featured | bool | Included in homepage carousel |
| active | bool | false = hidden from storefront |
| created_at | timestamptz | |

#### `admins`

`id` is a foreign key to `auth.users`. Both records must exist for login to succeed.
See [Authentication](#authentication) for the two-tier check.

#### `orders`

`items` is a JSONB snapshot of the cart at checkout. Prices inside the snapshot
never change even if the product price is updated later.

`payment_method` is always `'cod'` (Cash on Delivery) for now.

### RLS Policies

The database uses Row Level Security so the anon key is safe for the storefront.

| Table | Anon reads | Anon writes | Admin reads | Admin writes |
|---|---|---|---|---|
| categories | All rows | No | Yes | Yes |
| products | active = true only | No | All rows | Yes |
| admins | No | No | Yes | Yes |
| orders | No | INSERT only | Yes | UPDATE only |

The `is_admin()` helper function (defined in the schema) checks whether the
current `auth.uid()` exists in the `admins` table. All admin write policies
call this function.

---

## Customer App

`apps/customer/src/`

### Pages

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Server component, ISR 60s |
| `/products` | `app/products/page.tsx` | Filtered via URL params |
| `/products/[slug]` | `app/products/[slug]/page.tsx` | Product detail |
| `/category` | `app/category/page.tsx` | All categories |
| `/category/[slug]` | `app/category/[slug]/page.tsx` | Products in a category |
| `/checkout` | `app/checkout/page.tsx` | Client component, reads Zustand cart |
| `/order-confirmed/[id]` | `app/order-confirmed/[id]/page.tsx` | Post-order confirmation |

### Key Components

**`HeroCarousel`** -- shows a product carousel when featured products exist, otherwise
renders a static lamp-glow hero with trust badges. On mobile the slides use normal
document flow (`flex-col`) rather than absolute positioning to prevent content overflow.

**`ProductCard`** -- used in every product grid. The whole card is a `<Link>`. The
Quick Add button calls `e.preventDefault()` to stop the link from firing.

**`CartDrawer`** -- a Framer Motion slide-out panel. Reads from and writes to the
Zustand cart store. Both backdrop and close button call `closeCart()`.

**`ProductFilters`** -- all filters are URL search params. Every change calls
`router.push()` so the server re-fetches. Filters are shareable and work without
any client state.

### Data Fetching Pattern

Pages are server components by default. Data is fetched directly from Supabase
using the anon client (`@/lib/supabase`). Pages that need interactivity (cart,
theme toggle, filters) use `'use client'` components nested inside the server layout.

ISR (`export const revalidate = 60`) is used on all product and category pages
so content stays fresh without requiring a full redeployment.

---

## Admin App

`apps/admin/src/`

### Pages

| Route | File | Notes |
|---|---|---|
| `/login` | `app/login/page.tsx` | Client component, `force-dynamic` layout |
| `/dashboard` | `app/dashboard/page.tsx` | Stats cards + low-stock warning |
| `/products` | `app/products/page.tsx` | Product table with quick toggles |
| `/products/new` | `app/products/new/page.tsx` | Create product |
| `/products/[id]/edit` | `app/products/[id]/edit/page.tsx` | Edit product |
| `/categories` | `app/categories/page.tsx` | Category CRUD |
| `/orders` | `app/orders/page.tsx` | Order list, filterable by status |
| `/orders/[id]` | `app/orders/[id]/page.tsx` | Order detail + status update |
| `/admins` | `app/admins/page.tsx` | Admin account management |

### API Routes

**`POST /api/admins`** -- creates a new admin. Requires `{ email, password, name }`.
Uses the service-role client. If the DB insert fails, the auth user is deleted to
prevent orphaned credentials.

**`DELETE /api/admins/[id]`** -- deletes an admin from both the admins table and auth.users.

### Supabase Clients

The admin app has three client factories in `src/lib/`:

| File | Use |
|---|---|
| `supabase-browser.ts` | Client components -- uses `@supabase/ssr` `createBrowserClient`, auto-refreshes the session |
| `supabase-server.ts` `createSupabaseServerClient()` | Server components -- reads cookies, respects RLS |
| `supabase-server.ts` `createSupabaseAdminClient()` | Server-only admin operations -- uses service role, bypasses RLS |

---

## Shared Package

`packages/shared/src/`

Import as `@hb-tech/shared` in either app.

| Export | What it is |
|---|---|
| `Product`, `Category`, `Order`, `OrderItem`, `Admin` | TypeScript interfaces matching database tables |
| `ProductCondition`, `OrderStatus` | Union type literals |
| `formatPrice(amount)` | `12500` -> `"Rs. 12,500"` |
| `generateOrderNumber()` | `"HBT-47291"` |
| `slugify(text)` | `"ROG Swift"` -> `"rog-swift"` |
| `getDiscountPercent(price, comparePrice)` | Integer discount percentage |
| `supabase` | Anon client instance |
| `createServiceClient()` | Service-role client factory (server-only) |

---

## Styling System

Both apps use Tailwind CSS with a shared set of conventions.

### Custom Colors (Customer)

```
accent          #22d3ee (cyan)
accent-light    #67e8f9
accent-dark     #06b6d4

hb-bg           #080808   dark page background
hb-surface      #111111   card background
hb-surface2     #1a1a1a   nested card / input background
hb-border       #1f1f1f   subtle border
hb-border2      #2a2a2a   stronger border
hb-muted        #52525b   secondary text
hb-text         #fafafa   primary text
hb-text-2       #a1a1aa   secondary text (lighter)
```

### Utility Classes (defined in `globals.css`)

These classes are used heavily throughout the codebase. Do not create ad-hoc
alternatives; use these so styling stays consistent.

| Class | Purpose |
|---|---|
| `.section-label` | Small uppercase category label above a heading |
| `.section-heading` | Large section heading |
| `.btn-primary` | Cyan filled CTA button |
| `.btn-secondary` | Ghost CTA button |
| `.card-surface` | Rounded bordered surface panel |
| `.input-field` | Form input / select / textarea |
| `.link-accent` | Cyan underline link |
| `.hero-glow` | Radial gradient overlay for banner backgrounds |
| `.dot-grid` | Repeating dot-pattern background overlay |

### Dark Mode

Dark mode is class-based (`dark:` prefix). The `ThemeProvider` component reads
the Zustand `useThemeStore` and applies or removes the `dark` class on
`document.documentElement`. The preference is persisted to localStorage under
the key `hb-tech-theme-v2`.

---

## State Management

### Cart Store (`apps/customer/src/store/cart.ts`)

Zustand store persisted to localStorage as `hb-tech-cart`. Only `items` is
persisted; `isOpen` resets to `false` on every page load intentionally.

Key behaviours:

- `addItem` enforces a per-item stock cap and opens the drawer automatically.
- `updateQuantity(id, 0)` removes the item (same as `removeItem`).
- `total()` and `itemCount()` are getter functions, not reactive computed values.
  Call them inside components as `total()` not as `total`.

### Theme Store (`apps/customer/src/store/theme.ts`)

Single `isDark` boolean toggled by `toggle()`. Persisted as `hb-tech-theme-v2`.
The `v2` suffix exists to clear stale values from an earlier version of the store;
bump it if you change the default value.

---

## Authentication

Authentication is admin-only. The customer storefront has no login.

### How admin auth works

1. The admin logs in via `/login` using `supabase.auth.signInWithPassword()`.
2. Supabase sets a session cookie.
3. Every subsequent request passes through `src/middleware.ts` which:
   - Checks the session cookie.
   - Queries the `admins` table to confirm the user's id exists there.
   - Redirects to `/login?reason=not_admin` and signs the user out if they are not found.

This two-tier check means a valid Supabase Auth account alone is not sufficient.
The user must also appear in the `admins` table.

### Creating the first admin

The first admin must be seeded directly in the Supabase dashboard because the
`/api/admins` endpoint is itself behind the admin auth middleware.

Run this in the Supabase SQL Editor (replace values as needed):

```sql
-- 1. Create the auth user via the Supabase dashboard or this direct insert approach
-- is not available via SQL. Use the Admin API or the seed script instead.
```

Alternatively, use the seed script provided:

```bash
# From apps/admin
node scripts/seed-admin.js
```

Default first admin credentials:
- Email: `admin@hbtech.pk`
- Password: `HBAdmin2024!`

Change the password after first login.

---

## Image Storage

Product images are stored in the Supabase Storage bucket `product-images`.
The bucket is public so URLs are accessible without authentication.

### Uploading from the admin panel

`ProductForm` handles two upload paths:

1. **URL input** -- paste any publicly accessible URL. It is stored as-is in the
   `images` array. No file is downloaded or re-hosted.

2. **File upload** -- files are uploaded to `product-images` via `react-dropzone`.
   Each file is renamed to `{timestamp}-{random}.{ext}` to avoid collisions.
   The public URL is retrieved via `supabase.storage.from('product-images').getPublicUrl()`.

### Adding images from manufacturer sites

ROG, MSI, and similar product pages often have CDN images you can link directly.
Right-click the product image in your browser and copy the image URL. Paste it
into the URL field in the product form.

For the image to render via Next.js `<Image>`, the domain must be allowed in
`next.config.js`. The current config allows all `https://` sources via a wildcard.

---

## Checkout Flow

The checkout is a WhatsApp-based manual order flow. There is no payment gateway.

1. Customer fills in the checkout form (name, phone, address, city).
2. Clicking "Place Order" builds a plain-text WhatsApp message containing all
   cart items and delivery details.
3. The browser opens `wa.me/923208378859?text=<encoded message>` in a new tab.
4. The customer sends the pre-filled message to the business WhatsApp number.
5. The team confirms availability and provides delivery details over chat.

The `WHATSAPP_NUMBER` constant lives in `apps/customer/src/lib/constants.ts`.
Update it there if the number changes.

### To add a real payment gateway later

The checkout page (`app/checkout/page.tsx`) is a self-contained client component.
Replace or supplement the `handleSubmit` function with a call to your payment
provider. A Supabase `orders` table insert should happen server-side in an API
route after the payment is confirmed.

---

## Deployment

The project is deployed as two separate Vercel projects from the same GitHub
repository using the root directory setting.

| App | Vercel Root Dir | Port |
|---|---|---|
| Customer | `apps/customer` | 3000 |
| Admin | `apps/admin` | 3001 |

### Environment variables on Vercel

Both projects need:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Admin project additionally needs:
```
SUPABASE_SERVICE_ROLE_KEY
```

### Deploy token

The Vercel deploy token is stored in `C:/Users/moizp/.claude/settings.json`.
Use the Vercel CLI for manual deployments:

```bash
vercel deploy --prod
```

---

## Common Tasks

### Add a new product category

Go to `/categories` in the admin panel. Enter a name and optionally select a parent.
The slug is generated automatically.

### Mark a product as out of stock

Set `stock` to `0` on the product edit page. The storefront automatically shows
an "Out of Stock" overlay and hides the Add to Cart button.

### Change the WhatsApp number

Edit `WHATSAPP_NUMBER` in `apps/customer/src/lib/constants.ts`.

### Add a new admin

Log in to the admin panel, go to `/admins`, and use the invite form.

### Re-run the database schema

The schema file is idempotent for tables and policies (uses `IF NOT EXISTS` and
`CREATE OR REPLACE`). You can re-run `supabase/schema.sql` safely to apply any
new migrations added to the bottom of the file.

### Add a new page to the customer app

1. Create `apps/customer/src/app/<route>/page.tsx`.
2. Export an async server component by default.
3. Add `export const revalidate = 60` if the page shows database content.
4. Add a link to `Header.tsx` if it should appear in the nav.

### Add a new page to the admin app

1. Create `apps/admin/src/app/<route>/page.tsx`.
2. The middleware will protect it automatically.
3. Add a nav link to `apps/admin/src/components/AdminLayout.tsx`.

### Update the shared package

After editing anything in `packages/shared/src/`, both apps pick up the changes
automatically because pnpm resolves the workspace package locally. No rebuild step
is required in development.

---

## Code Conventions

- **Server vs client components**: Pages are server components by default.
  Add `'use client'` only to components that use hooks, browser APIs, or event handlers.

- **Data fetching**: Fetch directly from Supabase in server components.
  Use `Promise.all()` for parallel fetches. Never fetch in `useEffect`.

- **Mutations in the admin app**: Performed directly from client components using
  the browser Supabase client. After mutation, call `router.refresh()` to
  invalidate the server component cache.

- **Types**: Always import from `@hb-tech/shared`. Do not define local duplicates.

- **Currency formatting**: Use `formatPrice()` from `@hb-tech/shared` or
  `.toLocaleString('en-PK')` inline. Never format manually.

- **Slugs**: Use `slugify()` from `@hb-tech/shared`. The admin `ProductForm`
  has a local copy for self-containment but both implementations are identical.

- **Tailwind dark mode**: Use `dark:` variants alongside light variants on every
  element that needs to respond to theme changes. Do not use `isDark` from the
  store to conditionally apply class names in JSX; Tailwind handles this.
