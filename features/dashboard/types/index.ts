import { User, Product, Store } from "@prisma/client"

export type UserStoreActivity = {
    likes: {
        user_id: number
        product_id: number
        created_at: Date
        users: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
        products: Pick<Product, 'id' | 'name' | 'image'> & {
            store: Pick<Store, 'name' | 'slug'>
        }
    }[]
    comments: {
        id: number
        user_id: number
        product_id: number
        content: string
        created_at: Date
        users: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
        products: Pick<Product, 'id' | 'name' | 'image'> & {
            store: Pick<Store, 'name' | 'slug'>
        }
    }[]
    contractAssignmentsAsEmployee: {
        id: number
        status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'EXPIRED'
        assigned_at: Date
        contract: {
            id: number
            title: string
            file_url: string
            comments?: string | null
            store: Pick<Store, 'name' | 'slug'>
            created_by_user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
        }
        employee: {
            user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
        }
        assigned_by_user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
    }[]
    contractAssignmentsAsOwner: {
        id: number
        status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'EXPIRED'
        assigned_at: Date
        contract: {
            id: number
            title: string
            file_url: string
            comments?: string | null
            store: Pick<Store, 'name' | 'slug'>
            created_by_user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
        }
        employee: {
            user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
        }
        assigned_by_user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
    }[]
}

export type ActivityFeedItem = {
    id: string
    type: 'like' | 'comment' | 'contract_assignment_as_employee' | 'contract_assignment_as_owner'
    user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
    product?: Pick<Product, 'id' | 'name' | 'image'> & {
        store: Pick<Store, 'name' | 'slug'>
    }
    contract?: {
        id: number
        title: string
        file_url: string
        comments?: string | null
        store: Pick<Store, 'name' | 'slug'>
        created_by_user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
    }
    employee?: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
    content?: string
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'EXPIRED'
    created_at: Date
} 