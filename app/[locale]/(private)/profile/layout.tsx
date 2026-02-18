import { ProfileAdminSidebar } from '@/features/profile/components'
import { ProfilePageHeader } from '@/features/profile/components/profile-page-header'

interface ProfileLayoutProps {
  children: React.ReactNode
}

/**
 * Profile Layout
 *
 * Wraps all profile sub-routes with a persistent two-column layout:
 * - Left: ProfileAdminSidebar (GooeySidebar, always visible)
 * - Right: page content (children)
 *
 * Note: The profile banner is rendered in PrivateHeader (layout above this one).
 */
export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="container mx-auto min-h-0 flex-1 gap-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_4fr]">
      <ProfileAdminSidebar />
      <div className="min-w-0 flex-1">
        <ProfilePageHeader />
        {children}
      </div>
    </div>
  )
}
