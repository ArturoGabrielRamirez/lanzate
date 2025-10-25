import type { EmployeeRole } from "@prisma/client"
import type { AnyObjectSchema } from "yup"

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

// Tipos para la tabla de empleados
export type Employee = {
  id: number
  user_id: number
  store_id: number
  role: string
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
  hired_at: string
  fired_at?: string | null
  position?: string | null
  department?: string | null
  salary?: number | null
  notes?: string | null
  created_at: string
  updated_at: string
  user?: any // Puede ser extendido con los datos del usuario
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
    hired_at: string
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
  created_at: string | Date
  updated_at: string | Date
  created_by: number
  store?: any
  created_by_user?: any
  assignments?: ContractAssignment[]
  responses?: ContractResponse[]
}

// Nuevo tipo para asignaciones de contratos
export type ContractAssignment = {
  id: number
  contract_id: number
  employee_id: number
  assigned_at: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'EXPIRED'
  assigned_by: number
  contract?: Contract
  employee?: Employee
  assigned_by_user?: any
  responses?: ContractResponse[]
}

export type ContractResponse = {
  id: number
  contract_id: number
  employee_id: number
  assignment_id?: number | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'EXPIRED'
  comments?: string | null
  created_at: string | Date
  updated_at: string | Date
  contract?: Contract
  employee?: Employee
  assignment?: ContractAssignment
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
    position: string
    department: string
    salary: string
    notes: string
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


