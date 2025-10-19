export const SEARCH_CONFIG = {
    DEBOUNCE_DELAY: 300,
    MAX_RESULTS_PER_TYPE: {
        PRODUCTS: 5,
        ORDERS: 5,
        CUSTOMERS: 3,
    },
    MAX_TOTAL_RESULTS: 10,
    SEARCH_PLACEHOLDER: "Products, orders, customers...",
} as const

export const SEARCH_ICONS = {
    PRODUCT: '📦',
    ORDER: '🛒',
    CUSTOMER: '👤',
    LOADING: 'Search',
} as const

export const SEARCH_MESSAGES = {
    SEARCHING: "Searching...",
    NO_RESULTS: "No results found for",
    SHOWING_RESULTS: "Showing",
    RESULT: "result",
    RESULTS: "results",
} as const
