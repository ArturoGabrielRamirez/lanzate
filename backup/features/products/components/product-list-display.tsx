"use client"

import { Grid2X2 } from "lucide-react"
import { List } from "lucide-react"
import { useState } from "react"

import { useStore } from "@/features/layout/components/public-store/store-provider"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"

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

export { ProductListDisplay }
