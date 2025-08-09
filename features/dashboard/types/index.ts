import { User, Product, Store } from "@prisma/client"

export type UserStoreActivity = {
    likes: {
        user_id: number
        product_id: number
        created_at: Date
        users: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
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
        users: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
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
        customer?: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'> | null
        processed_by?: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'> | null
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
            store: Pick<Store, 'id' | 'name' | 'slug'>
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
    type: 'like' | 'comment' | 'order' | 'contract_assignment_as_employee' | 'contract_assignment_as_owner'
    user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'email'>
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
        customer?: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'> | null
        processed_by?: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'> | null
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
        created_by_user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
    }
    employee?: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar' | 'email'>
    content?: string
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'EXPIRED'
    created_at: Date
} 