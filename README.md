# HB Tech

**HB Tech** is a full-stack e-commerce platform for computer hardware and gaming peripherals in Pakistan: a storefront for customers and a companion admin panel to run it, built as a pnpm monorepo on Next.js 14 and Supabase.

There's no payment gateway. Checkout builds a pre-filled WhatsApp message from the cart and hands it off to the business number, orders are confirmed over chat, which matches how hardware retail actually closes sales in this market.

## Features

- **Product catalog**: nested categories (one level deep), condition tags (`new` / `used` / `refurbished` / `open_box`), stock tracking, and multi-image products with drag-and-drop upload or direct URL import.
- **Storefront**: server-rendered product/category pages with ISR (60s), URL-param-driven filters that are shareable and require no client state, and a Framer Motion cart drawer.
- **WhatsApp checkout**: no payment integration to maintain; the cart becomes a pre-filled `wa.me` message on submit.
- **Admin panel**: dashboard with low-stock warnings, full product/category/order CRUD, and admin account management gated behind a two-tier auth check (Supabase session and a row in the `admins` table).
- **Row Level Security**: the storefront runs entirely on the Supabase anon key; RLS policies (not application code) enforce that anonymous reads only ever see active products and that writes require an authenticated admin.
- **Shared types**: one `@hb-tech/shared` workspace package for database types, formatters (`formatPrice`, `slugify`), and Supabase client factories, so both apps stay in sync.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router), two independent apps |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v3, class-based dark mode |
| Animation | Framer Motion |
| State | Zustand, persisted to localStorage |
| Database | Supabase (PostgreSQL + PostgREST, RLS-first) |
| Auth | Supabase Auth, admin-only |
| Storage | Supabase Storage (`product-images` bucket) |
| Package manager | pnpm workspaces |
| Deployment | Vercel, one project per app |

## Project structure

```
HB-Tech/
├── apps/
│   ├── customer/        Customer storefront, localhost:3000
│   └── admin/           Admin panel, localhost:3001
├── packages/
│   └── shared/          Types, formatters, Supabase client factories (@hb-tech/shared)
├── supabase/
│   ├── schema.sql       Tables, enums, indexes, RLS policies (idempotent)
│   └── seed-products.sql
└── docs/
    └── VERCEL-DEPLOYMENT.md
```

Each app is a fully independent Next.js project that consumes `@hb-tech/shared` via pnpm's workspace resolution. No build step is needed to pick up shared-package changes in development.

## Getting started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A Supabase project (PostgreSQL + Auth + Storage)

### Install and configure

```bash
pnpm install

cp apps/customer/.env.local.example apps/customer/.env.local
cp apps/admin/.env.local.example    apps/admin/.env.local
```

Fill in your Supabase URL and keys in both `.env.local` files, then run `supabase/schema.sql` in the Supabase SQL editor to create the schema, RLS policies, and default categories.

### Run

```bash
pnpm dev:customer   # http://localhost:3000
pnpm dev:admin      # http://localhost:3001
```

The admin panel needs a first admin account seeded before you can log in, see [`DEVELOPER.md`](DEVELOPER.md#creating-the-first-admin).

## Documentation

[`DEVELOPER.md`](DEVELOPER.md) is the full internal reference: database schema, RLS policy matrix, per-app route tables, styling conventions, state management, auth flow, image storage, deployment, and common tasks.

## License

MIT, see [LICENSE](LICENSE).
