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

export interface CanManageCategoriesAccessProps {
    userId: number
    storeId: number
}

export interface CreateCategoryAction {
    storeId: number
    payload: {
        name: string
        description?: string
        image?: string
        sort_order?: number
    }
}
export interface CreateCategoryDynamicAction {
    storeId: number
    categoryName: string
}

export interface DeleteCategoryAction {
    storeId: number
    categoryId: number
}

export interface UpdateCategoryAction {
    storeId: number
    categoryId: number
    payload: {
        name?: string
        description?: string
        image?: string
        sort_order?: number
        is_active?: boolean
    }
}

export interface GetStoreIdBySlugAction {
    slug: string
}

export interface UpdateCategoryAction {
    storeId: number
    categoryId: number
    payload: {
        name?: string
        description?: string
        image?: string
        sort_order?: number
        is_active?: boolean
    }
}

export interface InsertCategoryAction {
    storeId: number
    payload: {
        name: string
        sort_order?: number
        description?: string
        image?: string
        is_default?: boolean
    }
}

export interface SearchCategoriesAction {
    storeId: number
    searchTerm: string
}

export interface GetStoreCategoriesAction {
    storeId: number
}
