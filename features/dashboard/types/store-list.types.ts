import { StoreCardProps } from "@/features/stores/types"

export interface StoreListProps {
    stores: StoreCardProps['store'][]
    userId: number
}
