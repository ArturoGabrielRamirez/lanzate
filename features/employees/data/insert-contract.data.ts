"use server"

import randomstring from "randomstring"

import { formatSuccessResponse } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"
import { createServerSideClient } from "@/utils/supabase/server"

// ✅ Define el tipo del payload
type InsertContractPayload = {
    title: string
    comments?: string | null
    file: File[]
}

export async function insertContractData(
    payload: InsertContractPayload,
    storeId: number,
    userId: number
) {
    const supabase = createServerSideClient()

    // Usar transacción para asegurar consistencia
    const contract = await prisma.$transaction(async (tx) => {
        const store = await tx.store.findUnique({
            where: {
                id: storeId
            }
        })

        if (!store) throw new Error("Tienda no encontrada")

        // Si hay archivo PDF, subirlo primero antes de crear el contrato
        let fileUrl: string | null = null
        if (payload.file && payload.file.length > 0) {
            const file = payload.file[0]

            // Generar nombre único para el archivo
            const fileName = `${randomstring.generate(10)}`

            const { data, error } = await supabase.storage
                .from("contracts")
                .upload(fileName, file)

            if (error) throw new Error(`Error al subir el archivo: ${error.message}`)

            const { data: { publicUrl } } = supabase.storage
                .from("contracts")
                .getPublicUrl(data.path)

            fileUrl = publicUrl
        }

        if (!fileUrl) throw new Error("No se subió ningún archivo para el contrato")

        const contract = await tx.contract.create({
            data: {
                title: payload.title,
                file_url: fileUrl,
                comments: payload.comments || null,
                store_id: store.id,
                created_by: userId,
                status: 'PENDING',
            },
            include: {
                store: true,
                created_by_user: true,
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

        await prisma.socialActivity.create({
            data: {
                user_id: userId,
                activity_type: "CONTRACT_ASSIGNED",
                entity_type: "EMPLOYEE",
                entity_id: contract.id,
                title: `Contrato ${contract.title} asignado`,
                description: `Contrato ${contract.title} asignado a @${contract.responses[0].employee.user.username} (${contract.responses[0].employee.user.first_name} ${contract.responses[0].employee.user.last_name})`,
                store_id: store.id,
            }
        })

        return contract
    })

    return formatSuccessResponse("Contrato creado exitosamente", contract)
}