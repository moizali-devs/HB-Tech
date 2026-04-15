// ============================================================
// Shared domain types used by both customer and admin apps.
// Import from '@hb-tech/shared' in either app.
// ============================================================

// All possible states a product can physically be in.
export type ProductCondition = 'new' | 'used' | 'refurbished' | 'open_box'

// Lifecycle states for an order. Transitions are managed in the admin panel.
// Flow: pending -> confirmed -> processing -> shipped -> delivered
// cancelled is a terminal state reachable from any earlier state.
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

// Matches the 'categories' table. parent_id is null for root categories.
export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null   // null = top-level category
  image_url: string | null
  created_at: string
}

// Matches the 'products' table.
// compare_price is the original/crossed-out price used to show a discount.
// images is an ordered array of URLs; index 0 is always the primary image.
// categories is optionally joined via Supabase select('*, categories(*)').
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_price: number | null
  category_id: string
  condition: ProductCondition
  stock: number
  images: string[]
  featured: boolean
  active: boolean             // inactive products are hidden from the storefront
  created_at: string
  categories?: Category       // present only when joined in the query
}

// Matches the 'admins' table. id is a foreign key to auth.users.
export interface Admin {
  id: string
  email: string
  name: string
  role: string                // currently always 'admin'
  created_at: string
}

// A single line item inside an order. Stored as JSONB in the orders table,
// so prices are snapshotted at the time of purchase and never change.
export interface OrderItem {
  product_id: string
  name: string
  price: number               // price at time of order, not current product price
  quantity: number
  image: string | null
}

// Matches the 'orders' table.
// payment_method is always 'cod' (Cash on Delivery) for now.
// items is stored as JSONB so the order is self-contained even if the product is deleted.
export interface Order {
  id: string
  order_number: string        // human-readable, e.g. "HBT-47291"
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  city: string
  items: OrderItem[]
  subtotal: number
  total: number
  payment_method: string
  status: OrderStatus
  notes: string | null
  created_at: string
}
