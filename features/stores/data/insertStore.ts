"use server"

import { /* PrismaClient, */ Store, PaymentMethod, Prisma } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"
import randomstring from "randomstring"
import { prisma } from "@/utils/prisma"
import { CreateStoreFormValues } from '../components/create-store-button-new'

type InsertStoreReturn = {
    message: string
    payload: Store
    error: boolean
}

export async function insertStore(payload: CreateStoreFormValues, userId: number): Promise<InsertStoreReturn> {

    return actionWrapper(async () => {

        /* const client = new PrismaClient() */

        const slug = randomstring.generate(8)

        const existingSlugStore = await prisma.store.findUnique({
            where: {
                slug: slug
            }
        })

        if (existingSlugStore) throw new Error("The store slug (Internal URL) already exists. Try another one.")

        const existingSubdomain = await prisma.store.findUnique({
            where: {
                subdomain: payload.basic_info.subdomain
            }
        })

        if (existingSubdomain) throw new Error("The store subdomain (Public URL) already exists. Try another one.")

        // Obtener las categorías por defecto del sistema
        const defaultCategories = await prisma.defaultCategory.findMany({
            where: { is_active: true },
            orderBy: { sort_order: 'asc' }
        })

        // Helpers
        const mapPayment = (label: string): PaymentMethod | null => {
            switch (label) {
                case 'Efectivo': return 'CASH'
                case 'Credito': return 'CREDIT_CARD'
                case 'Debito': return 'DEBIT_CARD'
                case 'Mercado Pago': return 'MERCADO_PAGO'
                case 'Transferencia': return 'TRANSFER'
                default: return null
            }
        }

        const dayIndex = (day?: string): number | null => {
            if (!day) return null
            const d = day.toLowerCase()
            if (d === 'lunes') return 0
            if (d === 'martes') return 1
            if (d === 'miercoles') return 2
            if (d === 'jueves') return 3
            if (d === 'viernes') return 4
            if (d === 'sabado') return 5
            if (d === 'domingo') return 6
            return null
        }

        const parseMoney = (v?: string | null) => {
            if (!v) return null
            const n = Number(v)
            return Number.isFinite(n) ? n : null
        }

        const parseEtaToMinutes = (hhmm?: string | null) => {
            if (!hhmm) return null
            const [hh, mm] = hhmm.split(':').map(Number)
            if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null
            return (hh * 60) + mm
        }

        const openingHoursData = (payload.settings?.attention_dates || []).flatMap((slot) => {
            const start = slot.startTime ?? "00:00"
            const end = slot.endTime ?? "00:00"
            return (slot.days || [])
                .map(dayIndex)
                .filter((d): d is number => d !== null)
                .map((d) => ({ day: d, start, end }))
        })

        const shippingMethodsData = (payload.shipping_info?.methods || []).flatMap((m) => {
            const eta = parseEtaToMinutes(m.estimatedTime)
            const min = parseMoney(m.minPurchase)
            const free = parseMoney(m.freeShippingMin)
            return (m.providers || [])
                .filter((p): p is string => typeof p === 'string')
                .map((provider) => ({
                    provider,
                    min_order_amount: min,
                    free_shipping_min: free,
                    eta_minutes: eta,
                    active: true,
                }))
        })

        const paymentMethods = (payload.payment_info?.payment_methods || [])
            .filter((v): v is string => typeof v === 'string')
            .map((v) => mapPayment(v))
            .filter((m): m is PaymentMethod => m !== null)

        // Build branch nested data to satisfy Prisma types
        type ExtendedBranchCreate = Prisma.BranchCreateWithoutStoreInput & {
            opening_hours?: Prisma.BranchOpeningHourCreateNestedManyWithoutBranchInput
            shipping_methods?: Prisma.BranchShippingMethodCreateNestedManyWithoutBranchInput
        }

        const branchData: ExtendedBranchCreate = {
            name: `${payload.basic_info.name} (Main Branch)`,
            description: `Main starter branch for the ${payload.basic_info.name} store`,
            address: payload.address_info.address || null,
            city: payload.address_info.city || null,
            province: payload.address_info.province || null,
            country: payload.address_info.country || null,
            email: payload.contact_info.contact_email || null,
            phone: payload.contact_info.contact_phone || null,
            facebook_url: payload.contact_info.facebook_url || null,
            instagram_url: payload.contact_info.instagram_url || null,
            x_url: payload.contact_info.x_url || null,
            is_main: true,
            operational_settings: {
                create: {
                    is_open_24_hours: payload.settings?.is_open_24_hours ?? true,
                    offers_delivery: payload.shipping_info?.offers_delivery ?? false,
                    payment_methods: paymentMethods,
                }
            },
        }

        if (openingHoursData.length > 0) {
            branchData.opening_hours = { create: openingHoursData }
        }

        if (shippingMethodsData.length > 0) {
            branchData.shipping_methods = { create: shippingMethodsData }
        }

        const store = await prisma.store.create({
            data: {
                name: payload.basic_info.name,
                slug: randomstring.generate(8),
                subdomain: payload.basic_info.subdomain,
                description: payload.basic_info.description,
                user_id: userId,
                logo: payload.basic_info.logo as string || null,
                is_physical_store: payload.address_info.is_physical_store || false,
                branches: {
                    create: branchData,
                },
                balance: {
                    create: {
                        current_balance: 0,
                    }
                },
                // Crear categorías por defecto para la tienda
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
                },
                customization: {
                    create: {

                    }
                },
            }
        })

        return {
            message: "Store created successfully",
            payload: store,
            error: false
        }

    })

}
