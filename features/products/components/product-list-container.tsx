"use client"

import { useStore } from "../../layout/components/public-store/store-provider"
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
        <div className={cn("grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 grow", displayType === "grid" && "grid-cols-2")}>
            {children}
        </div>
    )
}
export default ProductListContainer
