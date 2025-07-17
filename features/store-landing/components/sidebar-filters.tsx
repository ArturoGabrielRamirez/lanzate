import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SidebarCategorySelect from "./sidebar-category-select";
import SidebarOrderBySelect from "./sidebar-price-select";
import SidebarSearchInput from "./sidebar-search-input";
import SidebarPriceRange from "./sidebar-price-range";

function SidebarFilters() {
    return (
        <div className="flex flex-col gap-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <SidebarSearchInput />
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Sort by</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <SidebarOrderBySelect />
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <SidebarCategorySelect />
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Price Range</CardTitle>
                </CardHeader>
                <CardContent>
                    <SidebarPriceRange />
                </CardContent>
            </Card>
        </div>
    )
}
export default SidebarFilters