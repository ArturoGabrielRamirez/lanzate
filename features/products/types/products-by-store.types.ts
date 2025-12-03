import { Product, Category, ProductVariant, ProductVariantValue, ProductOptionValue, ProductOption, VariantStock, Branch } from "@prisma/client"

export type StoreIdentifier = 
    | { storeId: number }
    | { slug: string }
    | { subdomain: string }

export type ProductWithRelations = Product & {
    categories: Category[]
    variants: (ProductVariant & {
        option_values: (ProductVariantValue & {
            value: ProductOptionValue & {
                option: ProductOption
            }
        })[]
        stock_items: (VariantStock & {
            branch: Branch
        })[]
    })[]
}

export type SelectProductsByStoreResult = {
    payload: ProductWithRelations[]
    hasError: false
    message: string
}

