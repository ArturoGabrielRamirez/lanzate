"use client"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Settings2 } from "lucide-react"

const FiltersIcon = () => {
    return (
        <IconButton
            icon={Settings2}
            className="md:hidden"
        />
    )
}
export default FiltersIcon