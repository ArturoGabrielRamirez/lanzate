"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "./store-provider"
import { useQueryState } from "nuqs"
import { useTranslations } from "next-intl"

function ProductAmountDisplay({ amount }: { amount: number }) {
    const { } = useStore()
    const [limit, setLimit] = useQueryState("limit", { shallow: false, clearOnDefault: true })
    const t = useTranslations("subdomain.sidebar.limit")

    const handleLimitChange = (value: string) => {
        setLimit(value)
    }

    return (
        <Select value={limit?.toString() || "10"} onValueChange={handleLimitChange}>
            <div className="flex items-center gap-2">
                <span>{t("1")}</span>
                <SelectTrigger>
                    <SelectValue placeholder="10" />
                </SelectTrigger>
                <span>{t("2")} {amount} {amount > 1 ? t("3") : t("4")}</span>
            </div>
            <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
            </SelectContent>
        </Select>
    )
}

export default ProductAmountDisplay
