import { useState, useCallback, useRef } from 'react'
import { toggleFollowUserAction } from '../actions/toggle-follow-user.action'

export function useFollowStatus(
    currentUserId: number | undefined,
    targetUserId: number,
    isOwnProfile: boolean,
    initialIsFollowing: boolean = false
) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [isLoading, setIsLoading] = useState(false)

    const isTogglingRef = useRef(false)

    const toggleFollow = useCallback(async () => {
        if (!currentUserId || isOwnProfile || isTogglingRef.current) {
            return
        }

        isTogglingRef.current = true
        setIsLoading(true)

        try {
            const response = await toggleFollowUserAction(targetUserId)

            if (response && !response.error) {
                setIsFollowing(response.payload.isFollowing)
                return response.payload.isFollowing
            }
        } catch (error) {
            console.error('Error toggling follow:', error)
        } finally {
            setIsLoading(false)
            setTimeout(() => {
                isTogglingRef.current = false
            }, 300)
        }
    }, [currentUserId, targetUserId, isOwnProfile])

    return {
        isFollowing,
        isLoading,
        toggleFollow
    }
}