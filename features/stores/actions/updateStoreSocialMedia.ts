"use server"

import { prisma } from "@/utils/prisma"
import { EditSocialMediaData } from "../schemas/social-media-schema"
import { revalidatePath } from "next/cache"

export async function updateStoreSocialMedia(storeId: number, data: EditSocialMediaData) {
    try {
        // Update the store's operational settings with social media information

        const store = await prisma.store.update({
            where: {
                id: storeId
            },
            data: {
                facebook_url: data.facebook_url || null,
                instagram_url: data.instagram_url || null,
                x_url: data.x_url || null,
            }
        })

        revalidatePath(`/stores/${store.slug}`, "page")

        return {
            message: "Social media information updated successfully",
            error: false,
            payload: data
        }
    } catch (error) {
        console.error("Error updating store social media:", error)
        return {
            message: "Failed to update social media information",
            error: true,
            payload: null
        }
    }
}
