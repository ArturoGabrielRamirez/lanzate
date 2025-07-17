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

    return (
        <StoreContext.Provider value={{ displayType, setDisplayType }}>{children}</StoreContext.Provider>
    )
}

export default StoreProvider
