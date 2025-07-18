"use client"

import { Grid2X2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "./store-provider"
import { List } from "lucide-react"
import { cn } from "@/lib/utils"

function ProductListDisplay() {

    const { setDisplayType, displayType } = useStore()

    const handleDisplayTypeChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        const displayType = e.currentTarget.dataset.type
        if (displayType) {
            setDisplayType(displayType as "grid" | "list")
        }
    }

    return (
        <div className="flex gap-2">
            <Button variant="outline" data-type="grid" onClick={handleDisplayTypeChange} className={cn(displayType === "grid" && "!bg-primary !text-primary-foreground")}>
                <Grid2X2 />
            </Button>
            <Button variant="outline" data-type="list" onClick={handleDisplayTypeChange} className={cn(displayType === "list" && "!bg-primary !text-primary-foreground")}>
                <List />
            </Button>
        </div>
    )
}

export default ProductListDisplay
