"use client"

import { useState } from "react"

import { HorizontalPanelsProps } from "@/features/orders/types"
import { cn } from "@/lib/utils"

function HorizontalPanels({ leftPanel, rightPanel }: HorizontalPanelsProps) {

    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false)

    const handleOpenLeftPanel = () => {
        setIsLeftPanelOpen(true)
    }

    const handleOpenRightPanel = () => {
        setIsLeftPanelOpen(false)
    }

    return (
        <div className="flex w-full bg-background rounded-lg p-4">
            <div
                className={cn("w-1/2 bg-red-500", isLeftPanelOpen && "w-1/4")}
                onClick={handleOpenLeftPanel}
            >
                {leftPanel}
            </div>
            <div
                className={cn("w-1/2 bg-blue-500", !isLeftPanelOpen && "w-1/4")}
                onClick={handleOpenRightPanel}
            >
                {rightPanel}
            </div>
        </div>
    )
}

export { HorizontalPanels }