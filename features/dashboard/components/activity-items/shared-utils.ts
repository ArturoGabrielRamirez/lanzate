import { formatDistance } from "date-fns"
import { es } from "date-fns/locale"

export function getUserInitials(firstName?: string | null, lastName?: string | null) {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

export function formatActivityDate(date: Date) {
    return formatDistance(new Date(date), new Date(), { addSuffix: true, locale: es })
}

export function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'APPROVED':
        case 'COMPLETED':
        case 'DELIVERED':
            return 'default'
        case 'PENDING':
        case 'PROCESSING':
            return 'secondary'
        case 'REJECTED':
        case 'CANCELLED':
            return 'destructive'
        case 'EXPIRED':
            return 'outline'
        default:
            return 'secondary'
    }
}

export function getOrderStatusBadgeVariant(status: string) {
    switch (status) {
        case 'COMPLETED':
        case 'DELIVERED':
            return 'default'
        case 'PENDING':
        case 'PROCESSING':
        case 'READY':
            return 'secondary'
        case 'CANCELLED':
            return 'destructive'
        case 'SHIPPED':
            return 'outline'
        default:
            return 'secondary'
    }
} 