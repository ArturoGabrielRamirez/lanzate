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
  params,
}: StoreSubdomainLayoutProps) {
  const { subdomain } = await params

  return (
    <div className="container mx-auto min-h-0 flex-1 gap-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_4fr]">
      <StoreAdminSidebar subdomain={subdomain} />
      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  )
}
