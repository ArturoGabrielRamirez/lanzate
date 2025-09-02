export const mapPaymentMethod = (label: string): string | null => {
  switch (label) {
    case 'Efectivo': return 'CASH'
    case 'Credito': return 'CREDIT_CARD'
    case 'Debito': return 'DEBIT_CARD'
    case 'Mercado Pago': return 'MERCADO_PAGO'
    case 'Transferencia': return 'TRANSFER'
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

export type ProcessedOpeningHour = {
  day: number
  start: string
  end: string
}

export type ProcessedShippingMethod = {
  provider: string
  min_order_amount: number | null
  free_shipping_min: number | null
  eta_minutes: number | null
  active: boolean
}

export type ProcessedPaymentMethod = string

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
}>): ProcessedShippingMethod[] {
  if (!methods) return []
  return methods.flatMap((m) => {
    const eta = parseTimeToMinutes(m.estimatedTime)
    const min = parseMoneyValue(m.minPurchase)
    const free = parseMoneyValue(m.freeShippingMin)
    return (m.providers || [])
      .filter((p): p is string => typeof p === 'string')
      .map((provider) => ({
        provider,
        min_order_amount: min,
        free_shipping_min: free,
        eta_minutes: eta,
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
