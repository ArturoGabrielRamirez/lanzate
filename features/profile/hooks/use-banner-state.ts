import { useState, useEffect, useCallback } from "react"
import { getDefaultBannerForUser } from "../utils/get-default-banner-for-user"

export function useBannerState(userId: string, initialBanner: string | null) {
    const [bannerUrl, setBannerUrl] = useState(() => {
        if (initialBanner) return initialBanner
        return getDefaultBannerForUser(userId)
    })

    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        if (initialBanner !== bannerUrl && initialBanner !== null) {
            setBannerUrl(initialBanner || getDefaultBannerForUser(userId))
        }
    }, [initialBanner, userId])

    const handleLoad = useCallback(() => {
        setIsLoading(false)
        setHasError(false)
    }, [])

    const handleError = useCallback(() => {
        setIsLoading(false)
        setHasError(true)

        const defaultBanner = getDefaultBannerForUser(userId)
        if (bannerUrl !== defaultBanner) {
            setBannerUrl(defaultBanner)
        }
    }, [bannerUrl, userId])

    const updateBanner = useCallback((url: string | null) => {
        if (url) {
            setBannerUrl(url)
        }
    }, [])

    return {
        bannerUrl,
        isLoading,
        hasError,
        handleLoad,
        handleError,
        updateBanner
    }
}