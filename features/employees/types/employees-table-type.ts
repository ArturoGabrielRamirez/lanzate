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

export type Props = {
    data: Employee[]
    userId: number
    slug: string
    storeId: number
} 