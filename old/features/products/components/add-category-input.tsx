"use client"
import { InputTags } from "@/components/ui/tag-input"
import { useState } from "react"

function AddCategoryInput() {

    const [categories, setCategories] = useState<string[]>([])

    return (
        <InputTags value={categories} onChange={setCategories} />
    )
}
export default AddCategoryInput