"use client"

import { BranchOpeningHour, PaymentMethod } from "@prisma/client"
import { Truck } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BranchesOverviewDisplayProps } from "@/features/stores/types"

function getPaymentLabel(method: PaymentMethod): string {
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

function formatHours(openingHours: BranchOpeningHour[]): string {
  if (!openingHours || openingHours.length === 0) return "Sin horarios configurados"
  const dayLabel = (d: number) => ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"][d] || String(d)
  return openingHours
    .sort((a, b) => a.day - b.day)
    .map(h => `${dayLabel(h.day)} ${h.start}-${h.end}`)
    .join(" • ")
}

function BranchesOverviewDisplay({ branches, slug }: BranchesOverviewDisplayProps) {
  if (!branches || branches.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="size-4" />
          Sucursales y operación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {branches.map((branch) => {
          const ops = branch.operational_settings
          const offers = ops?.offers_delivery ? "ofrece delivery" : "solo retiros"
          const methods = ops?.payment_methods || []
          const shown = methods.slice(0, 3)
          const more = methods.length > 3
          return (
            <Link key={branch.id} href={`/stores/${slug}/branches/${branch.id}`} className="border rounded-md p-3 block hover:bg-muted/30 transition-colors">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{branch.name}</h4>
                  <span className="text-xs text-muted-foreground">{offers}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {shown.map((m, idx) => (
                    <Badge key={`${branch.id}-${m}-${idx}`} variant="outline">{getPaymentLabel(m as PaymentMethod)}</Badge>
                  ))}
                  {more && <span className="text-xs text-muted-foreground">…</span>}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatHours(branch.opening_hours)}
                </div>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}

export { BranchesOverviewDisplay }
