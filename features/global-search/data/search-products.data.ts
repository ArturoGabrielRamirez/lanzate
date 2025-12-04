import { ProductSearchData } from "@/features/global-search/types"
/* import { prisma } from "@/utils/prisma" */

export async function searchProductsData(searchTerm: string, storeIds: number[], limit: number): Promise<ProductSearchData[]> {
    console.log("searchTerm", searchTerm)
    console.log("storeIds", storeIds)
    console.log("limit", limit)
    return []
    /*    const products = await prisma.product.findMany({
           where: {
               store_id: {
                   in: storeIds
               },
               is_deleted: false,
               OR: [
                   {
                       name: {
                           contains: searchTerm
                       }
                   }
               ]
           },
           select: {
               id: true,
               name: true,
               sku: true,
               price: true,
               store_id: true,
               store: {
                   select: {
                       slug: true,
                   }
               },
           },
           take: limit
       })
   
       return products */
}
