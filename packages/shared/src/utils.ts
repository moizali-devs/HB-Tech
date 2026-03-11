export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`
}

export function generateOrderNumber(): string {
  const num = Math.floor(Math.random() * 90000) + 10000
  return `HBT-${num}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getDiscountPercent(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}
