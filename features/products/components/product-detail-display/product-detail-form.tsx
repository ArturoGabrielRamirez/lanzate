"use client"

import Image from "next/image"
import Link from "next/link"

import type { ProductDetailFormProps } from "@/features/products/types"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"


function ProductDetailForm({ product, slug }: ProductDetailFormProps) {
    /*     const currency = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }) */

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Medios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Imagen principal</label>
                        <div className="relative w-full max-w-sm aspect-[3/4] overflow-hidden rounded-lg border bg-secondary">
                            {product.primary_media?.url ? (
                                <Image src={product.primary_media.url} alt="Primary image" className="object-cover h-full w-full" fill />
                            ) : (
                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Sin imagen principal</div>
                            )}
                        </div>
                    </div>
                    {product.media && product.media.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Galería</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {product.media.map((m) => (
                                    <div key={m.id} className="relative aspect-square overflow-hidden rounded-md bg-secondary border">
                                        <Image src={m.url} alt="Product media" className="object-cover h-full w-full" fill />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">SKU</label>
                        {/*  <p className="text-sm text-muted-foreground">{product.sku}</p> */}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Código de barras</label>
                        {/*  <p className="text-sm text-muted-foreground">{product.barcode || "No especificado"}</p> */}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Descripción</label>
                        <p className="text-sm text-muted-foreground">{product.description || "Sin descripción"}</p>
                    </div>
                </div>

                {/* Precio y stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Precio</label>
                        {/*        <p className="text-sm text-muted-foreground">{currency.format(product.price)}</p> */}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Stock total</label>
                        {/*                <p className="text-sm text-muted-foreground">{product.stock} unidades</p> */}
                    </div>
                </div>

                {/* Categorías */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Categorías</label>
                    {product.categories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Sin categorías</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {product.categories.map((c) => (
                                <Badge key={c.id} variant="outline">{c.name}</Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Variantes */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Variantes</label>
                    {product.variants.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No hay variantes configuradas</p>
                    ) : (
                        <div className="grid gap-2 sm:grid-cols-2">
                            {product.variants.map((v) => {
                                const total = (v.stocks ?? []).reduce((s: number, x: { quantity: number }) => s + (x.quantity ?? 0), 0)
                                const label = [v.size_or_measure, v.color?.name].filter(Boolean).join(" · ") || `Variante ${v.id}`
                                return (
                                    <Link key={v.id} href={`/stores/${slug}/products/${product.id}/${v.id}`} className="rounded-md relative border p-3 flex items-center gap-3 hover:bg-muted">
                                        {v.primary_media?.url ? (
                                            <Image src={v.primary_media.url} alt={label} className="rounded object-cover" fill />
                                        ) : (
                                            <div className="h-12 w-12 rounded bg-secondary" />
                                        )}
                                        <div className="flex flex-col flex-1">
                                            <span className="text-sm font-medium">{label}</span>
                                            <span className="text-xs text-muted-foreground">Stock: {total}</span>
                                            {/*  {v.price && v.price !== product.price && (
                                                <span className="text-xs text-muted-foreground">Precio: ${v.price}</span>
                                            )} */}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Configuración y dimensiones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Configuración</label>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {/*  <Badge variant="outline">Activo: {product.is_active ? "Sí" : "No"}</Badge> */}
                            <Badge variant="outline">Destacado: {product.is_featured ? "Sí" : "No"}</Badge>
                            {/*        <Badge variant="outline">Publicado: {product.is_published ? "Sí" : "No"}</Badge> */}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Dimensiones</label>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                            {/*   {product.height ? <p>Alto: {product.height}{product.height_unit ? ` ${product.height_unit}` : ""}</p> : null}
                            {product.width ? <p>Ancho: {product.width}{product.width_unit ? ` ${product.width_unit}` : ""}</p> : null}
                            {product.depth ? <p>Profundidad: {product.depth}{product.depth_unit ? ` ${product.depth_unit}` : ""}</p> : null}
                            {product.diameter ? <p>Diámetro: {product.diameter}{product.diameter_unit ? ` ${product.diameter_unit}` : ""}</p> : null}
                            {product.weight ? <p>Peso: {product.weight}{product.weight_unit ? ` ${product.weight_unit}` : ""}</p> : null}
                         */}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export { ProductDetailForm }
