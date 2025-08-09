import { prisma } from "@/utils/prisma"

export async function getDashboardStats(userId: number) {
    try {
        // Get user's stores
        const userStores = await prisma.store.findMany({
            where: {
                OR: [
                    { user_id: userId },
                    { employees: { some: { user_id: userId } } }
                ]
            },
            select: { id: true }
        })

        const storeIds = userStores.map((store: { id: number }) => store.id)

        if (storeIds.length === 0) {
            return {
                totalRevenue: 0,
                totalOrders: 0,
                totalProducts: 0,
                activeStores: 0,
                revenueChange: 0,
                ordersChange: 0,
                productsChange: 0,
                activeStoresChange: 0
            }
        }

        // Get current month dates
        const now = new Date()
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

        // Get total revenue (current month)
        const currentRevenue = await prisma.order.aggregate({
            where: {
                store_id: { in: storeIds },
                is_paid: true,
                created_at: { gte: currentMonthStart }
            },
            _sum: { total_price: true }
        })

        // Get last month revenue for comparison
        const lastMonthRevenue = await prisma.order.aggregate({
            where: {
                store_id: { in: storeIds },
                is_paid: true,
                created_at: { 
                    gte: lastMonthStart,
                    lte: lastMonthEnd
                }
            },
            _sum: { total_price: true }
        })

        // Get total orders (current month)
        const currentOrders = await prisma.order.count({
            where: {
                store_id: { in: storeIds },
                created_at: { gte: currentMonthStart }
            }
        })

        // Get last month orders for comparison
        const lastMonthOrders = await prisma.order.count({
            where: {
                store_id: { in: storeIds },
                created_at: { 
                    gte: lastMonthStart,
                    lte: lastMonthEnd
                }
            }
        })

        // Get total products
        const totalProducts = await prisma.product.count({
            where: {
                store_id: { in: storeIds },
                is_active: true
            }
        })

        // Get products from last month for comparison
        const lastMonthProducts = await prisma.product.count({
            where: {
                store_id: { in: storeIds },
                is_active: true,
                created_at: { 
                    gte: lastMonthStart,
                    lte: lastMonthEnd
                }
            }
        })

        // Get active stores (stores with activity in the last 30 days)
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const activeStores = await prisma.store.count({
            where: {
                id: { in: storeIds },
                OR: [
                    { orders: { some: { created_at: { gte: thirtyDaysAgo } } } },
                    { products: { some: { created_at: { gte: thirtyDaysAgo } } } },
                    { products: { some: { product_likes: { some: { created_at: { gte: thirtyDaysAgo } } } } } },
                    { products: { some: { product_comments: { some: { created_at: { gte: thirtyDaysAgo } } } } } }
                ]
            }
        })

        // Get active stores from 30-60 days ago for comparison
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
        const lastPeriodActiveStores = await prisma.store.count({
            where: {
                id: { in: storeIds },
                OR: [
                    { orders: { some: { created_at: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } } },
                    { products: { some: { created_at: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } } },
                    { products: { some: { product_likes: { some: { created_at: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } } } } },
                    { products: { some: { product_comments: { some: { created_at: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } } } } }
                ]
            }
        })

        // Calculate percentage changes
        const calculateChange = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0
            return Math.round(((current - previous) / previous) * 100)
        }

        const totalRevenue = currentRevenue._sum.total_price || 0
        const lastRevenue = lastMonthRevenue._sum.total_price || 0
        
        return {
            totalRevenue,
            totalOrders: currentOrders,
            totalProducts,
            activeStores,
            revenueChange: calculateChange(totalRevenue, lastRevenue),
            ordersChange: calculateChange(currentOrders, lastMonthOrders),
            productsChange: calculateChange(totalProducts, totalProducts - lastMonthProducts),
            activeStoresChange: calculateChange(activeStores, lastPeriodActiveStores)
        }

    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        throw new Error('Failed to fetch dashboard statistics')
    }
} 