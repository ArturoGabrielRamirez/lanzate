import { parseAsString, createLoader } from 'nuqs/server'

export const feedSearchParams = {
    type: parseAsString.withDefault(""),
}

export const loadFeedParams = createLoader(feedSearchParams)