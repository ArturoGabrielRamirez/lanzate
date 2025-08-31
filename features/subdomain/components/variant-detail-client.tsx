"use client"

import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Product, ProductVariant, Color } from "@prisma/client"
import { useMemo, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type VariantWithColor = ProductVariant & { color: Color | null }

type Props = {
  product: Product & { variants?: VariantWithColor[] }
  initialVariantId?: number
}

function VariantDetailClient({ product, initialVariantId }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const variants = product.variants ?? []
  const sizes = useMemo(() => Array.from(new Set(variants.map(v => v.size).filter(Boolean))) as string[], [variants])
  const measures = useMemo(() => Array.from(new Set(variants.map(v => v.measure).filter(Boolean))) as string[], [variants])
  const colors = useMemo(() => Array.from(new Set(variants.map(v => v.color_id).filter(Boolean))) as number[], [variants])

  const initialVariant = variants.find(v => v.id === initialVariantId) ?? variants[0]

  const [selectedSize, setSelectedSize] = useState<string | undefined>(initialVariant?.size ?? undefined)
  const [selectedMeasure, setSelectedMeasure] = useState<string | undefined>(initialVariant?.measure ?? undefined)
  const [selectedColorId, setSelectedColorId] = useState<number | undefined>(initialVariant?.color_id ?? undefined)

  const filtered = useMemo(() => {
    return variants.filter(v =>
      (selectedSize ? v.size === selectedSize : true) &&
      (selectedMeasure ? v.measure === selectedMeasure : true) &&
      (selectedColorId ? v.color_id === selectedColorId : true)
    )
  }, [variants, selectedSize, selectedMeasure, selectedColorId])

  const selectedVariant = filtered[0] ?? initialVariant

  const displayName = selectedVariant?.name ?? product.name
  const displayPrice = selectedVariant?.price ?? product.price

  function navigateToVariant(next: VariantWithColor) {
    const parts = pathname.split("/")
    if (parts.length >= 2) {
      // route format: .../item/:productId/:variantId
      parts[parts.length - 1] = String(next.id)
      router.replace(parts.join("/"))
    }
  }

  function handleSelectByFilters(nextSize?: string, nextMeasure?: string, nextColorId?: number) {
    const match = variants.find(v =>
      (nextSize ? v.size === nextSize : true) &&
      (nextMeasure ? v.measure === nextMeasure : true) &&
      (nextColorId ? v.color_id === nextColorId : true)
    )
    if (match) navigateToVariant(match)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Nombre</p>
        <h2 className="text-3xl font-bold">{displayName}</h2>
        <div className="text-2xl font-semibold">${displayPrice}</div>
      </div>

      {sizes.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Tamaño</p>
          <div className="flex gap-2 flex-wrap">
            {sizes.map(size => {
              const active = selectedSize === size
              return (
                <Badge
                  key={size}
                  variant={active ? "default" : "secondary"}
                  className={cn("cursor-pointer", active && "ring-2 ring-primary")}
                  onClick={() => { setSelectedSize(size); handleSelectByFilters(size, selectedMeasure, selectedColorId) }}
                >
                  {size}
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {measures.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Medida</p>
          <Select
            value={selectedMeasure}
            onValueChange={(val) => { setSelectedMeasure(val); handleSelectByFilters(selectedSize, val, selectedColorId) }}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Seleccionar medida" />
            </SelectTrigger>
            <SelectContent>
              {measures.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {colors.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Color</p>
          <div className="flex gap-2 flex-wrap">
            {variants.filter(v => v.color_id).map(v => (
              <button
                key={v.id}
                type="button"
                onClick={() => { setSelectedColorId(v.color_id!); handleSelectByFilters(selectedSize, selectedMeasure, v.color_id!) }}
                className={cn("size-8 rounded-full border", selectedColorId === v.color_id && "ring-2 ring-primary")}
                style={{ backgroundColor: v.color?.rgba ? `rgba(${(v.color.rgba as any)[0]}, ${(v.color.rgba as any)[1]}, ${(v.color.rgba as any)[2]}, ${(v.color.rgba as any)[3] ?? 1})` : undefined }}
                aria-label={v.color?.name ?? "color"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default VariantDetailClient


