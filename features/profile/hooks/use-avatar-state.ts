import { useState, useEffect, useCallback } from "react"

export function useAvatarState(initialAvatar: string | null) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatar)

    useEffect(() => {
        if (initialAvatar !== avatarUrl) {
            setAvatarUrl(initialAvatar)
        }
    }, [initialAvatar, avatarUrl])

    const updateAvatar = useCallback((url: string | null) => {
        setAvatarUrl(url)
    }, [])

    return {
        avatarUrl,
        updateAvatar
    }
}