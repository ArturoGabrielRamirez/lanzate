"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function respondToContract(assignmentId: number, status: 'APPROVED' | 'REJECTED', comments?: string) {
    return actionWrapper(async () => {

        // Update the contract assignment status
        const assignment = await prisma.contractAssignment.update({
            where: {
                id: assignmentId
            },
            data: {
                status: status
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
                assigned_by_user: true
            }
        })

        // Create a response record
        const response = await prisma.contractResponse.create({
            data: {
                contract_id: assignment.contract_id,
                employee_id: assignment.employee_id,
                assignment_id: assignmentId,
                status: status,
                comments: comments || null
            },
            include: {
                contract: true,
                employee: {
                    include: {
                        user: true
                    }
                },
                assignment: true
            }
        })

        return {
            error: false,
            message: `Contract ${status.toLowerCase()} successfully`,
            payload: { assignment, response }
        }

    })
} 