import { redirect } from 'next/navigation';

import { AccessManagerProvider } from '@/features/access/components';
import type { UserSession } from '@/features/access/types/access';
import { getAuthUser } from '@/features/auth/utils/getAuthUser';
import { PrivateHeader } from '@/features/layout/components';
import { TooltipProvider } from '@/features/shadcn/components/ui/tooltip';
import { DEFAULT_ACCOUNT_TYPE } from '@/features/subscriptions/config';
import { getUserSubscriptionData } from '@/features/subscriptions/data';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

/**
 * Private Layout
 *
 * Layout for authenticated private routes (dashboard, stores, profile, new-sale).
 * Provides access control context and renders the private header.
 *
 * Features:
 * - Authenticates user via Supabase Auth
 * - Redirects to login if not authenticated
 * - Wraps children with AccessManagerProvider
 * - Passes user session with accountType as role
 * - Renders PrivateHeader navigation
 */
export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  // Get authenticated user from Supabase
  const authUser = await getAuthUser();

  // Redirect to login if not authenticated
  if (!authUser) {
    redirect('/login');
  }

  // Get user's subscription to determine account type
  const subscription = await getUserSubscriptionData(authUser.id);
  const accountType = subscription?.accountType ?? DEFAULT_ACCOUNT_TYPE;

  // Build user session for AccessManagerProvider
  const userSession: UserSession = {
    id: authUser.id,
    email: authUser.email,
    roles: [accountType],
    permissions: [],
  };

  return (
    <AccessManagerProvider user={userSession}>
      <TooltipProvider>
        <PrivateHeader />
        <main className="flex flex-col grow">
          {children}
        </main>
      </TooltipProvider>
    </AccessManagerProvider>
  );
}
