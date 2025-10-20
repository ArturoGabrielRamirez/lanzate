"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"

import { Package } from "lucide-react"

import { ButtonWithPopup } from "@/features/layout/components"
import { Input } from "@/features/shadcn/components/ui/input"
import { Label } from "@/features/shadcn/components/ui/label"
import { Badge } from "@/features/shadcn/components/ui/badge"

import { distributeProductStock } from "@/features/products/data/distributeProductStock"
import { Branch, ProductStock } from "@prisma/client"

type Props = {
    productId: number
    productName: string
    availableStock: number
    branches: (Branch & { stock: ProductStock[] })[]
    variantStocks?: { branch_id: number; quantity: number }[]
}

export default function DistributeStockButton({
    productId,
    productName,
    availableStock,
    branches,
    variantStocks
}: Props) {
    const t = useTranslations("store.products-table")
    const [distributions, setDistributions] = useState<{ [branchId: number]: number }>({})
    const [totalDistributed, setTotalDistributed] = useState(0)

    // Initialize distributions with current stock values (prefer variant stocks if provided)
    useEffect(() => {
        const initialDistributions: { [branchId: number]: number } = {}

        if (variantStocks && variantStocks.length > 0) {
            variantStocks.forEach(s => {
                initialDistributions[s.branch_id] = s.quantity
            })
        } else {
            branches.forEach(branch => {
                const currentStock = branch.stock.find(stock => stock.product_id === productId)?.quantity || 0
                initialDistributions[branch.id] = currentStock
            })
        }

        setDistributions(initialDistributions)
    }, [branches, productId, variantStocks])

    useEffect(() => {
        const total = Object.values(distributions).reduce((sum, qty) => sum + (qty || 0), 0)
        setTotalDistributed(total)
    }, [distributions])

    const handleQuantityChange = (branchId: number, quantity: string) => {
        const qty = parseInt(quantity) || 0
        setDistributions(prev => ({
            ...prev,
            [branchId]: qty
        }))
    }

    const handleDistributeStock = async () => {
        const distributionArray = Object.entries(distributions)
            .filter(([, quantity]) => quantity > 0)
            .map(([branchId, quantity]) => ({
                branchId: parseInt(branchId),
                quantity
            }))

        return await distributeProductStock({
            productId,
            distributions: distributionArray
        })
    }

    const isValidDistribution = totalDistributed > 0 && totalDistributed <= availableStock

    return (
        <ButtonWithPopup
            text={
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    {t("actions.distribute-stock")}
                </div>
            }
            title={t("distribute-stock.title")}
            description={t("distribute-stock.description", { productName })}
            action={handleDistributeStock}
            messages={{
                success: t("distribute-stock.success"),
                error: t("distribute-stock.error"),
                loading: t("distribute-stock.loading")
            }}
            variant="ghost"
            className="w-full justify-start"
            formDisabled={!isValidDistribution}
        >
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        {t("distribute-stock.available-stock")}:
                    </span>
                    <Badge variant="outline">{availableStock}</Badge>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        {t("distribute-stock.total-to-distribute")}:
                    </span>
                    <Badge
                        variant={totalDistributed > availableStock ? "destructive" : "outline"}
                    >
                        {totalDistributed}
                    </Badge>
                </div>

                <div className="space-y-3">
                    <Label className="text-sm font-medium">
                        {t("distribute-stock.branch-distribution")}
                    </Label>

                    {branches.map((branch) => {
                        return (
                            <div key={branch.id} className="flex items-center gap-3">
                                <div className="flex-1">
                                    <Label htmlFor={`branch-${branch.id}`} className="text-sm">
                                        {branch.name}
                                        {branch.is_main && (
                                            <Badge variant="secondary" className="ml-2 text-xs">
                                                {t("distribute-stock.main-branch")}
                                            </Badge>
                                        )}
                                    </Label>
                                </div>
                                <div className="w-20">
                                    <Input
                                        id={`branch-${branch.id}`}
                                        type="number"
                                        min="0"
                                        max={availableStock}
                                        value={distributions[branch.id] || 0}
                                        onChange={(e) => handleQuantityChange(branch.id, e.target.value)}
                                        placeholder="0"
                                        className="text-center"
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {totalDistributed > availableStock && (
                    <div className="text-sm text-destructive">
                        {t("distribute-stock.error-exceeds-stock")}
                    </div>
                )}

                <div className="text-xs text-muted-foreground">
                    {t("distribute-stock.remaining-stock")}: {availableStock - totalDistributed}
                </div>
            </div>
        </ButtonWithPopup>
    )
}