export type Category = {
    id: number
    name: string
    description?: string
    image?: string
    slug: string
    store_id: number
    is_default: boolean
    sort_order: number
    is_active: boolean
    created_at: Date
    updated_at: Date
    products?: Product[]
}

export type Product = {
    id: number
    name: string
    image?: string
    price: number
}

export type CreateCategoryPayload = {
    name: string
    description?: string
    image?: string
    sort_order?: number
}

export type UpdateCategoryPayload = {
    name?: string
    description?: string
    image?: string
    sort_order?: number
    is_active?: boolean
}

export type DefaultCategory = {
    id: number
    name: string
    description?: string
    image?: string
    slug: string
    sort_order: number
    is_active: boolean
    created_at: Date
    updated_at: Date
} 