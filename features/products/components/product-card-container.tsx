"use client"

import { useStore } from "@/features/layout/components/public-store/store-provider"
import type { ProductCardContainerProps } from "@/features/products/types"

function ProductCardContainer({ listCard, gridCard }: ProductCardContainerProps) {
    const { displayType } = useStore()

    if (displayType === "list") {
        return <>{listCard}</>
    }

    return <>{gridCard}</>
}

export { ProductCardContainer } 