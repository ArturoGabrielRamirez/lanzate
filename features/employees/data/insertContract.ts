"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { createServerSideClient } from "@/utils/supabase/server"
import { prisma } from "@/utils/prisma"
import randomstring from "randomstring"

export async function insertContract(payload: any, storeId: number, userId: number) {
    return actionWrapper(async () => {

        /* const client = new PrismaClient() */
        const supabase = createServerSideClient()


        // Usar transacción para asegurar consistencia
        const contract = await prisma.$transaction(async (tx) => {

            const store = await tx.store.findUnique({
                where: {
                    id: storeId
                }
            })

            if (!store) throw new Error("Store not found")

            // Si hay archivo PDF, subirlo primero antes de crear el contrato
            let fileUrl: string | null = null
            if (payload.file && payload.file.length > 0) {
                const file = payload.file[0]

                // Generar nombre único para el archivo
                const fileName = `${randomstring.generate(10)}`

                const { data, error } = await supabase.storage
                    .from("contracts")
                    .upload(fileName, file)

                if (error) throw new Error(`Error uploading file: ${error.message}`)

                const { data: { publicUrl } } = supabase.storage
                    .from("contracts")
                    .getPublicUrl(data.path)

                fileUrl = publicUrl
            }

            if (!fileUrl) throw new Error("No file uploaded")

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
                    title: `Contract ${contract.title} assigned`,
                    description: `Contract ${contract.title} assigned to @${contract.responses[0].employee.user.username}`,
                    store_id: store.id,
                }
            })

            return contract
        })

        return {
            error: false,
            message: "Contract created successfully",
            payload: contract
        }

    })
} 