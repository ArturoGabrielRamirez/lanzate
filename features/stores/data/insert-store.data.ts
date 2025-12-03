"use server"

import { Prisma, Store } from '@prisma/client'
import randomstring from "randomstring"

import { ProcessedCreateStoreData } from '@/features/stores/types'
import { mapPaymentMethodType } from '@/features/stores/utils'
import { prisma } from "@/utils/prisma"

export async function insertStoreData(payload: ProcessedCreateStoreData, userId: number): Promise<{ message: string; payload: Store | null; hasError: boolean }> {

    //TODO : si la tienda es fisica o no ya no se guarda, hay que revisar eso. Tambien que se guarde como "medio de envio" si es fisica o no, algo como "pickup"
    // 1. Generate Slug
    const slug = randomstring.generate({ length: 8, charset: 'alphabetic', capitalization: 'lowercase' })

    // 2. Check Uniqueness
    const existingSlugStore = await prisma.store.findUnique({
        where: { slug: slug }
    })

    if (existingSlugStore) throw new Error("El identificador interno generado ya existe. Por favor intenta nuevamente.")

    const existingSubdomain = await prisma.store.findUnique({
        where: { subdomain: payload.basic_info.subdomain }
    })

    if (existingSubdomain) throw new Error(`El subdominio "${payload.basic_info.subdomain}" ya está en uso.`)

    // 3. Get Default Categories
    const defaultCategories = await prisma.category.findMany({
        where: { is_active: true },
        orderBy: { sort_order: 'asc' }
    })

    // 4. Execute Transaction
    try {
        const newStore = await prisma.$transaction(async (tx) => {

            // A. Create Store
            const store = await tx.store.create({
                data: {
                    name: payload.basic_info.name,
                    slug: slug,
                    subdomain: payload.basic_info.subdomain,
                    description: payload.basic_info.description,
                    logo: typeof payload.basic_info.logo === 'string' ? payload.basic_info.logo : null,
                    user_id: userId,
                    is_active: true,

                    // Init Balance
                    balance: {
                        create: { current_balance: 0 }
                    },

                    // Init Customization (Default)
                    customization: {
                        create: {
                            primary_color: "#000000",
                        }
                    },

                    // Init Default Categories
                    categories: {
                        create: defaultCategories.map(cat => ({
                            name: cat.name,
                            description: cat.description,
                            image: cat.image,
                            slug: cat.slug,
                            is_default: true,
                            sort_order: cat.sort_order,
                            is_active: cat.is_active
                        }))
                    }
                }
            })

            // B. Create Main Branch
            const mainBranchName = `${payload.basic_info.name} - sucursal principal`

            // Build branch data
            const branchData: Prisma.BranchCreateWithoutStoreInput = {
                name: mainBranchName,
                description: "Sucursal principal creada automáticamente",
                address: payload.address_info.address || null,
                city: payload.address_info.city || null,
                province: payload.address_info.province || null,
                country: payload.address_info.country || null,
                is_main: true,

                // Operational Settings
                operational_settings: {
                    create: {
                        is_open_24_hours: payload.settings?.is_open_24_hours ?? true
                    }
                },

                // Opening Hours
                opening_hours: {
                    create: payload.processedOpeningHours.map(oh => ({
                        day: oh.day,
                        start: oh.start,
                        end: oh.end
                    }))
                },

                // Shipping Methods
                shipping_methods: {
                    create: payload.processedShippingMethods.map(m => ({
                        provider: m.provider,
                        min_order_amount: m.min_order_amount,
                        free_shipping_min: m.free_shipping_min,
                        delivery_price: m.delivery_price,
                        active: m.active
                    }))
                },

                // Contact Info
                phones: payload.contact_info.phones && payload.contact_info.phones.length > 0
                    ? { create: payload.contact_info.phones.map(p => ({ number: p.phone, is_primary: p.is_primary, type: "mobile" })) }
                    : undefined,

                emails: payload.contact_info.emails && payload.contact_info.emails.length > 0
                    ? { create: payload.contact_info.emails.map(e => ({ email: e.email, is_primary: e.is_primary })) }
                    : undefined,

                social_media: payload.contact_info.social_media && payload.contact_info.social_media.length > 0
                    ? { create: payload.contact_info.social_media.map(s => ({ platform: "generic", url: s.url, is_primary: s.is_primary })) }
                    : undefined,

                // Payment Configs
                payment_configs: payload.payment_info?.payment_methods && payload.payment_info.payment_methods.length > 0
                    ? {
                        create: payload.payment_info.payment_methods.map((pm) => ({
                            type: mapPaymentMethodType(pm.type),
                            name: pm.name,
                            commission_percent: pm.commission_percent || 0,
                            commission_amount: pm.commission_amount || 0,
                            is_active: true,
                            details: {
                                cbu: pm.cbu_cvu,
                                alias: pm.alias,
                                instructions: pm.instructions
                            } as Prisma.InputJsonValue
                        }))
                    }
                    : undefined
            }

            await tx.branch.create({
                data: {
                    ...branchData,
                    store_id: store.id
                }
            })

            // C. Create Employee (Owner)
            await tx.employee.create({
                data: {
                    user_id: userId,
                    store_id: store.id,
                    role: "OWNER",
                    can_manage_store: true,
                    can_manage_employees: true,
                    can_view_reports: true,
                    can_create_orders: true,
                    can_update_orders: true,
                    can_create_products: true,
                    can_update_products: true,
                    can_manage_stock: true,
                    can_process_refunds: true,
                }
            })

            return store
        })

        return {
            message: "Tienda creada con éxito",
            payload: newStore,
            hasError: false
        }

    } catch (error: unknown) {
        console.error("Error creating store:", error)
        return {
            message: error instanceof Error ? error.message : "Hubo un error al crear la tienda",
            payload: null,
            hasError: true
        }
    }
}
