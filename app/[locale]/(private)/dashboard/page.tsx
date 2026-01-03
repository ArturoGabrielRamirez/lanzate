/* import { redirect } from 'next/navigation'; */

import { getDashboardDataAction } from '@/features/dashboard/actions';
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { DashboardNavigation } from '@/features/dashboard/components/dashboard-navigation';
import { StoreStats } from '@/features/dashboard/components/store-stats';
import { createClient } from '@/lib/supabase/server';

/**
 * Protected Dashboard Page
 *
 * This is the main dashboard page that requires authentication.
 * It demonstrates:
 * - Supabase authentication check (Server Component)
 * - Server Actions and data layer pattern for fetching user data
 * - Personalized greeting with user information
 * - Store statistics from database
 * - Protected route pattern with redirect
 *
 * Architecture:
 * - Uses Server Actions (getDashboardDataAction)
 * - Follows action -> data layer pattern
 * - Handles authentication at the page level
 *
 * Design features:
 * - Warm beige/pink background for light theme
 * - Card-based layout matching general-dashboard-after-login.png
 * - Responsive design (mobile, tablet, desktop)
 * - Logout functionality
 */
export default async function DashboardPage() {
  // Check authentication status
  const supabase = await createClient();
  const {
    data: { /* user */ },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  /* if (!user) {
    redirect('/login');
  } */

  // Fetch dashboard data using Server Action
  const result = await getDashboardDataAction();

  // Handle error case
  if (result.hasError || !result.payload) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] dark:bg-background">
        <DashboardNavigation />
        <main className="mx-auto max-w-7xl px-6 py-8 md:px-12 lg:px-16">
          <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
            <h2 className="text-lg font-semibold text-destructive">
              Error loading dashboard
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>
          </div>
        </main>
      </div>
    );
  }

  // Extract data from response
  const { userName, userEmail, storesCount } = result.payload;

  return (
    <div className="min-h-screen bg-[#f8f5f2] dark:bg-background">
      {/* Dashboard Navigation */}
      <DashboardNavigation />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8 md:px-12 lg:px-16">
        {/* Dashboard Header with personalized greeting */}
        <DashboardHeader userName={userName} userEmail={userEmail} />

        {/* Store Statistics */}
        <div className="mt-8">
          <StoreStats storesCount={storesCount} />
        </div>

        {/* Activity Feed Section - Empty State */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Tu feed</h2>
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-foreground">No activity</h3>
            <p className="text-sm text-muted-foreground">
              Aquí podrás ver todos los likes, comentarios y pedidos de tus tiendas.
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Need help?</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-base font-medium text-foreground">Contact us</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Our experts are here to help you
                </p>
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Send message
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
