"use client"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { Pencil } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RowModel } from "@tanstack/react-table"
import { getCategories } from "@/features/store-landing/actions/getCategories"
import { formatErrorResponse } from "@/utils/lib"
import { Product } from "@prisma/client"
import { Category } from "@/features/store-landing/types"

type UpdatePricesButtonProps = {
    selectedRows: RowModel<Product & { categories: Category[] }>
    storeId: number
}

type UpdateType = "fijo" | "porcentaje"

export function UpdatePricesButton({ selectedRows }: UpdatePricesButtonProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [updateType, setUpdateType] = useState<UpdateType>("fijo")
    const [productsInCategory, setProductsInCategory] = useState<number>(0)
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
        // TODO: Fetch products count for selected category
        // This would need a new action to get products count by category
        if (selectedCategory) {
            // Placeholder - replace with actual API call
            setProductsInCategory(10) // Mock data
        } else {
            setProductsInCategory(0)
        }
    }, [selectedCategory])

    const handleSave = async () => {
        // TODO: Implement price update logic
        console.log("Updating prices:", {
            selectedRows: hasSelectedRows ? selectedRows.rows.length : 0,
            category: selectedCategory,
            amount,
            updateType
        })
        
        return formatErrorResponse("Success", null, { success: true })
    }

    const renderContent = () => {
        if (hasSelectedRows) {
            return (
                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        {t("selected-products", { count: selectedRows.rows.length })}
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
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
                        <div className="space-y-2">
                            <Label htmlFor="update-type">{t("update-type")}</Label>
                            <Select value={updateType} onValueChange={(value: UpdateType) => setUpdateType(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fijo">{t("fixed")}</SelectItem>
                                    <SelectItem value="porcentaje">{t("percentage")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleSave} className="w-full">
                            {t("save")}
                        </Button>
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
                            <SelectTrigger>
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
                    {selectedCategory && productsInCategory > 0 && (
                        <>
                            <div className="text-sm text-muted-foreground">
                                {t("products-in-category", { count: productsInCategory })}
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
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
                                <div className="space-y-2">
                                    <Label htmlFor="update-type">{t("update-type")}</Label>
                                    <Select value={updateType} onValueChange={(value: UpdateType) => setUpdateType(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fijo">{t("fixed")}</SelectItem>
                                            <SelectItem value="porcentaje">{t("percentage")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleSave} className="w-full">
                                    {t("save")}
                                </Button>
                            </div>
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