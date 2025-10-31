import type { EmployeeRole, Store, User } from "@prisma/client"
import type { AnyObjectSchema } from "yup"

// Tipos parciales para las relaciones
type EmployeeUser = Pick<User, 'id' | 'email' | 'first_name' | 'last_name' | 'avatar' | 'created_at'>
type EmployeeStore = Pick<Store, 'id' | 'name' | 'slug'>

// Tipos para el botón de crear empleado
export type CreateEmployeeButtonProps = {
    storeId: number
    userId: number
}

// Tipos para el botón de borrar empleado
export type DeleteEmployeeButtonProps = {
    employeeId: number
    slug: string
    userId: number
    onComplete?: () => void
}

// Tipos para el botón de editar empleado
export type EditEmployeeButtonProps = {
    employee: Employee
    slug: string
    userId: number
    onComplete?: () => void
}

// Tipos para la página de detalle del empleado
export type EmployeeDetailPageProps = {
    params: Promise<{ slug: string, id: string }>
}

// Tipos para la pestaña de empleados
export type EmployeesTabProps = {
    slug: string
    userId: number
}

// Tipos para la tabla de empleados - USA EL TIPO DE PRISMA CON RELACIONES PARCIALES
export type Employee = {
    id: number
    user_id: number
    store_id: number
    role: EmployeeRole
    can_create_orders: boolean
    can_update_orders: boolean
    can_create_products: boolean
    can_update_products: boolean
    can_manage_stock: boolean
    can_process_refunds: boolean
    can_view_reports: boolean
    can_manage_employees: boolean
    can_manage_store: boolean
    is_active: boolean
    hired_at: Date
    fired_at?: Date | null
    position?: string | null
    department?: string | null
    salary?: number | null
    notes?: string | null
    created_at: Date
    updated_at: Date
    user?: EmployeeUser  // Solo los campos que realmente usas
    store?: EmployeeStore  // Solo los campos que realmente usas
}

export type EmployeesTableProps = {
    data: Employee[]
    userId: number
    slug: string
    storeId: number
    employeePermissions: {
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
}

// Tipo para usuarios con estado de empleado
export type UserWithEmployeeStatus = {
    id: number
    email: string
    first_name: string | null
    last_name: string | null
    avatar: string | null
    created_at: Date
    isEmployee: boolean
    employeeData: {
        id: number
        role: string
        is_active: boolean
        hired_at: Date  // ✅ Cambiar de string a Date
    } | null
}

// Tipos para contratos
export type Contract = {
    id: number
    store_id: number
    title: string
    file_url: string
    comments?: string | null
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'EXPIRED'
    created_at: Date
    updated_at: Date
    created_by: number
    store?: Store
    created_by_user?: User
    assignments?: ContractAssignment[]
    responses?: ContractResponse[]
}

// Nuevo tipo para asignaciones de contratos
export type ContractAssignment = {
    id: number
    contract_id: number
    employee_id: number
    assigned_at: Date  // ✅ Cambiar de string a Date
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'EXPIRED'
    assigned_by: number
    contract?: Contract
    employee?: Employee
    assigned_by_user?: User
    responses?: ContractResponse[]
}

export type ContractResponse = {
    id: number
    contract_id: number
    employee_id: number
    assignment_id?: number | null
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'EXPIRED'
    comments?: string | null
    created_at: Date
    updated_at: Date
    contract?: Contract
    employee?: Employee
    assignment?: ContractAssignment | null
}

// Tipos para el botón de crear contrato
export type CreateContractButtonProps = {
    storeId: number
    userId: number
}

// Tipos para la tabla de contratos
export type ContractsTableProps = {
    data: Contract[]
    userId: number
    slug: string
    storeId: number
}

// Payload para editar empleado (centralizado)
export type EditEmployeePayload = {
    role: EmployeeRole
    position?: string
    department?: string
    salary?: string 
    notes?: string
    can_create_orders: boolean
    can_update_orders: boolean
    can_create_products: boolean
    can_update_products: boolean
    can_manage_stock: boolean
    can_process_refunds: boolean
    can_view_reports: boolean
    can_manage_employees: boolean
    can_manage_store: boolean
    is_active: boolean
}

// Permisos de empleado y retorno centralizado
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

export type GetEmployeePermissionsReturn = {
    message: string
    payload: EmployeePermissions | null
    error: boolean
}

// Props para el selector de contratos
export type ContractsSelectorProps = {
    storeId: number
    selectedContractId?: number | null
    onContractSelect: (contract: Contract | null) => void
    employeeId?: number
}

// Utilidad: Inferir valores de formulario de Yup
export type InferFormValues<T extends AnyObjectSchema> = T extends AnyObjectSchema
    ? ReturnType<T['cast']>
    : never

export type InsertContractPayload = {
    title: string
    comments?: string | null
    file: File[]
}