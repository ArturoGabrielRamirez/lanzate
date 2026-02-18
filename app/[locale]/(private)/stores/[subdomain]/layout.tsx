import { StoreAdminSidebar } from '@/features/stores/components/store-admin-sidebar'

interface StoreSubdomainLayoutProps {
  children: React.ReactNode
  params: Promise<{ subdomain: string; locale: string }>
}

/**
 * Store Subdomain Layout
 *
 * Wraps all store sub-routes with a persistent two-column layout:
 * - Left: StoreAdminSidebar (GooeySidebar, always visible)
 * - Right: page content (children)
 *
 * Note: The store banner is rendered in PrivateHeader (layout above this one).
 */
export default async function StoreSubdomainLayout({
  children,
}: StoreSubdomainLayoutProps) {
  return (
    <div className="container mx-auto flex min-h-0 flex-1 gap-4 px-2 py-6">
      <StoreAdminSidebar />
      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  )
}
