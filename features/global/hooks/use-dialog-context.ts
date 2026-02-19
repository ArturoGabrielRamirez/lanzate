import { useContext } from "react"

import { DialogContext } from "@/features/global/contexts/dialog-context"

export const useDialogContext = () => useContext(DialogContext)
