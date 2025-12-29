import { OrderSearchData } from "@/features/global-search/types"
import { prisma } from "@/utils/prisma"

export async function searchOrdersData(searchTerm: string, storeIds: number[], limit: number): Promise<OrderSearchData[]> {
    const orders = await prisma.order.findMany({
        where: {
            store_id: {
                in: storeIds
            },
            OR: [
                {
                    customer_name: {
                        contains: searchTerm
                    }
                }
            ]
        },
        select: {
            id: true,
            customer_name: true,
            customer_email: true,
            total_price: true,
            status: true,
            store_id: true,
            store: {
                select: {
                    slug: true,
                }
            },
        },
        take: limit
    })

    return orders
}
