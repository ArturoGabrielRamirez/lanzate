/**
 * SubscriptionStatusCard Component Tests
 *
 * Tests the SubscriptionStatusCard component for:
 * - Displaying current plan type and status
 * - Displaying next billing date (formatted)
 * - "Ver historial de pagos" link navigating to /account/billing
 *
 * Priority: HIGH - Core billing feature component
 */

import { describe, it, expect, afterEach, mock } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import type { SubscriptionStatus } from '@/features/billing/types/billing';

// Mock the next-intl navigation Link component
mock.module('@/i18n/navigation', () => ({
  Link: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

// Import after mocking
import { SubscriptionStatusCard } from '@/features/billing/components/subscription-status-card';

// Cleanup after each test to prevent element leakage
afterEach(() => {
  cleanup();
});

describe('SubscriptionStatusCard Component', () => {
  // Default mock subscription status for testing
  const mockSubscriptionStatus: SubscriptionStatus = {
    planType: 'PRO',
    status: 'AUTHORIZED',
    nextBillingDate: new Date('2025-02-15T10:00:00Z'),
    mercadopagoId: 'mp_preapproval_123456',
    lastPayment: {
      amount: 10000,
      status: 'APPROVED',
      paidAt: new Date('2025-01-15T10:00:00Z'),
    },
  };

  describe('Plan Type and Status Display', () => {
    it('should display current plan type and subscription status', () => {
      const { getByText } = render(
        <SubscriptionStatusCard subscriptionStatus={mockSubscriptionStatus} />
      );

      // Verify plan type is displayed (PRO)
      expect(getByText('PRO')).toBeDefined();

      // Verify subscription status is displayed (AUTHORIZED)
      // The component may display this as a badge or text
      expect(getByText(/AUTHORIZED|Activa|Autorizada/i)).toBeDefined();
    });
  });

  describe('Next Billing Date Display', () => {
    it('should display next billing date formatted correctly', () => {
      const { getByText } = render(
        <SubscriptionStatusCard subscriptionStatus={mockSubscriptionStatus} />
      );

      // Verify next billing date is displayed
      // The date should be formatted in a user-friendly way
      // Expected format variations: "15/02/2025", "15 de febrero de 2025", "Feb 15, 2025"
      // We check for the presence of "15" and either "febrero" or "Feb" or "02"
      const cardText = document.body.textContent || '';
      const hasFormattedDate =
        cardText.includes('15') &&
        (cardText.includes('febrero') ||
          cardText.includes('Feb') ||
          cardText.includes('02') ||
          cardText.includes('2025'));

      expect(hasFormattedDate).toBe(true);
    });
  });

  describe('Billing History Link', () => {
    it('should include "Ver historial de pagos" link to /account/billing', () => {
      const { getByRole } = render(
        <SubscriptionStatusCard subscriptionStatus={mockSubscriptionStatus} />
      );

      // Find the link to billing history
      const billingLink = getByRole('link', { name: /ver historial de pagos/i });

      // Verify the link exists and has correct href
      expect(billingLink).toBeDefined();
      expect(billingLink.getAttribute('href')).toBe('/account/billing');
    });
  });
});
