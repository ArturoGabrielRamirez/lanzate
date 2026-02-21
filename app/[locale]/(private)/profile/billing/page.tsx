import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { requireAuth } from '@/features/auth/utils';
import { getBillingHistoryAction } from '@/features/billing/actions';
import {
  BillingFilters,
  BillingHistoryTable,
  BillingPageHeader,
} from '@/features/billing/components';
import { getSubscriptionByUserEmailData } from '@/features/billing/data';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('billing.history');
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function BillingPage() {
  const t = await getTranslations('billing.history');

  const { dbUser: user } = await requireAuth();

  const subscription = await getSubscriptionByUserEmailData(user.email);

  if (!subscription) {
    return (
      <div className="space-y-6">
        <BillingPageHeader
          title={t('pageTitle')}
          subtitle={t('pageDescription')}
        />
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
      </div>
    );
  }

  const billingResult = await getBillingHistoryAction(subscription.id, {
    page: 1,
    pageSize: 10,
  });

  if (billingResult.hasError || !billingResult.payload) {
    return (
      <div className="space-y-6">
        <BillingPageHeader
          title={t('pageTitle')}
          subtitle={t('pageDescription')}
        />
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
          <h2 className="text-lg font-semibold text-destructive">
            {t('error')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {billingResult.message || t('errorDescription')}
          </p>
        </div>
      </div>
    );
  }

  const { data: payments, page, totalPages } = billingResult.payload;

  return (
    <div className="space-y-6">
      <BillingPageHeader
        title={t('pageTitle')}
        subtitle={t('pageDescription')}
      />

      <BillingFilters />

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <BillingHistoryTable
          payments={payments}
          emptyMessage={t('noPayments')}
        />
      </div>

      {totalPages > 1 && (
        <div className="text-center text-sm text-muted-foreground">
          {t('pagination', { page, totalPages })}
        </div>
      )}
    </div>
  );
}
