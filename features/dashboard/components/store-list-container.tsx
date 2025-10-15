"use client"

import { useMedia } from "react-use"

type Props = {
    children: React.ReactNode
}

function StoreListContainer({ children }: R) {

    const isMd = useMedia("(min-width: 768px)")

    if (!isMd) return null

    return children
}


export { StoreListContainer }