import { PRESET_BANNERS } from '@/features/profile/utils/preset-banners'

export const getDefaultBannerForUser = (() => {
    const cache = new Map<string, string>()

    return (userId: number | string): string => {
        const cacheKey = String(userId)
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey)!
        }

        const userIdAsNumber = typeof userId === 'string' ? parseInt(userId, 10) : userId
        const index = isNaN(userIdAsNumber) ? 0 : userIdAsNumber % PRESET_BANNERS.length
        const banner = PRESET_BANNERS[index].url

        cache.set(cacheKey, banner)
        return banner
    }
})()

/* export const getDefaultBannerForUser = (userId: number): string => {
    const index = userId % DEFAULT_BANNERS.length
    return DEFAULT_BANNERS[index]
} */