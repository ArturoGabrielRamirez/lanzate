"use client"

import { Copy, Trash2 } from "lucide-react"
import { useFormContext } from "react-hook-form"

import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"
import { Button } from "@/features/shadcn/components/button"
import { Input } from "@/features/shadcn/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/shadcn/components/ui/table"

interface VariantsTableProps {
    readOnly?: boolean
}

export function VariantsTable({ readOnly = false }: VariantsTableProps) {
    const { setValue } = useFormContext<CreateProductFormType>()
    const { values, setValues: setCtxValues } = useCreateProductContext()
    
    //const variants = watch("options_variants_info.variants") || []
    const variants = values.options_variants_info.variants || []

    const updateVariant = (index: number, field: string, value: string | number) => {
        const newVariants = [...variants]
        // @ts-expect-error - dynamic field access
        newVariants[index][field] = value
        setValue("options_variants_info.variants", newVariants)
        
        setCtxValues({
            ...values,
            options_variants_info: {
                ...values.options_variants_info,
                variants: newVariants
            }
        })
    }

    const removeVariant = (index: number) => {
        const newVariants = [...variants]
        newVariants.splice(index, 1)
        setValue("options_variants_info.variants", newVariants)
        
        setCtxValues({
            ...values,
            options_variants_info: {
                ...values.options_variants_info,
                variants: newVariants
            }
        })
    }

    const copyPriceToAll = () => {
        if (variants.length === 0) return
        const price = variants[0].price
        const newVariants = variants.map(v => ({ ...v, price }))
        setValue("options_variants_info.variants", newVariants)
        
        setCtxValues({
            ...values,
            options_variants_info: {
                ...values.options_variants_info,
                variants: newVariants
            }
        })
    }

    if (variants.length === 0) return null

    return (
        <div className="flex flex-col gap-2">
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Variante</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Stock</TableHead>
                            {!readOnly && <TableHead className="w-[50px]"></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {variants.map((variant, index) => (
                            <TableRow key={variant.id || index}>
                                <TableCell className="font-medium">
                                    <span className="bg-muted px-2 py-1 rounded text-xs">{variant.name}</span>
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={variant.sku || ""}
                                        onChange={(e) => updateVariant(index, "sku", e.target.value)}
                                        className="h-8 w-32"
                                        placeholder="SKU"
                                        disabled={readOnly}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={variant.price}
                                        onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value) || 0)}
                                        className="h-8 w-24"
                                        min={0}
                                        disabled={readOnly}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={variant.stock}
                                        onChange={(e) => updateVariant(index, "stock", parseFloat(e.target.value) || 0)}
                                        className="h-8 w-24"
                                        min={0}
                                        disabled={readOnly}
                                    />
                                </TableCell>
                                {!readOnly && (
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeVariant(index)}
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {!readOnly && (
                <div className="flex justify-end">
                    <Button variant="outline" onClick={copyPriceToAll} className="gap-2" size="sm">
                        <Copy className="h-4 w-4" /> Copiar precio a todas
                    </Button>
                </div>
            )}
        </div>
    )
}

