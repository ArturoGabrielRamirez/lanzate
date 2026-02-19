import { createContext } from "react"

import { DialogContextValue } from "@/features/global/types/dialog.types"


export const DialogContext = createContext<DialogContextValue>({
    responsive: "default",
    isMobile: false,
})
