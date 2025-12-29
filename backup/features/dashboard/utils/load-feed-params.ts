import { parseAsString, createLoader, parseAsInteger } from 'nuqs/server'

export const feedSearchParams = {
    type: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
}

export const loadFeedParams = createLoader(feedSearchParams)