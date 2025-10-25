"use server"

import { EditEmployeePayload } from "@/features/employees/types/types"
import { prisma } from "@/utils/prisma"


export async function updateEmployeeData(employeeId: number, data: EditEmployeePayload) {
    const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    first_name: true,
                    last_name: true
                }
            }
        }
    })

    if (!employee) throw new Error("Employee not found")

    const updatedEmployee = await prisma.employee.update({
        where: { id: employeeId },
        data: {
            role: data.role,
            position: data.position,
            department: data.department,
            salary: data.salary ? parseFloat(data.salary) : null,
            notes: data.notes,
            can_create_orders: data.can_create_orders === true,
            can_update_orders: data.can_update_orders === true,
            can_create_products: data.can_create_products === true,
            can_update_products: data.can_update_products === true,
            can_manage_stock: data.can_manage_stock === true,
            can_process_refunds: data.can_process_refunds === true,
            can_view_reports: data.can_view_reports === true,
            can_manage_employees: data.can_manage_employees === true,
            can_manage_store: data.can_manage_store === true,
            is_active: data.is_active === true,
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    first_name: true,
                    last_name: true
                }
            }
        }
    })

    return {
        message: "Employee updated successfully",
        payload: updatedEmployee,
        hasError: false
    }
} 