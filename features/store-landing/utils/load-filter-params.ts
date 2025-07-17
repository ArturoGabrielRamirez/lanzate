import { parseAsString, createLoader } from 'nuqs/server'

export const filterSearchParams = {
    category: parseAsString.withDefault(""),
    price: parseAsString.withDefault(""),
    sort: parseAsString.withDefault(""),
    search: parseAsString.withDefault("")
}

export const loadFilterParams = createLoader(filterSearchParams)