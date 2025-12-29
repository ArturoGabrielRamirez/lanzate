import { Branch } from "@prisma/client"//TODO: No se si es esta.

export type CreateBranchButtonProps = {
    storeId: number
    userId: number
}

export type EditBranchButtonProps = {
    branch: Branch
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

export interface CreateBranchAction {
    payload: {
        name: string
        address: string
        email: string
        phone: string
    }
    storeId: number
    userId: number
}

export interface DeleteBranchAction {
    branchId: number
    slug: string
    userId: number
}

export interface EditBranchAction {
    branchId: number
    data: {
        name: string
        description?: string
        address: string
        email: string
        phone: string
        is_main: boolean
    }
    slug: string
    userId: number
}

export type AccordionTriggerProps = {
    keys: string[]
    completeKeys?: string[]
    children: React.ReactNode
}

export type EmployeePermissions = {
    isAdmin: boolean
    permissions?: {
        can_create_orders: boolean
        can_update_orders: boolean
        can_create_products: boolean
        can_update_products: boolean
        can_manage_stock: boolean
        can_process_refunds: boolean
        can_view_reports: boolean
        can_manage_employees: boolean
        can_manage_store: boolean
    }
}

export type BranchTableProps = {
    branches: Branch[]
    storeId: number
    userId: number
    slug: string
    employeePermissions: EmployeePermissions
}

export type DeleteBranchDataProps = {
    branchId: number
}

export interface InsertBranchProps {
    name: string
    address: string
    email: string
    phone: string
    storeId: number
}

export interface SelectBranchByIdProps {
    id: number
}

export interface UpdateBranchProps {
    branchId: number
    data: {
        name: string
        description?: string
        address: string
        email: string
        phone: string
        is_main: boolean
    }
}