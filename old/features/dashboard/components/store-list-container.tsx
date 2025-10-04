"use client"

import { useMedia } from "react-use"

type Props = {
    children: React.ReactNode
}

const StoreListContainer = ({ children }: Props) => {

    const isMd = useMedia("(min-width: 768px)")

    if (!isMd) return null

    return children
}
export default StoreListContainer