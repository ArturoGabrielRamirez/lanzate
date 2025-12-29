import * as yup from 'yup'

const employeeBaseSchema = {
    role: yup.string().oneOf(['OWNER', 'MANAGER', 'SUPERVISOR', 'EMPLOYEE', 'CASHIER', 'STOCKIST', 'SALES'], 'Rol inválido'),
    position: yup.string().max(100, 'El puesto debe tener menos de 100 caracteres'),
    department: yup.string().max(100, 'El departamento debe tener menos de 100 caracteres'),
    salary: yup.number().min(0, 'El salario debe ser mayor o igual a 0'),
    notes: yup.string().max(500, 'Las notas deben tener menos de 500 caracteres'),
    can_create_orders: yup.boolean(),
    can_update_orders: yup.boolean(),
    can_create_products: yup.boolean(),
    can_update_products: yup.boolean(),
    can_manage_stock: yup.boolean(),
    can_process_refunds: yup.boolean(),
    can_view_reports: yup.boolean(),
    can_manage_employees: yup.boolean(),
    can_manage_store: yup.boolean(),
    is_active: yup.boolean(),
}

export const contractCreateSchema = yup.object({
    title: yup.string().required('El título es obligatorio'),
    comments: yup.string().max(500, 'Los comentarios deben tener menos de 500 caracteres').optional(),
})

export const employeeUpdateSchema = yup.object({
    ...employeeBaseSchema,
}) 