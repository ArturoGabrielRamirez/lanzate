"use client"
import CategorySelect from "./category-select-"
import { useQueryState } from "nuqs"
import { useEffect, useState } from "react"
import { getStoreIdBySubdomain } from "@/features/categories/data/getStoreIdBySubdomain"
import { useParams } from "next/navigation"

function SidebarCategorySelect() {

    const [category, setCategory] = useQueryState("category", { shallow: false, clearOnDefault: true })
    const [storeId, setStoreId] = useState<number | null>(null)
    const params = useParams()
    const subdomain = params.subdomain as string
    
    // Obtener el storeId a partir del subdomain
    useEffect(() => {
        const fetchStoreId = async () => {
            const { payload, error } = await getStoreIdBySubdomain(subdomain)
            if (!error && payload) {
                setStoreId(payload)
            }
        }
        if (subdomain) {
            fetchStoreId()
        }
    }, [subdomain])

    const handleChange = (value: { label: string, value: string }[]) => {
        if (value.length === 0) {
            setCategory(null)
        } else {
            setCategory(value.map(v => v.value).join(","))
        }
    }

    const defaultValue = category ? category.split(",").map(v => ({ label: v, value: v })) : []

    return (
        <CategorySelect 
            withLabel={false} 
            onChange={handleChange} 
            defaultValue={defaultValue} 
            storeId={storeId || undefined}
        />
    )
}
export default SidebarCategorySelect