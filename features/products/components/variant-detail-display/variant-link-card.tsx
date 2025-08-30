"use client"

import { Boxes } from "lucide-react"
import Link from "next/link"

interface VariantLinkCardProps {
    variant: any
    slug: string
    productId: string | number
    productPrice?: number
}

export const VariantLinkCard = ({ variant, slug, productId, productPrice }: VariantLinkCardProps) => {
    const total = (variant.stocks ?? []).reduce((s: number, x: { quantity: number }) => s + (x.quantity ?? 0), 0)
    const label = [variant.size_or_measure, variant.color?.name].filter(Boolean).join(" · ") || `Variante ${variant.id}`

    return (
        <Link
            href={`/stores/${slug}/products/${productId}/${variant.id}`}
            className="rounded-md border p-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors"
        >
            {variant.primary_media?.url ? (
                <img
                    src={variant.primary_media.url}
                    alt={label}
                    className="h-12 w-12 rounded object-cover"
                />
            ) : (
                <div className="h-12 w-12 rounded bg-secondary flex items-center justify-center">
                    <Boxes className="size-6 text-muted-foreground" />
                </div>
            )}
            <div className="flex flex-col flex-1">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">Stock: {total} unidades</span>
                {variant.price && productPrice && variant.price !== productPrice && (
                    <span className="text-xs text-muted-foreground">Precio: ${variant.price}</span>
                )}
            </div>
        </Link>
    )
}
