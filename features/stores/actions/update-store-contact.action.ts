"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { ContactInfoFormType } from "@/features/stores/schemas"
import { prisma } from "@/utils/prisma"

function getPlatformFromUrl(url: string): string {
    try {
        const urlObj = new URL(url)
        const hostname = urlObj.hostname.toLowerCase()
        if (hostname.includes("facebook")) return "facebook"
        if (hostname.includes("instagram")) return "instagram"
        if (hostname.includes("twitter") || hostname.includes("x.com")) return "x"
        if (hostname.includes("tiktok")) return "tiktok"
        if (hostname.includes("linkedin")) return "linkedin"
        return "other"
    } catch {
        return "other"
    }
}

export async function updateStoreContactAction(slug: string, data: ContactInfoFormType) {
    return actionWrapper(async () => {

        const store = await prisma.store.findUnique({
            where: { slug },
            select: { id: true }
        })

        if (!store) {
            throw new Error("Tienda no encontrada")
        }

        const mainBranch = await prisma.branch.findFirst({
            where: {
                store_id: store.id,
                is_main: true
            }
        })

        if (!mainBranch) {
            throw new Error("Sucursal principal no encontrada")
        }

        await prisma.branch.update({
            where: {
                id: mainBranch.id
            },
            data: {
                phones: {
                    deleteMany: {},
                    create: data.contact_info?.phones?.map(phone => ({
                        number: phone.phone,
                        is_primary: phone.is_primary,
                        type: "mobile" // Default for now
                    })) || []
                },
                emails: {
                    deleteMany: {},
                    create: data.contact_info?.emails?.map(email => ({
                        email: email.email,
                        is_primary: email.is_primary,
                        type: "contact" // Default for now
                    })) || []
                },
                social_media: {
                    deleteMany: {},
                    create: data.contact_info?.social_media?.map(social => ({
                        url: social.url,
                        platform: getPlatformFromUrl(social.url),
                        is_primary: social.is_primary
                    })) || []
                }
            }
        })

        revalidatePath(`/stores/${slug}`, "page")

        return {
            message: "Información de contacto actualizada con éxito",
            hasError: false,
            payload: null
        }
    })
}
