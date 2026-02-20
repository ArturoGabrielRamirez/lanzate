import { createContext } from "react"

import type { BaseCardContextValue } from "@/features/global/types/base-card.types"

export const BaseCardContext = createContext<BaseCardContextValue>({
    variant: "default",
    size: "md",
    divided: false,
    layout: "column",
    columnGap: "none",
})
