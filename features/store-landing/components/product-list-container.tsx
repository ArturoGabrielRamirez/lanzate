"use client"

import { useStore } from "./store-provider"
import { cn } from "@/lib/utils"

type Props = {
    children: React.ReactNode
}

function ProductListContainer({ children }: Props) {

    const { displayType } = useStore()

    return (
        <div className={cn("grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-4 grow", displayType === "list" && "grid-cols-1")}>
            {children}
        </div>
    )
}
export default ProductListContainer
