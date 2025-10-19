import * as yup from "yup"

import { DashboardStore } from "@/features/dashboard/types"
import { basicInfoSchema } from "@/features/stores/schemas"

export type StoreCardProps = {
    userId: number
    store?: DashboardStore
    isEmpty?: boolean
}

export type NewStoreCardProps = {
    variant?: "empty" | "add-more"
}

export type BasicInfoFormType = yup.InferType<typeof basicInfoSchema>

export interface StoreHeaderServerProps {
    slug: string
}
