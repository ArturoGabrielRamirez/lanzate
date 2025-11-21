"use server"

import { prisma } from "@/utils/prisma"


export async function selectUsersByFilterData(filter: string, storeId: number, userId: number) {
    const users = await prisma.user.findMany({
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
            Store: {
                none: {
                    user_id: userId
                }
            }
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
        message: "Usuarios recuperados exitosamente",
        payload: usersWithEmployeeStatus,
        hasError: false
    }
} 