"use client"

import { createContext, useContext, useState } from "react"
import { StoreContextType } from "../types"

const StoreContext = createContext<StoreContextType>({
    displayType: "grid",
    setDisplayType: () => { }
})

type Props = {
    children: React.ReactNode
}

export const useStore = () => useContext(StoreContext)

function StoreProvider({ children }: Props) {

    const [displayType, setDisplayType] = useState<"grid" | "list">("grid")
    const [amount, setAmount] = useState(10)
    const [page, setPage] = useState(1)
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(10)

    const contextValue = {
        displayType,
        setDisplayType,
        amount,
        setAmount,
        page,
        setPage,
        offset,
        setOffset,
        limit,
        setLimit
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreProvider
