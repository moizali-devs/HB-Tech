// Formats a number as Pakistani Rupees, e.g. 12500 -> "Rs. 12,500"
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`
}

// Generates a short human-readable order number like "HBT-47291".
// Not guaranteed to be unique under very high concurrency; the DB
// enforces uniqueness via a UNIQUE constraint on orders.order_number.
export function generateOrderNumber(): string {
  const num = Math.floor(Math.random() * 90000) + 10000
  return `HBT-${num}`
}

// Converts any string into a URL-safe slug.
// "ROG Swift PG279QM" -> "rog-swift-pg279qm"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')   // replace non-alphanumeric runs with a hyphen
    .replace(/(^-|-$)/g, '')       // strip leading/trailing hyphens
}

// Returns the integer discount percentage between comparePrice and price.
// Returns 0 if comparePrice is absent or not greater than price.
export function getDiscountPercent(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}
