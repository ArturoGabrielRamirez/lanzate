import { SEARCH_ICONS } from "@/features/global-search/constants"
import { ProductSearchResult, OrderSearchResult, CustomerSearchResult } from "@/features/global-search/types"

export const formatSearchTerm = (query: string): string => {
    return `%${query.toLowerCase()}%`
}

export const generateProductHref = (storeSlug: string, productId: number): string => {
    return `/stores/${storeSlug}/products/${productId}`
}

export const generateOrderHref = (storeSlug: string, orderId: number): string => {
    return `/stores/${storeSlug}/orders/${orderId}`
}

export const formatProductSubtitle = (sku: string, price: number): string => {
    return `SKU: ${sku} - $${price}`
}

export const formatOrderSubtitle = (
    customerName: string | null, 
    customerEmail: string | null, 
    totalPrice: number, 
    status: string
): string => {
    return `${customerName || customerEmail} - $${totalPrice} (${status})`
}

export const createProductSearchResult = (
    product: {
        id: number
        name: string
        sku: string
        price: number
        store: { slug: string }
    }
): ProductSearchResult => {
    return {
        id: product.id,
        type: 'product',
        title: product.name,
        subtitle: formatProductSubtitle(product.sku, product.price),
        href: generateProductHref(product.store.slug, product.id),
        icon: SEARCH_ICONS.PRODUCT
    }
}

export const createOrderSearchResult = (
    order: {
        id: number
        customer_name: string | null
        customer_email: string | null
        total_price: number
        status: string
        store: { slug: string }
    }
): OrderSearchResult => {
    return {
        id: order.id,
        type: 'order',
        title: `Order #${order.id}`,
        subtitle: formatOrderSubtitle(order.customer_name, order.customer_email, order.total_price, order.status),
        href: generateOrderHref(order.store.slug, order.id),
        icon: SEARCH_ICONS.ORDER
    }
}

export const createCustomerSearchResult = (
    customer: {
        customer_name: string | null
        customer_email: string
    }
): CustomerSearchResult => {
    return {
        id: customer.customer_email || customer.customer_name || '',
        type: 'customer',
        title: customer.customer_name || 'Unknown Customer',
        subtitle: customer.customer_email || 'No email',
        href: null,
        icon: SEARCH_ICONS.CUSTOMER
    }
}
