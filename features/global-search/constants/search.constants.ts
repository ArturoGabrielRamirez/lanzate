export const SEARCH_CONFIG = {
    DEBOUNCE_DELAY: 300,
    MAX_RESULTS_PER_TYPE: {
        PRODUCTS: 5,
        ORDERS: 5,
        CUSTOMERS: 3,
    },
    MAX_TOTAL_RESULTS: 10,
    SEARCH_PLACEHOLDER: "Productos, órdenes, clientes...",
} as const

export const SEARCH_ICONS = {
    PRODUCT: '📦',
    ORDER: '🛒',
    CUSTOMER: '👤',
    LOADING: 'Buscar',
} as const

export const SEARCH_MESSAGES = {
    SEARCHING: "Buscando...",
    NO_RESULTS: "No se encontraron resultados para",
    SHOWING_RESULTS: "Mostrando",
    RESULT: "resultado",
    RESULTS: "resultados",
} as const
