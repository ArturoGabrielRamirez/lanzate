"use server"

import { prisma } from "@/utils/prisma"
import { EditContactData } from "../schemas/contact-schema"
import { revalidatePath } from "next/cache"

export async function updateStoreContact(storeId: number, data: EditContactData) {
    try {
        // Update the main branch with contact information
        await prisma.branch.updateMany({
            where: {
                store_id: storeId,
                is_main: true
            },
            data: {
                phone: data.contact_phone,
                email: data.contact_email
            }
        })

        revalidatePath(`/dashboard/stores/[slug]`, "page")

        return {
            message: "Contact information updated successfully",
            error: false,
            payload: data
        }
    } catch (error) {
        console.error("Error updating store contact:", error)
        return {
            message: "Failed to update contact information",
            error: true,
            payload: null
        }
    }
}
