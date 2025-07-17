"use client"
import CategorySelect from "./category-select-"
import { useQueryState } from "nuqs"

function SidebarCategorySelect() {

    const [category, setCategory] = useQueryState("category", { shallow: false, clearOnDefault: true })

    const handleChange = (value: { label: string, value: number }[]) => {
        if (value.length === 0) {
            setCategory(null)
        } else {
            setCategory(value.map(v => v.value).join(","))
        }
    }

    const defaultValue = category ? category.split(",").map(v => ({ label: v, value: v })) : []

    
    return (
        <CategorySelect withLabel={false} onChange={handleChange} defaultValue={defaultValue} />
    )
}
export default SidebarCategorySelect