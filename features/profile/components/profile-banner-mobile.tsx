import { BannerSection } from '@/features/profile/components/banner-section'
import { ProfileAvatar } from '@/features/profile/components/profile-avatar-memo'
import { ProfileInfo } from '@/features/profile/components/profile-info'
import { ProfileBannerMobileProps } from '@/features/profile/types'

function ProfileBannerMobile({
  user,
  displayName,
  bannerUrl,
  avatarUrl,
  bannerState,
  loadingBanner,
  loadingAvatar,
  isOwnProfile,
  onBannerUpdate,
  onAvatarUpdate,
  actionButton
}: ProfileBannerMobileProps) {
  return (
    <div>
      <BannerSection
        bannerUrl={bannerUrl}
        isLoading={bannerState.isLoading}
        hasError={bannerState.hasError}
        onLoad={bannerState.handleLoad}
        onError={bannerState.handleError}
        onUpdate={onBannerUpdate}
        isOwnProfile={isOwnProfile}
        loadingBanner={loadingBanner}
        isMobile={true}
      />

      <div className="relative bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/30">
        <div className="px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="relative -mt-12 flex-shrink-0">
              <ProfileAvatar
                avatarUrl={avatarUrl}
                displayName={displayName}
                isLoading={loadingAvatar}
                isOwnProfile={isOwnProfile}
                onAvatarUpdate={onAvatarUpdate}
                userEmail={user.email}
                size="medium"
              />
            </div>

            <ProfileInfo
              displayName={displayName}
              username={user.username}
              bio={user.profile_bio}
              location={user.location}
              showLocation={user.show_location}
              createdAt={user.created_at}
              isMobile={true}
            />
          </div>
          
          {actionButton && (
            <div className="w-full mt-3">
              {actionButton}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { ProfileBannerMobile }