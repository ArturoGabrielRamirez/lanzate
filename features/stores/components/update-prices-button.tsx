"use client"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { Pencil } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RowModel } from "@tanstack/react-table"
import { getCategories } from "@/features/store-landing/actions/getCategories"
import { getProductsCountByCategoryAction } from "@/features/products/actions/getProductsCountByCategory"
import { updateProductsPricesAction } from "@/features/products/actions/updateProductsPrices"
import { formatErrorResponse } from "@/utils/lib"
import { Product } from "@prisma/client"
import { Category } from "@/features/store-landing/types"

type UpdatePricesButtonProps = {
    selectedRows: RowModel<Product & { categories: Category[] }>
    storeId: number
}

type UpdateType = "fijo" | "porcentaje"

export function UpdatePricesButton({ selectedRows, storeId }: UpdatePricesButtonProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [updateType, setUpdateType] = useState<UpdateType>("fijo")
    const [productsInCategory, setProductsInCategory] = useState<number>(0)
    const [isLoadingCount, setIsLoadingCount] = useState(false)
    const t = useTranslations("store.update-prices")

    const hasSelectedRows = selectedRows.rows.length > 0

    useEffect(() => {
        const fetchCategories = async () => {
            const { payload, error } = await getCategories()
            if (!error && payload) {
                setCategories(payload)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        const fetchProductsCount = async () => {
            if (selectedCategory) {
                setIsLoadingCount(true)
                try {
                    const { payload, error } = await getProductsCountByCategoryAction(
                        parseInt(selectedCategory),
                        storeId
                    )
                    if (!error && payload !== null) {
                        setProductsInCategory(payload)
                    } else {
                        setProductsInCategory(0)
                    }
                } catch (error) {
                    console.error("Error fetching products count:", error)
                    setProductsInCategory(0)
                } finally {
                    setIsLoadingCount(false)
                }
            } else {
                setProductsInCategory(0)
            }
        }

        fetchProductsCount()
    }, [selectedCategory, storeId])

    const handleSave = async () => {
        try {
            // Validate amount
            const numericAmount = parseFloat(amount)
            if (isNaN(numericAmount) || numericAmount <= 0) {
                throw new Error("Por favor ingresa un monto válido mayor a 0")
            }

            // Prepare payload based on selection type
            let payload: {
                storeId: number
                amount: number
                updateType: UpdateType
                productIds?: number[]
                categoryId?: number
            }

            if (hasSelectedRows) {
                // Update selected products
                const productIds = selectedRows.rows.map(row => row.original.id)
                payload = {
                    storeId,
                    amount: numericAmount,
                    updateType,
                    productIds
                }
            } else if (selectedCategory) {
                // Update products by category
                payload = {
                    storeId,
                    amount: numericAmount,
                    updateType,
                    categoryId: parseInt(selectedCategory)
                }
            } else {
                throw new Error("Debe seleccionar productos o una categoría")
            }

            console.log("Updating prices with payload:", payload)

            const { error, message, payload: result } = await updateProductsPricesAction(payload)

            if (error) {
                throw new Error(message)
            }

            return {
                error: false,
                message: `${t("messages.success")} - ${result?.updatedCount || 0} productos actualizados`,
                payload: result
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t("messages.error")
            return formatErrorResponse(errorMessage, error, null)
        }
    }

    const renderContent = () => {
        if (hasSelectedRows) {
            return (
                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        {t("selected-products", { count: selectedRows.rows.length })}
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full flex flex-col gap-1">
                            <Label htmlFor="amount">{t("amount")}</Label>
                            <InputField
                                name="amount"
                                label=""
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder={t("amount-placeholder")}
                            />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <Label htmlFor="update-type">{t("update-type")}</Label>
                            <Select value={updateType} onValueChange={(value: UpdateType) => setUpdateType(value)}>
                                <SelectTrigger className="w-full min-h-10 mb-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fijo">{t("fixed")}</SelectItem>
                                    <SelectItem value="porcentaje">{t("percentage")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                    {t("no-selection-disclaimer")}
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">{t("select-category")}</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t("choose-category")} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedCategory && (
                        <>
                            <div className="text-sm text-muted-foreground">
                                {isLoadingCount ? (
                                    "Cargando productos..."
                                ) : (
                                    t("products-in-category", { count: productsInCategory })
                                )}
                            </div>
                            {productsInCategory > 0 && (
                                <div className="flex gap-2 items-end">
                                    <div className="w-full flex flex-col gap-1">
                                        <Label htmlFor="amount">{t("amount")}</Label>
                                        <InputField
                                            name="amount"
                                            label=""
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder={t("amount-placeholder")}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <Label htmlFor="update-type">{t("update-type")}</Label>
                                        <Select value={updateType} onValueChange={(value: UpdateType) => setUpdateType(value)}>
                                            <SelectTrigger className="w-full mb-0 min-h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fijo">{t("fixed")}</SelectItem>
                                                <SelectItem value="porcentaje">{t("percentage")}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        )
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Pencil className="size-4" />
                    <span className="hidden md:block">{t("button")}</span>
                </>
            )}
            title={t("title")}
            description={t("description")}
            action={handleSave}
            onComplete={() => {
                setAmount("")
                setSelectedCategory("")
                setUpdateType("fijo")
            }}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
            className="justify-start"
        >
            {renderContent()}
        </ButtonWithPopup>
    )
} 