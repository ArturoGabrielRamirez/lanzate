import { Branch } from "@/prisma/generated/prisma"

export type CreateBranchButtonProps = {
    storeId: number
    userId: number
}

export type EditBranchButtonProps = {
    branch: any
    slug: string
    userId: number
    onComplete?: () => void
}

export type DeleteBranchButtonProps = {
    branchId: number
    slug: string
    userId: number
    onComplete?: () => void
}

// Tipos para la página de detalle de sucursal
export type BranchDetailPageProps = {
    params: Promise<{ slug: string, id: string }>
}