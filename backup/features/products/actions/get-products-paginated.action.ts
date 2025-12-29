"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { actionWrapper } from "@/features/global/utils"
import { selectProductsPaginated, type PaginatedProductsParams } from "@/features/products/data/select-products-paginated.data"

const paginatedParamsSchema = z.object({
    storeId: z.number(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    dateFrom: z.string().optional().transform(val => val ? new Date(val) : undefined),
    dateTo: z.string().optional().transform(val => val ? new Date(val) : undefined),
})

export type GetProductsPaginatedInput = z.input<typeof paginatedParamsSchema>

export async function getProductsPaginatedAction(input: GetProductsPaginatedInput) {
    return actionWrapper(async () => {
        const parsed = paginatedParamsSchema.parse(input)

        const params: PaginatedProductsParams = {
            storeId: parsed.storeId,
            page: parsed.page,
            pageSize: parsed.pageSize,
            search: parsed.search,
            sortBy: parsed.sortBy,
            sortOrder: parsed.sortOrder,
            dateFrom: parsed.dateFrom,
            dateTo: parsed.dateTo,
        }

        const result = await selectProductsPaginated(params)

        revalidatePath(`/stores/${parsed.storeId}/products`)

        return {
            hasError: false,
            message: "Productos obtenidos correctamente",
            payload: result
        }
    })
}

