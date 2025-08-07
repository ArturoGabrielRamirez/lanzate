"use client"

import { useStore } from "./store-provider"
import { cn } from "@/lib/utils"

type Props = {
    children: React.ReactNode
}

function ProductListContainer({ children }: Props) {

    const { displayType } = useStore()

    if (displayType === "list") {
        return (
            <div className={cn("flex flex-col gap-2 w-full", displayType === "list" && "flex-wrap")}>
                {children}
            </div>
        )
    }
    return (
        <div className={cn("grid grid-cols-2 @sm:grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-3", displayType === "grid" && "grid-cols-2")}>
            {children}
        </div>
    )
}
export default ProductListContainer
