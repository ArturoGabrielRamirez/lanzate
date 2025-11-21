"use server"

import { prisma } from "@/utils/prisma"

export async function assignContractToEmployeeData(contractId: number, employeeId: number, assignedBy: number) {

    const result = await prisma.contractAssignment.create({
        data: {
            contract_id: contractId,
            employee_id: employeeId,
            assigned_by: assignedBy,
            status: 'PENDING'
        },
        include: {
            contract: {
                include: {
                    store: true,
                    created_by_user: true
                }
            },
            employee: {
                include: {
                    user: true
                }
            },
            assigned_by_user: true,
            responses: {
                include: {
                    employee: {
                        include: {
                            user: true
                        }
                    }
                }
            }
        }
    })

    return {
        message: "Contrato asignado exitosamente",
        payload: result,
        hasError: false
    }

} 