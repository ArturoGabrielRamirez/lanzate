"use client"

import { ProductVariant } from "@prisma/client"
import { Package, EditIcon, X, Check, Plus, Trash2, Loader2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { Form } from "@/features/layout/components"
import { getBranchesForVariantData } from "@/features/products/data/get-branches-for-variant.data"
import { updateVariantStocksData } from "@/features/products/data/update-variant-stocks.data"
import { Button } from "@/features/shadcn/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Input } from "@/features/shadcn/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/features/shadcn/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

interface VariantStockDisplayProps {
    variant: ProductVariant & {
        stocks?: { quantity: number; branch_id: number; branch?: { id: number; name: string } }[]
    }
}

type VariantStockFormValues = {
    stock: number
}

function VariantStockDisplay({ variant }: VariantStockDisplayProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [branches, setBranches] = useState<{ id: number; name: string }[]>([])
    const [rows, setRows] = useState<{ branch_id: number | ""; quantity: number | "" }[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const branchNameById = useMemo(() => {
        const map = new Map<number, string>()
        for (const b of branches) map.set(b.id, b.name)
        return map
    }, [branches])

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    useEffect(() => {
        const load = async () => {
            const { payload, hasError, message } = await getBranchesForVariantData(variant.id)
            if (hasError || !payload) {
                console.error(message)
                return
            }
            setBranches(payload)
        }
        load()
    }, [variant.id])

    useEffect(() => {
        // initialize rows from variant.stocks when entering edit, otherwise keep last
        if (isEditing) {
            const initial = (variant.stocks ?? []).map(s => ({ branch_id: s.branch_id, quantity: s.quantity }))
            setRows(initial.length > 0 ? initial : [{ branch_id: branches[0]?.id ?? "", quantity: "" }])
        }
    }, [isEditing, variant.stocks, branches])

    const canAddMoreBranches = useMemo(() => {
        const used = new Set(rows.map(r => r.branch_id).filter(Boolean) as number[])
        const available = branches.filter(b => !used.has(b.id))
        return available.length > 0
    }, [rows, branches])

    async function handleSave() {
        const valid = rows.filter(r => typeof r.branch_id === "number" && typeof r.quantity === "number") as { branch_id: number; quantity: number }[]

        const originalIds = new Set((variant.stocks ?? []).map(s => s.branch_id))
        const newIds = new Set(rows.filter(r => typeof r.branch_id === "number").map(r => r.branch_id as number))
        const zeros: { branch_id: number; quantity: number }[] = []
        for (const id of originalIds) {
            if (!newIds.has(id)) zeros.push({ branch_id: id, quantity: 0 })
        }

        const updates = [...valid, ...zeros]
        if (updates.length === 0) {
            setIsEditing(false)
            return
        }

        setIsSaving(true)
        const { hasError, message } = await updateVariantStocksData(variant.id, updates)
        if (hasError) {
            toast.error(message || "Error al actualizar stock")
            setIsSaving(false)
            return
        }
        toast.success("Stock actualizado correctamente")
        setIsEditing(false)
        setIsSaving(false)
    }

    function ToggleEditButton() {
        const { reset } = useFormContext<VariantStockFormValues>()

        const totalStock = (variant.stocks ?? []).reduce((sum, stock) => sum + stock.quantity, 0)

        const initialValues = {
            stock: totalStock,
        }

        const onClick = () => {
            if (isEditing) {
                reset(initialValues)
                handleCloseEdit()
                return
            }
            handleOpenEdit()
        }

        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <IconButton
                        icon={isEditing ? X : EditIcon}
                        onClick={onClick}
                        className="opacity-0 group-hover/variant-stock-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar stock de la variante
                </TooltipContent>
            </Tooltip>
        )
    }

    const totalStock = (variant.stocks ?? []).reduce((sum, stock) => sum + stock.quantity, 0)

    return (
        <Card className="group/variant-stock-display">
            <Form submitButton={false} contentButton={false}>
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg md:text-xl">
                            <Package className="size-5" />
                            Stock de la variante
                        </span>
                    </CardTitle>
                    <CardAction>
                        {isEditing && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <IconButton
                                        icon={isSaving ? Loader2 : Check}
                                        iconClassName={isSaving ? "animate-spin" : undefined}
                                        onClick={handleSave}
                                        color={[99, 102, 241]}
                                        className="opacity-0 group-hover/variant-stock-display:opacity-100 transition-opacity duration-300"
                                        disabled={isSaving}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Guardar cambios
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <ToggleEditButton />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Stock total</label>
                            <div className="flex items-center gap-2">
                                <Package className="size-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">{totalStock} unidades</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Stock por sucursal</label>
                            {isEditing ? (
                                <div className="space-y-3">
                                    {rows.map((row, idx) => {
                                        const used = new Set(rows.map(r => r.branch_id).filter(Boolean) as number[])
                                        const options = branches.filter(b => b.id === row.branch_id || !used.has(b.id))
                                        return (
                                            <div key={idx} className="flex flex-col gap-2 md:flex-row md:items-center">
                                                <div className="md:w-1/2">
                                                    <Select
                                                        value={row.branch_id === "" ? undefined : String(row.branch_id)}
                                                        onValueChange={(val) => {
                                                            setRows(prev => prev.map((r, i) => i === idx ? { ...r, branch_id: val === "" ? "" : Number(val) } : r))
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecciona sucursal" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {options.map(b => (
                                                                <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="md:w-1/3">
                                                    <Input
                                                        type="number"
                                                        value={row.quantity === "" ? "" : String(row.quantity)}
                                                        onChange={(e) => {
                                                            const val = e.target.value
                                                            setRows(prev => prev.map((r, i) => i === idx ? { ...r, quantity: val === "" ? "" : Number(val) } : r))
                                                        }}
                                                        placeholder="Cantidad"
                                                    />
                                                </div>
                                                <div className="md:w-auto flex items-center gap-2">
                                                    {rows.length > 1 && (
                                                        <Button variant="ghost" size="icon" onClick={() => setRows(prev => prev.filter((_, i) => i !== idx))}>
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {branches.length > 1 && canAddMoreBranches && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setRows(prev => [...prev, { branch_id: "", quantity: "" }])}
                                            className="w-full md:w-auto"
                                        >
                                            <Plus className="size-4 mr-2" /> Agregar sucursal
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {(variant.stocks ?? []).length === 0 && (
                                        <p className="text-sm text-muted-foreground">Sin stock asignado</p>
                                    )}
                                    {variant.stocks?.map((stock, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                                            <span className="text-sm text-foreground">{branchNameById.get(stock.branch_id) ?? stock.branch?.name ?? `Sucursal ${stock.branch_id}`}</span>
                                            <span className="text-sm font-medium text-foreground">{stock.quantity} unidades</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export { VariantStockDisplay }
