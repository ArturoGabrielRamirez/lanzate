"use client"

/* import { Boxes } from "lucide-react"
import Image from "next/image" */
import Link from "next/link"

import type { VariantLinkCardProps } from "@/features/products/types"

function VariantLinkCard({ variant, slug, productId, productPrice }: VariantLinkCardProps) {
    const total = (variant.stocks ?? []).reduce((s: number, x: { quantity: number }) => s + (x.quantity ?? 0), 0)
    /*  const size = variant.size
     const measure = variant.measure
     const variantName = variant.name || [size, measure, variant.color?.name].filter(Boolean).join(" · ") || `Variante ${variant.id}` */

    return (
        <Link
            href={`/stores/${slug}/products/${productId}/${variant.id}`}
            className="rounded-md border p-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors"
        >
            {/*  {variant.primary_media?.url ? (
                <Image
                    src={variant.primary_media.url}
                    alt={variantName}
                    className="h-12 w-12 rounded object-cover"
                />
            ) : (
                <div className="h-12 w-12 rounded bg-secondary flex items-center justify-center">
                    <Boxes className="size-6 text-muted-foreground" />
                </div>
            )} */}
            <div className="flex flex-col flex-1">
                {/*    <span className="text-sm font-medium">{variantName}</span> */}
                <span className="text-xs text-muted-foreground">Stock: {total} unidades</span>
                {variant.price && productPrice && variant.price !== productPrice && (
                    <span className="text-xs text-muted-foreground">Precio: ${variant.price}</span>
                )}
            </div>
        </Link>
    )
}

export { VariantLinkCard }
