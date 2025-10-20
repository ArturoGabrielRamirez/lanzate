"use client"

import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select";

function SidebarOrderBySelect() {

    const t = useTranslations("subdomain.sidebar.order-by");

    const [sort, setSort] = useQueryState("sort", { shallow: false, clearOnDefault: true })

    const handleChange = (value: string) => {
        setSort(value)
    }

    return (
        <Select defaultValue={sort || "price-asc"} onValueChange={handleChange}>
            <SelectTrigger className="w-full max-w-52 rounded-none" size="sm">
                <SelectValue placeholder={t("select-a-product")} />
            </SelectTrigger>
            <SelectContent className="rounded-none">
                <SelectItem value="name-asc">{t("name-ascending")}</SelectItem>
                <SelectItem value="name-desc">{t("name-descending")}</SelectItem>
                <SelectItem value="price-asc">{t("price-ascending")}</SelectItem>
                <SelectItem value="price-desc">{t("price-descending")}</SelectItem>
                <SelectItem value="created-asc">{t("oldest")}</SelectItem>
                <SelectItem value="created-desc">{t("newest")}</SelectItem>
            </SelectContent>
        </Select>
    )
}
export default SidebarOrderBySelect
