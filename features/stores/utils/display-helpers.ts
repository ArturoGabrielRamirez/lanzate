import { BranchOpeningHour, PaymentMethod } from "@prisma/client"

/**
 * Maps PaymentMethod enum values to user-friendly Spanish labels
 */
export function getPaymentLabel(method: PaymentMethod): string {
  switch (method) {
    case "CASH": return "Efectivo"
    case "CREDIT_CARD": return "Crédito"
    case "DEBIT_CARD": return "Débito"
    case "TRANSFER": return "Transferencia"
    case "MERCADO_PAGO": return "Mercado Pago"
    case "PAYPAL": return "PayPal"
    case "CRYPTO": return "Crypto"
    default: return String(method)
  }
}

/**
 * Formats opening hours array into a readable string
 */
export function formatHours(openingHours: BranchOpeningHour[]): string {
  if (!openingHours || openingHours.length === 0) return "Sin horarios configurados"
  const dayLabel = (d: number) => ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"][d] || String(d)
  return openingHours
    .sort((a, b) => a.day - b.day)
    .map(h => `${dayLabel(h.day)} ${h.start}-${h.end}`)
    .join(" • ")
}

/**
 * Converts a string to a URL-friendly slug
 */
export function slugify(input: string): string {
  return (input || "")
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 63)
}
