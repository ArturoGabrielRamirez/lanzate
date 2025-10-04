import * as yup from 'yup'

const employeeBaseSchema = {
    role: yup.string().oneOf(['OWNER', 'MANAGER', 'SUPERVISOR', 'EMPLOYEE', 'CASHIER', 'STOCKIST', 'SALES'], 'Invalid role'),
    position: yup.string().max(100, 'Position must be less than 100 characters long'),
    department: yup.string().max(100, 'Department must be less than 100 characters long'),
    salary: yup.number().min(0, 'Salary must be greater than or equal to 0'),
    notes: yup.string().max(500, 'Notes must be less than 500 characters long'),
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
    title: yup.string().required('Title is required'),
    comments: yup.string().max(500, 'Comments must be less than 500 characters long').optional(),
})

export const employeeUpdateSchema = yup.object({
    ...employeeBaseSchema,
}) 