"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"

export async function selectUsersByFilter(filter: string, storeId: number) {
    return actionWrapper(async () => {
        
        const client = new PrismaClient()

        const users = await client.user.findMany({
            where: {
                OR: [
                    {
                        email: {
                            contains: filter,
                            mode: 'insensitive'
                        }
                    },
                    {
                        first_name: {
                            contains: filter,
                            mode: 'insensitive'
                        }
                    },
                    {
                        last_name: {
                            contains: filter,
                            mode: 'insensitive'
                        }
                    }
                ],
            },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                avatar: true,
                created_at: true,
                Employee: {
                    where: {
                        store_id: storeId
                    },
                    select: {
                        id: true,
                        role: true,
                        is_active: true,
                        hired_at: true
                    }
                }
            },
            take: 10 // Limit results to 10 users
        })

        // Transform the data to include employee status
        const usersWithEmployeeStatus = users.map(user => ({
            ...user,
            isEmployee: user.Employee.length > 0,
            employeeData: user.Employee[0] || null
        }))

        return {
            message: "Users fetched successfully",
            payload: usersWithEmployeeStatus,
            error: false
        }
    })
} 