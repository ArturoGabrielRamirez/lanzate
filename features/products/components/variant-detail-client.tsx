"use client"

import { Badge } from "@/features/shadcn/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import { cn } from "@/lib/utils"
import { Product, ProductVariant, Color, ProductMedia } from "@prisma/client"
import { useMemo, useState, useEffect } from "react"
import { useQueryState } from "nuqs"

type VariantWithColor = ProductVariant & { color: Color | null; primary_media?: ProductMedia | null; media?: ProductMedia[] }

type Props = {
  product: Product & { variants?: VariantWithColor[] }
  initialVariantId?: number
}

function VariantDetailClient({ product, initialVariantId }: Props) {

  const variants = useMemo(() => product.variants ?? [], [product.variants])
  const sizes = useMemo(() => Array.from(new Set(variants.map(v => v.size).filter(Boolean))) as string[], [variants])
  const measures = useMemo(() => Array.from(new Set(variants.map(v => v.measure).filter(Boolean))) as string[], [variants])
  const colors = useMemo(() => Array.from(new Set(variants.map(v => v.color_id).filter(Boolean))) as number[], [variants])
  const colorMap = useMemo(() => {
    const map = new Map<number, Color>()
    variants.forEach(v => { if (v.color_id && v.color) map.set(v.color_id, v.color) })
    return map
  }, [variants])

  const initialVariant = variants.find(v => v.id === initialVariantId) ?? variants[0]

  const [sizeParam, setSizeParam] = useQueryState("size", { shallow: false, clearOnDefault: true })
  const [measureParam, setMeasureParam] = useQueryState("measure", { shallow: false, clearOnDefault: true })
  const [colorParam, setColorParam] = useQueryState("color", { shallow: false, clearOnDefault: true })

  const [selectedSize, setSelectedSize] = useState<string | undefined>(sizeParam ?? initialVariant?.size ?? undefined)
  const [selectedMeasure, setSelectedMeasure] = useState<string | undefined>(measureParam ?? initialVariant?.measure ?? undefined)
  const [selectedColorId, setSelectedColorId] = useState<number | undefined>(colorParam ? Number(colorParam) : (initialVariant?.color_id ?? undefined))

  useEffect(() => {
    if (!sizeParam && initialVariant?.size) setSizeParam(initialVariant.size)
    if (!measureParam && initialVariant?.measure) setMeasureParam(initialVariant.measure)
    if (!colorParam && initialVariant?.color_id) setColorParam(String(initialVariant.color_id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  function handleSelectByFilters(nextSize?: string, nextMeasure?: string, nextColorId?: number) {
    if (typeof nextSize === "string") setSizeParam(nextSize)
    else if (nextSize === undefined) setSizeParam(null)
    if (typeof nextMeasure === "string") setMeasureParam(nextMeasure)
    else if (nextMeasure === undefined) setMeasureParam(null)
    if (typeof nextColorId === "number") setColorParam(String(nextColorId))
    else if (nextColorId === undefined) setColorParam(null)
  }

  const galleryImages: string[] = useMemo(() => {
    const variantMedia = selectedVariant?.media?.map((m: ProductMedia) => m.url) ?? []
    const variantPrimary = selectedVariant?.primary_media?.url
    const productPrimary = (product as unknown as { primary_media?: ProductMedia | null })?.primary_media?.url
    const productMedia = ((product as unknown as { media?: ProductMedia[] })?.media ?? []).map((m: ProductMedia) => m.url)
    const list = [variantPrimary, ...variantMedia, productPrimary, ...productMedia].filter(Boolean) as string[]
    const dedup = Array.from(new Set(list))
    return dedup.slice(0, 6)
  }, [selectedVariant, product])

  return (
    <div className="space-y-6">
      {/* Gallery: main left, thumbs right */}
      <div className="grid grid-cols-[minmax(240px,380px)_minmax(64px,96px)] gap-4 items-start">
        <div className="bg-muted rounded-md overflow-hidden aspect-square flex items-center justify-center">
          {galleryImages[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={galleryImages[0]} alt={displayName} className="object-cover w-full h-full" />
          ) : (
            <div className="text-muted-foreground/60">No image available</div>
          )}
        </div>
        <div className="flex flex-col gap-2 max-h-[380px] overflow-auto pr-1">
          {galleryImages.slice(1).map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt={displayName} className="rounded-md object-cover aspect-square w-full cursor-pointer hover:opacity-90" />
          ))}
        </div>
      </div>
      <div className="space-y-2 mt-1">
        <h2 className="text-3xl md:text-4xl font-bold leading-tight">{displayName}</h2>
        <div className="text-3xl font-semibold tracking-tight">${displayPrice}</div>
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
            {colors.map((colorId) => {
              const c = colorMap.get(colorId)
              const rgba = c?.rgba as unknown as [number, number, number, number?] | undefined
              const bg = rgba ? `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3] ?? 1})` : undefined
              const active = selectedColorId === colorId
              return (
                <button
                  key={colorId}
                  type="button"
                  onClick={() => { setSelectedColorId(colorId); handleSelectByFilters(selectedSize, selectedMeasure, colorId) }}
                  className={cn("size-8 rounded-full border", active && "ring-2 ring-primary")}
                  style={{ backgroundColor: bg }}
                  aria-label={c?.name ?? "color"}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default VariantDetailClient


