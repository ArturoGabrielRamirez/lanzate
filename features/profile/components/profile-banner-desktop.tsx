import { ProfileAvatar } from "./profile-avatar-memo"
import { BannerSection } from "./banner-section"
import { ProfileInfo } from "./profile-info"
import { ProfileBannerDesktopProps } from "../types"

export default function ProfileBannerDesktop({
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
}: ProfileBannerDesktopProps) {
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
        isMobile={false}
      />

      <div className="relative bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-start gap-6 py-6">
            <div className="relative -mt-20">
              <ProfileAvatar
                avatarUrl={avatarUrl}
                displayName={displayName}
                isLoading={loadingAvatar}
                isOwnProfile={isOwnProfile}
                onAvatarUpdate={onAvatarUpdate}
                userEmail={user.email}
                size="large"
              />
            </div>

            <ProfileInfo
              displayName={displayName}
              username={user.username}
              bio={user.profile_bio}
              location={user.location}
              showLocation={user.show_location}
              createdAt={user.created_at}
              isMobile={false}
            />

            {actionButton && (
              <div className="pt-2">
                {actionButton}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}