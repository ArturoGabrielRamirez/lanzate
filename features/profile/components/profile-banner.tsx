"use client"

import { useCallback } from "react"

import { ProfileBannerDesktop } from '@/features/profile/components/profile-banner-desktop'
import { ProfileBannerMobile } from '@/features/profile/components/profile-banner-mobile'
import { useAvatarState } from '@/features/profile/hooks/use-avatar-state'
import { useBannerState } from '@/features/profile/hooks/use-banner-state'
import { ProfileBannerProps } from '@/features/profile/types'

function ProfileBanner({
  user,
  onBannerUpdate,
  onAvatarUpdate,
  isOwnProfile,
  loadingBanner = false,
  loadingAvatar = false,
  actionButton
}: ProfileBannerProps) {
  const displayName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.username

  const bannerState = useBannerState(user.id.toString(), user.banner ?? null)
  const avatarState = useAvatarState(user.avatar ?? null)

  const handleBannerUpdate = useCallback((url: string | null) => {
    bannerState.updateBanner(url)
    onBannerUpdate?.(url)
  }, [bannerState, onBannerUpdate])

  const handleAvatarUpdate = useCallback((url: string | null) => {
    avatarState.updateAvatar(url)
    onAvatarUpdate?.(url)
  }, [avatarState, onAvatarUpdate])

  const sharedProps = {
    user,
    displayName,
    bannerUrl: bannerState.bannerUrl,
    avatarUrl: avatarState.avatarUrl,
    bannerState,
    loadingBanner,
    loadingAvatar,
    isOwnProfile,
    onBannerUpdate: handleBannerUpdate,
    onAvatarUpdate: handleAvatarUpdate,
    actionButton
  }

  return (
    <div className="relative w-full bg-gray-900">
      <div className="lg:hidden">
        <ProfileBannerMobile {...sharedProps} />
      </div>

      <div className="hidden lg:block">
        <ProfileBannerDesktop {...sharedProps} />
      </div>
    </div>
  )
}

export { ProfileBanner }