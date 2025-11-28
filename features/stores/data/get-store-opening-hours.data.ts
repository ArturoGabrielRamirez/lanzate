import { prisma } from "@/utils/prisma"

export async function getStoreOpeningHoursData(slug: string) {
    const store = await prisma.store.findUnique({
        where: { slug },
        include: {
            branches: {
                where: { is_main: true },
                include: {
                    operational_settings: true,
                    opening_hours: true
                }
            }
        }
    })

    if (!store || !store.branches[0]) {
        return null
    }

    const mainBranch = store.branches[0]

    return {
        operational_settings: mainBranch.operational_settings,
        opening_hours: mainBranch.opening_hours
    }
}

