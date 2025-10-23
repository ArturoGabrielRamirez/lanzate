"use client"

import { Category } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"

import { Label } from "@/features/shadcn/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { getProductsCountByCategoryAction } from "@/features/products/actions/get-products-count-by-category.action"
import { updateProductsPricesAction } from "@/features/products/actions/update-products-prices.action"
import { getCategoriesAction } from "@/features/stores/actions/get-categories.action"
import { UpdatePricesButtonProps, PriceUpdateType } from "@/features/stores/types"
import { formatErrorResponse } from "@/utils/lib"

function UpdatePricesButton({ selectedRows, storeId }: UpdatePricesButtonProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [updateType, setUpdateType] = useState<PriceUpdateType>("fijo")
    const [productsInCategory, setProductsInCategory] = useState<number>(0)
    const [isLoadingCount, setIsLoadingCount] = useState(false)
    const t = useTranslations("store.update-prices")

    const hasSelectedRows = selectedRows.rows.length > 0

    useEffect(() => {
        const fetchCategories = async () => {
            const { payload, error } = await getCategoriesAction()
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
                updateType: PriceUpdateType
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
                            <Select value={updateType} onValueChange={(value: PriceUpdateType) => setUpdateType(value)}>
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
                                        <Select value={updateType} onValueChange={(value: PriceUpdateType) => setUpdateType(value)}>
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
                    {/* <Pencil className="size-4" /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                        <path fill="currentColor" d="M6.5 14.975v-1H4v-2h5v-2H5q-.425 0-.712-.287T4 8.975v-4q0-.425.288-.712T5 3.975h1.5v-1h2v1H11v2H6v2h4q.425 0 .713.288t.287.712v4q0 .425-.288.713t-.712.287H8.5v1zm7.45 6l-4.25-4.25l1.4-1.4l2.85 2.85l5.65-5.65l1.4 1.4z"></path>
                    </svg>
                    {/* <span className="hidden md:block">{t("button")}</span> */}
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
            onlyIcon
        >
            {renderContent()}
        </ButtonWithPopup>
    )
} 

export { UpdatePricesButton }