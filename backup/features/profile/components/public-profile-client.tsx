// features/profile/components/public-profile-client.tsx
'use client'

import { useState, useCallback, useMemo } from 'react'

import { CommunityStatsCard } from '@/features/profile/components/community-stats-card'
import { PrivateProfileView } from '@/features/profile/components/private-profile-view'
import { ProfileActionButton } from '@/features/profile/components/profile-action-button'
import { ProfileBanner } from '@/features/profile/components/profile-banner'
import { ProfileNotFound } from '@/features/profile/components/profile-not-found'
import { ProfileTabs } from '@/features/profile/components/profile-tabs'
import { useFollowStatus } from '@/features/profile/hooks/use-follow-status'
import { useProfilePermissions } from '@/features/profile/hooks/use-profile-permissions'
import { PublicProfileClientProps } from '@/features/profile/types'
import { calculateAccountAge } from '@/features/profile/utils/calculate-account-age'

function PublicProfileClient({
  user,
  initialCurrentUser = null,
  initialIsFollowing
}: PublicProfileClientProps) {

  const permissions = useProfilePermissions(
    initialCurrentUser?.id,
    user,
    false
  )


  const currentUser = initialCurrentUser


  const [followersCount, setFollowersCount] = useState(user._count.user_follows_following)
  const [profileData, setProfileData] = useState({
    avatar: user.avatar,
    banner: user.banner
  })

  const { isFollowing, isLoading: isFollowLoading, toggleFollow } = useFollowStatus(
    currentUser?.id,
    user.id,
    permissions.isOwnProfile,
    initialIsFollowing
  )



  // ✅ FIX: Normalizar created_at antes de pasar a calculateAccountAge
  const accountAge = useMemo(() => {
    const createdAtString = user.created_at instanceof Date
      ? user.created_at.toISOString()
      : user.created_at

    return calculateAccountAge(createdAtString)
  }, [user.created_at])



  const handleFollowToggle = useCallback(async () => {
    if (permissions.isOwnProfile || !currentUser) return

    try {
      const newIsFollowing = await toggleFollow()

      if (newIsFollowing !== undefined) {
        setFollowersCount(prev => newIsFollowing ? prev + 1 : Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
    }
  }, [currentUser, toggleFollow, permissions.isOwnProfile])

  const handleBannerUpdate = useCallback((url: string | null) => {
    if (url) setProfileData(prev => ({ ...prev, banner: url }))
  }, [])

  const handleAvatarUpdate = useCallback((url: string | null) => {
    if (url) setProfileData(prev => ({ ...prev, avatar: url }))
  }, [])

  if (!user?._count) {
    return <ProfileNotFound />
  }

  return (
    <div className="max-w-7xl mx-auto">
      <ProfileBanner
        user={{ ...user, ...profileData }}
        currentUserId={currentUser?.id}
        currentUsername={currentUser?.username}
        onBannerUpdate={handleBannerUpdate}
        onAvatarUpdate={handleAvatarUpdate}
        isOwnProfile={permissions.isOwnProfile}
        actionButton={
          <ProfileActionButton
            isUserLoading={false}
            isOwnProfile={permissions.isOwnProfile}
            showFollowButton={permissions.showFollowButton}
            isFollowing={isFollowing}
            isFollowLoading={isFollowLoading}
            onFollowToggle={handleFollowToggle}
            user={user}
            currentUser={currentUser}
          />
        }
      />

      {!permissions.canViewProfile ? (
        <PrivateProfileView
          reason={permissions.reason || 'Este perfil es privado'}
          currentUser={currentUser}
          isUserLoading={false}
        />
      ) : (
        <div className="px-4 md:px-6 pt-6 pb-16 md:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="lg:col-span-1 xl:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-4">
                <CommunityStatsCard
                  followersCount={followersCount}
                  followingCount={user._count.user_follows}
                  likesCount={user._count.product_likes}
                  accountAge={accountAge}
                  isOwnProfile={permissions.isOwnProfile}
                />
              </div>
            </div>

            <div className="lg:col-span-2 xl:col-span-3 order-1 lg:order-2">
              <ProfileTabs
                user={user}
                isOwnProfile={permissions.isOwnProfile}
                currentUserId={currentUser?.id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { PublicProfileClient }