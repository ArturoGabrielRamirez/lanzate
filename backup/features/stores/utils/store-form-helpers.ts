import { ProcessedOpeningHour, ProcessedShippingMethod, ProcessedPaymentMethod } from "@/features/stores/types"

export const mapPaymentMethod = (label: string): string | null => {
  switch (label) {
    case 'Efectivo':
    case 'efectivo': return 'CASH'
    case 'Credito':
    case 'credito': return 'CREDIT_CARD'
    case 'Debito':
    case 'debito': return 'DEBIT_CARD'
    case 'Mercado Pago':
    case 'mercado_pago': return 'MERCADO_PAGO'
    case 'Transferencia':
    case 'transferencia': return 'TRANSFER'
    case 'Billetera Virtual':
    case 'billetera_virtual': return 'VIRTUAL_WALLET'
    default: return null
  }
}

export const mapDayToIndex = (day?: string): number | null => {
  if (!day) return null
  const d = day.toLowerCase()
  if (d === 'lunes') return 0
  if (d === 'martes') return 1
  if (d === 'miercoles') return 2
  if (d === 'jueves') return 3
  if (d === 'viernes') return 4
  if (d === 'sabado') return 5
  if (d === 'domingo') return 6
  return null
}

export const parseMoneyValue = (v?: string | null): number | null => {
  if (!v) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export const parseTimeToMinutes = (hhmm?: string | null): number | null => {
  if (!hhmm) return null
  const [hh, mm] = hhmm.split(':').map(Number)
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null
  return (hh * 60) + mm
}


export function processOpeningHours(attentionDates?: Array<{
  days?: string[]
  startTime?: string
  endTime?: string
}>): ProcessedOpeningHour[] {
  if (!attentionDates) return []
  return attentionDates.flatMap((slot) => {
    const start = slot.startTime ?? '00:00'
    const end = slot.endTime ?? '00:00'
    return (slot.days || [])
      .map(mapDayToIndex)
      .filter((d): d is number => d !== null)
      .map((d) => ({ day: d, start, end }))
  })
}

export function processShippingMethods(methods?: Array<{
  providers?: string[]
  minPurchase?: string
  freeShippingMin?: string
  estimatedTime?: string
  deliveryPrice?: string
}>): ProcessedShippingMethod[] {
  if (!methods) return []
  return methods.flatMap((m) => {
    const eta = parseTimeToMinutes(m.estimatedTime)
    const min = parseMoneyValue(m.minPurchase)
    const free = parseMoneyValue(m.freeShippingMin)
    const price = parseMoneyValue(m.deliveryPrice)
    return (m.providers || [])
      .filter((p): p is string => typeof p === 'string')
      .map((provider) => ({
        provider,
        min_order_amount: min,
        free_shipping_min: free,
        eta_minutes: eta,
        delivery_price: price,
        active: true,
      }))
  })
}

export function processPaymentMethods(paymentMethods?: string[]): ProcessedPaymentMethod[] {
  if (!paymentMethods) return []
  return paymentMethods
    .filter((v): v is string => typeof v === 'string')
    .map((v) => mapPaymentMethod(v))
    .filter((m): m is string => m !== null)
}
