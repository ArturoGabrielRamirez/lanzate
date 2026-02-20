import { useContext } from "react"

import { BaseCardContext } from "@/features/global/contexts/base-card-context"

export const useBaseCardContext = () => useContext(BaseCardContext)
