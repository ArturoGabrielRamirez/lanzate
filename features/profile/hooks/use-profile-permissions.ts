import { useMemo } from 'react'

import { ProfilePermissions, PublicUserProfile } from '@/features/profile/types'

export function useProfilePermissions(
    currentUserId: string | number | undefined,
    user: PublicUserProfile,
    isUserLoading: boolean
): ProfilePermissions {
    return useMemo(() => {
        if (isUserLoading) {
            return {
                isOwnProfile: false,
                canViewProfile: false,
                showFollowButton: false,
                reason: 'Cargando...'
            }
        }

        let isOwnProfile = false
        if (currentUserId !== undefined && currentUserId !== null) {
            const numericCurrentId = typeof currentUserId === 'string'
                ? parseInt(currentUserId, 10)
                : currentUserId

            isOwnProfile = !isNaN(numericCurrentId) && numericCurrentId === user.id
        }

        if (isOwnProfile) {
            return {
                isOwnProfile: true,
                canViewProfile: true,
                showFollowButton: false,
                reason: 'Es tu propio perfil'
            }
        }

        const canViewProfile = user.profile_is_public || isOwnProfile
        const showFollowButton = !isOwnProfile && !!currentUserId && user.profile_is_public

        return {
            isOwnProfile,
            canViewProfile,
            showFollowButton,
            reason: !canViewProfile ? 'Este perfil es privado' : undefined
        }
    }, [currentUserId, user.id, user.profile_is_public, isUserLoading])
}