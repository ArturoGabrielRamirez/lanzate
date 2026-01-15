import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getBillingHistoryAction } from '@/features/billing/actions';
import {
  BillingFilters,
  BillingHistoryTable,
  BillingPageHeader,
} from '@/features/billing/components';
import { getSubscriptionByUserEmailData } from '@/features/billing/data';
import { createClient } from '@/lib/supabase/server';

/**
 * generateMetadata - Server-side function for SEO metadata generation
 *
 * Generates metadata for the billing history page using internationalized translations.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('billing.history');
  return {
    title: t('title'),
    description: t('description'),
  };
}

/**
 * BillingPage - Billing History Page
 *
 * A server component that renders the billing history page.
 * This is a protected route that requires authentication.
 * Users can view their payment history and download invoices.
 *
 * Features:
 * - Protected route (requires authentication)
 * - Server-side data fetch for billing history
 * - Paginated payment list with filters
 * - Invoice download functionality
 *
 * Route: /[locale]/profile/billing
 * Protection: Private route (authenticated users only via layout)
 *
 * Architecture:
 * - Uses Server Components for initial data fetch
 * - Fetches billing data via getBillingHistoryAction
 * - Composes: BillingPageHeader, BillingFilters, BillingHistoryTable
 */
export default async function BillingPage() {
  const t = await getTranslations('billing.history');

  // Get authenticated user from Supabase
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated (backup check, layout should handle this)
  if (!user || !user.email) {
    redirect('/login');
  }

  // Get user's subscription to fetch billing history
  const subscription = await getSubscriptionByUserEmailData(user.email);

  // If user has no subscription, show empty state
  if (!subscription) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] dark:bg-background">
        <main className="mx-auto max-w-5xl px-6 py-8 md:px-12 lg:px-16">
          <BillingPageHeader
            title={t('pageTitle')}
            subtitle={t('pageDescription')}
          />

          {/* Empty State - No Subscription */}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-foreground">
              {t('noSubscription')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('noSubscriptionDescription')}
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Fetch initial billing history (first page, no filters)
  const billingResult = await getBillingHistoryAction(subscription.id, {
    page: 1,
    pageSize: 10,
  });

  // Handle error case
  if (billingResult.hasError || !billingResult.payload) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] dark:bg-background">
        <main className="mx-auto max-w-5xl px-6 py-8 md:px-12 lg:px-16">
          <BillingPageHeader
            title={t('pageTitle')}
            subtitle={t('pageDescription')}
          />

          {/* Error State */}
          <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
            <h2 className="text-lg font-semibold text-destructive">
              {t('error')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {billingResult.message || t('errorDescription')}
            </p>
          </div>
        </main>
      </div>
    );
  }

  const { data: payments, page, totalPages } = billingResult.payload;

  return (
    <div className="min-h-screen bg-[#f8f5f2] dark:bg-background">
      <main className="mx-auto max-w-5xl px-6 py-8 md:px-12 lg:px-16">
        {/* Page Header with Breadcrumb */}
        <BillingPageHeader
          title={t('pageTitle')}
          subtitle={t('pageDescription')}
        />

        {/* Filters */}
        <div className="mb-6">
          <BillingFilters />
        </div>

        {/* Billing History Table */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <BillingHistoryTable
            payments={payments}
            emptyMessage={t('noPayments')}
          />
        </div>

        {/* Pagination Info */}
        {totalPages > 1 && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {t('pagination', { page, totalPages })}
          </div>
        )}
      </main>
    </div>
  );
}
