import { parseAsString, createLoader, parseAsInteger } from 'nuqs/server'

export const filterSearchParams = {
    category: parseAsString.withDefault(""),
    price: parseAsString.withDefault(""),
    sort: parseAsString.withDefault(""),
    search: parseAsString.withDefault(""),
    min: parseAsString.withDefault(""),
    max: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(5),
    offset: parseAsInteger.withDefault(0),
}

export const loadFilterParams = createLoader(filterSearchParams)