import { product_likes, product_comments, User, Product, Store } from "@prisma/client"

export type UserStoreActivity = {
    likes: (product_likes & {
        users: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
        products: Pick<Product, 'id' | 'name' | 'image'> & {
            store: Pick<Store, 'name' | 'slug'>
        }
    })[]
    comments: (product_comments & {
        users: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
        products: Pick<Product, 'id' | 'name' | 'image'> & {
            store: Pick<Store, 'name' | 'slug'>
        }
    })[]
}

export type ActivityFeedItem = {
    id: string
    type: 'like' | 'comment'
    user: Pick<User, 'id' | 'first_name' | 'last_name' | 'avatar'>
    product: Pick<Product, 'id' | 'name' | 'image'> & {
        store: Pick<Store, 'name' | 'slug'>
    }
    content?: string
    created_at: Date
} 