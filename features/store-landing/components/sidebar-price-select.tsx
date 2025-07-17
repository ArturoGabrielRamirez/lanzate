"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryState } from "nuqs";

function SidebarOrderBySelect() {

    const [sort, setSort] = useQueryState("sort", { shallow: false, clearOnDefault: true })

    const handleChange = (value: string) => {
        setSort(value)
    }

    return (
        <Select defaultValue={sort || "price-asc"} onValueChange={handleChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low-High)</SelectItem>
                <SelectItem value="price-desc">Price (High-Low)</SelectItem>
                <SelectItem value="created-asc">Oldest</SelectItem>
                <SelectItem value="created-desc">Newest</SelectItem>
            </SelectContent>
        </Select>
    )
}
export default SidebarOrderBySelect
