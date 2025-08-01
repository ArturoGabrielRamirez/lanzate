"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function assignContractToEmployee(contractId: number, employeeId: number, assignedBy: number) {
    return actionWrapper(async () => {

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
            error: false,
            message: "Contract assigned successfully",
            payload: result
        }

    })
} 