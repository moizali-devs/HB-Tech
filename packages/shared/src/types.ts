export type ProductCondition = 'new' | 'used' | 'refurbished' | 'open_box'
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  image_url: string | null
  created_at: string
}

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
  active: boolean
  created_at: string
  categories?: Category
}

export interface Admin {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}

export interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image: string | null
}

export interface Order {
  id: string
  order_number: string
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
