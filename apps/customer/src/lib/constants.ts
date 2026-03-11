/** Store WhatsApp number (no + or spaces). Used for wa.me links. */
export const WHATSAPP_NUMBER = '923208378859'

export function whatsAppOrderUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
