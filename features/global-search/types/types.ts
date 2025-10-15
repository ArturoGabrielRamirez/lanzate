export type SearchResultType = 'product' | 'order' | 'customer'

export interface BaseSearchResult {
    id: string | number
    type: SearchResultType
    title: string
    subtitle: string
    href: string | null
    icon: string
}

export interface ProductSearchResult extends BaseSearchResult {
    type: 'product'
}

export interface OrderSearchResult extends BaseSearchResult {
    type: 'order'
}

export interface CustomerSearchResult extends BaseSearchResult {
    type: 'customer'
}

export type SearchResult = ProductSearchResult | OrderSearchResult | CustomerSearchResult

export interface SearchConfig {
    debounceDelay: number
    maxResults: number
    placeholder: string
}

export interface GlobalSearchProps {
    userId: number
}

export interface UseGlobalSearchReturn {
    query: string
    setQuery: (query: string) => void
    results: SearchResult[]
    isLoading: boolean
    showResults: boolean
    setShowResults: (show: boolean) => void
    searchRef: React.RefObject<HTMLDivElement | null>
    handleInputFocus: () => void
}