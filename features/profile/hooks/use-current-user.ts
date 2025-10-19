/* import { useState, useEffect, useCallback } from 'react'
import { CurrentUser } from '../types'

export function useCurrentUser() {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const loadUser = useCallback(async () => {
        try {
            setIsLoading(true)
            const { getCurrentUser } = await import('@/features/auth/actions')
            const userResponse = await getCurrentUser()

            if (userResponse?.payload && !userResponse.error) {
                setCurrentUser(userResponse.payload)
            } else {
                setCurrentUser(null)
            }
        } catch (error) {
            console.error('Error loading user:', error)
            setCurrentUser(null)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadUser()
    }, [loadUser])

    return { currentUser, isLoading, reload: loadUser }
} */