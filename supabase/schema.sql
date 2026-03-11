-- ============================================================
-- HB Tech & Gaming — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE product_condition AS ENUM ('new', 'used', 'refurbished', 'open_box');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE categories (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       text NOT NULL,
  slug       text UNIQUE NOT NULL,
  parent_id  uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url  text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE products (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          text NOT NULL,
  slug          text UNIQUE NOT NULL,
  description   text,
  price         numeric(12, 2) NOT NULL,
  compare_price numeric(12, 2),
  category_id   uuid REFERENCES categories(id) ON DELETE SET NULL,
  condition     product_condition NOT NULL DEFAULT 'new',
  stock         integer NOT NULL DEFAULT 0,
  images        text[] DEFAULT '{}',
  featured      boolean DEFAULT false,
  active        boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE admins (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text UNIQUE NOT NULL,
  name       text NOT NULL,
  role       text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE orders (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number     text UNIQUE NOT NULL,
  customer_name    text NOT NULL,
  customer_email   text,
  customer_phone   text NOT NULL,
  delivery_address text NOT NULL,
  city             text NOT NULL,
  items            jsonb NOT NULL DEFAULT '[]',
  subtotal         numeric(12, 2) NOT NULL,
  total            numeric(12, 2) NOT NULL,
  payment_method   text DEFAULT 'cod',
  status           order_status DEFAULT 'pending',
  notes            text,
  created_at       timestamptz DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- CATEGORIES
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (true);

CREATE POLICY "categories_admin_write" ON categories
  FOR ALL USING (is_admin());

-- PRODUCTS
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (active = true);

CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (is_admin());

-- ADMINS
CREATE POLICY "admins_self_read" ON admins
  FOR SELECT USING (is_admin());

CREATE POLICY "admins_admin_write" ON admins
  FOR ALL USING (is_admin());

-- ORDERS
CREATE POLICY "orders_public_insert" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_admin_select" ON orders
  FOR SELECT USING (is_admin());

CREATE POLICY "orders_admin_update" ON orders
  FOR UPDATE USING (is_admin());

-- ============================================================
-- STORAGE
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "product_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_write" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "product_images_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND is_admin());

-- ============================================================
-- SEED DATA — Sample Categories
-- ============================================================
INSERT INTO categories (name, slug) VALUES
  ('Processors', 'processors'),
  ('Motherboards', 'motherboards'),
  ('Graphics Cards', 'graphics-cards'),
  ('Memory (RAM)', 'memory-ram'),
  ('Storage', 'storage'),
  ('Power Supplies', 'power-supplies'),
  ('PC Cases', 'pc-cases'),
  ('Cooling', 'cooling'),
  ('Monitors', 'monitors'),
  ('Keyboards', 'keyboards'),
  ('Mice', 'mice'),
  ('Headsets', 'headsets'),
  ('Laptops', 'laptops'),
  ('Networking', 'networking');
