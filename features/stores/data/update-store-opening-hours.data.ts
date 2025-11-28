import { SettingsFormType } from "@/features/stores/schemas"
import { prisma } from "@/utils/prisma"

const DAY_MAP: Record<string, number> = {
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6,
    "sunday": 0
}

export async function updateStoreOpeningHoursData(slug: string, payload: SettingsFormType["settings"]) {
    const store = await prisma.store.findUnique({
        where: { slug },
        include: {
            branches: {
                where: { is_main: true }
            }
        }
    })

    if (!store || !store.branches[0]) {
        throw new Error("Tienda o sucursal principal no encontrada")
    }

    const branchId = store.branches[0].id

    return await prisma.$transaction(async (tx) => {
        // 1. Update operational settings (is_open_24_hours)
        const settings = await tx.branchOperationalSettings.upsert({
            where: { branch_id: branchId },
            update: { is_open_24_hours: payload.is_open_24_hours },
            create: {
                branch_id: branchId,
                is_open_24_hours: payload.is_open_24_hours
            }
        })

        // 2. Delete existing opening hours
        await tx.branchOpeningHour.deleteMany({
            where: { branch_id: branchId }
        })

        // 3. Create new opening hours if not 24/7
        if (!payload.is_open_24_hours && payload.attention_dates && payload.attention_dates.length > 0) {
            const openingHoursToCreate = []

            for (const dateGroup of payload.attention_dates) {
                if (!dateGroup.days || !dateGroup.startTime || !dateGroup.endTime) continue

                for (const dayStr of dateGroup.days) {
                    // Assuming dayStr is like "monday", "tuesday", etc.
                    // Map to 0-6 (0 is Sunday, 1 is Monday, etc.) if using standard numbering
                    // However, prisma schema comments say 0..6. Let's verify the convention. 
                    // Typically 0=Sunday, 1=Monday...

                    // I will assume the frontend sends stable keys "monday", "tuesday" etc.
                    // I need a map.
                    const dayIndex = DAY_MAP[dayStr?.toLowerCase() ?? ""]

                    if (typeof dayIndex === "number") {
                        openingHoursToCreate.push({
                            branch_id: branchId,
                            day: dayIndex,
                            start: dateGroup.startTime,
                            end: dateGroup.endTime
                        })
                    }
                }
            }

            if (openingHoursToCreate.length > 0) {
                await tx.branchOpeningHour.createMany({
                    data: openingHoursToCreate
                })
            }
        }

        return settings
    })
}

