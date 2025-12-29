import { parseAsString, parseAsInteger, createLoader } from 'nuqs/server'

export const tabSearchParams = {
    tab: parseAsString.withDefault("account"),
    product_id: parseAsInteger.withDefault(0)
}

export const loadTabParams = createLoader(tabSearchParams)