import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SidebarCategorySelect from "./sidebar-category-select";
import SidebarOrderBySelect from "./sidebar-price-select";
import SidebarSearchInput from "./sidebar-search-input";
import SidebarPriceRange from "./sidebar-price-range";
import { getTranslations } from "next-intl/server";

async function SidebarFilters() {

    const t = await getTranslations("subdomain.sidebar.filters");

    return (
        <div className="flex flex-col gap-4">
            <div className="md:hidden">
                <SidebarSearchInput />
            </div>
            <Card className="w-full bg-[var(--filter-background)] text-[var(--filter-text)] max-lg:hidden [display:var(--show-searchbar-filter)!important]">
                <CardHeader>
                    <CardTitle>{t("search")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <SidebarSearchInput />
                </CardContent>
            </Card>
            <Card className="w-full bg-[var(--filter-background)] text-[var(--filter-text)] max-lg:hidden lg:block [display:var(--show-sorting-filter)!important]">
                <CardHeader>
                    <CardTitle>{t("sort-by")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <SidebarOrderBySelect />
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full bg-[var(--filter-background)] text-[var(--filter-text)] max-lg:hidden lg:block [display:var(--show-categories-filter)!important]">
                <CardHeader>
                    <CardTitle>{t("categories")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <SidebarCategorySelect />
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full bg-[var(--filter-background)] text-[var(--filter-text)] max-lg:hidden lg:block [display:var(--show-price-filter)!important]">
                <CardHeader>
                    <CardTitle>{t("price-range")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <SidebarPriceRange />
                </CardContent>
            </Card>
        </div>
    )
}
export default SidebarFilters