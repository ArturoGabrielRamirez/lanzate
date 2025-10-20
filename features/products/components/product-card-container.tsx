"use client"

import { useStore } from "../../layout/components/public-store/store-provider"

type Props = {
    listCard: React.ReactNode
    gridCard: React.ReactNode
}

function ProductCardContainer({ listCard, gridCard }: Props) {
    const { displayType } = useStore()

    if (displayType === "list") {
        return <>{listCard}</>
    }

    return <>{gridCard}</>
}

export default ProductCardContainer 