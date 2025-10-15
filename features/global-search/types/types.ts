export interface SearchResultType {
    id: string | number
    type: 'product' | 'order' | 'customer'
    title: string
    subtitle: string
    href: string | null
    icon: string
}

export interface GlobalSearchProps {
    userId: number
}