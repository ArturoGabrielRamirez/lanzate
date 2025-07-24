"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

function SidebarOrderBySelect() {

    const t = useTranslations("subdomain.sidebar.order-by");

    const [sort, setSort] = useQueryState("sort", { shallow: false, clearOnDefault: true })

    const handleChange = (value: string) => {
        setSort(value)
    }

    return (
        <Select defaultValue={sort || "price-asc"} onValueChange={handleChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={t("select-a-product")} />
            </SelectTrigger>
            <SelectContent>
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
