"use client"

import { Grid2X2 } from "lucide-react"
import { useStore } from "../../layout/components/public-store/store-provider"
import { List } from "lucide-react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { useState } from "react"

function ProductListDisplay() {

    const [isActive, setIsActive] = useState(false)
    const { setDisplayType, displayType } = useStore()

    const handleToggle = () => {
        setIsActive(!isActive)

        setDisplayType(displayType === "grid" ? "list" : "grid")

        setTimeout(() => {
            setIsActive(false)
        }, 500)
    }

    return (
        <div className="flex gap-2">
            <IconButton
                icon={displayType === "grid" ? Grid2X2 : List}
                active={isActive}
                onClick={handleToggle}
            />
        </div>
    )
}

export default ProductListDisplay
