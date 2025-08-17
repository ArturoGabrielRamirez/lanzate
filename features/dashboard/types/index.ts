import { User, Product, Store, SocialActivity } from "@prisma/client"

export type SocialActivityWithRelations = SocialActivity & {
    user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'email'>
    store?: Pick<Store, 'id' | 'name' | 'slug'> | null
}

// Legacy type for backward compatibility during transition
export type UserStoreActivity = {
    likes: {
        user_id: number
        product_id: number
        created_at: Date
        users: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username' | 'phone'>
        products: Pick<Product, 'id' | 'name' | 'image'> & {
            store: Pick<Store, 'id' | 'name' | 'slug'>
        }
    }[]
    comments: {
        id: number
        user_id: number
        product_id: number
        content: string
        created_at: Date
        users: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username' | 'phone'>
        products: Pick<Product, 'id' | 'name' | 'image'> & {
            store: Pick<Store, 'id' | 'name' | 'slug'>
        }
    }[]
    orders: {
        id: number
        total_price: number
        total_quantity: number
        status: string
        is_paid: boolean
        customer_email?: string | null
        customer_name?: string | null
        customer_phone?: string | null
        order_type: string
        payment_method?: string | null
        shipping_method: string
        created_at: Date
        store: Pick<Store, 'id' | 'name' | 'slug'>
        customer?: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username' | 'phone'> | null
        processed_by?: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username' | 'phone'> | null
        items: {
            id: number
            quantity: number
            price: number
            product: Pick<Product, 'id' | 'name' | 'image'>
        }[]
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
            store: Pick<Store, 'id' | 'name' | 'slug'>
            created_by_user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username' | 'phone'>
        }
        employee: {
            user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username' | 'phone'>
        }
        assigned_by_user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username' | 'phone'>
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
            store: Pick<Store, 'id' | 'name' | 'slug'>
            created_by_user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username' | 'phone'>
        }
        employee: {
            user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username' | 'phone'>
        }
        assigned_by_user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username' | 'phone'>
    }[]
}

export type ActivityFeedItem = {
    id: string
    type: 'like' | 'comment' | 'order' | 'contract_assignment_as_employee' | 'contract_assignment_as_owner'
    user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'email' | 'username' | 'phone'>
    product?: Pick<Product, 'id' | 'name' | 'image'> & {
        store: Pick<Store, 'id' | 'name' | 'slug'>
    }
    order?: {
        id: number
        total_price: number
        total_quantity: number
        status: string
        is_paid: boolean
        customer_email?: string | null
        customer_name?: string | null
        customer_phone?: string | null
        order_type: string
        payment_method?: string | null
        shipping_method: string
        store: Pick<Store, 'id' | 'name' | 'slug'>
        customer?: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username' | 'phone'> | null
        processed_by?: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username' | 'phone'> | null
        items: {
            id: number
            quantity: number
            price: number
            product: Pick<Product, 'id' | 'name' | 'image'>
        }[]
    }
    contract?: {
        id: number
        title: string
        file_url: string
        comments?: string | null
        store: Pick<Store, 'id' | 'name' | 'slug'>
        created_by_user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'username' | 'phone'>
    }
    employee?: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'email' | 'username' | 'phone'>
    content?: string
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'EXPIRED'
    created_at: Date
}

// New type for social activity feed items - using the same structure as SocialActivityWithRelations
export type SocialActivityFeedItem = SocialActivityWithRelations 