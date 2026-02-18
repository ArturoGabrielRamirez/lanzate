/**
 * Billing Server Actions Tests
 *
 * These tests verify the server actions for the billing feature work correctly.
 * Tests are written following TDD principles - actions will be created in later tasks.
 *
 * Tests cover:
 * - getBillingHistoryAction: returns paginated payments with filters
 * - getSubscriptionStatusAction: returns current subscription details
 * - downloadInvoiceAction: generates PDF for valid payment
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';

import type { PaymentFilters } from '@/features/billing/types/billing';
import { prisma } from '@/lib/prisma';

// Test data
const testUserEmail = 'billing-actions-test@example.com';
const testSupabaseId = 'billing-actions-test-supabase-id';
let testUserId: string;
let testSubscriptionId: string;
let testPaymentId: string;

// Clean up and set up test data
beforeAll(async () => {
  // Clean up any existing test data in reverse order of dependencies
  await prisma.invoice.deleteMany({
    where: {
      payment: {
        subscription: {
          user: { email: testUserEmail },
        },
      },
    },
  });

  await prisma.payment.deleteMany({
    where: {
      subscription: {
        user: { email: testUserEmail },
      },
    },
  });

  await prisma.planChangeLog.deleteMany({
    where: {
      subscription: {
        user: { email: testUserEmail },
      },
    },
  });

  await prisma.subscription.deleteMany({
    where: {
      user: { email: testUserEmail },
    },
  });

  await prisma.user.deleteMany({
    where: { email: testUserEmail },
  });

  // Create a test user with subscription and payments
  const user = await prisma.user.create({
    data: {
      email: testUserEmail,
      username: 'billingactionstestuser',
      supabaseId: testSupabaseId,
    },
  });
  testUserId = user.id;

  const subscription = await prisma.subscription.create({
    data: {
      userId: testUserId,
      accountType: 'PRO',
      mercadopagoPreapprovalId: 'test-mp-preapproval-actions-123',
      status: 'AUTHORIZED',
      nextBillingDate: new Date('2026-02-10'),
    },
  });
  testSubscriptionId = subscription.id;

  // Create multiple payments for pagination testing
  const payment1 = await prisma.payment.create({
    data: {
      subscriptionId: testSubscriptionId,
      mercadopagoPaymentId: 'mp-action-test-001',
      amount: 10000,
      currency: 'ARS',
      status: 'APPROVED',
      paidAt: new Date('2026-01-05'),
    },
  });
  testPaymentId = payment1.id;

  await prisma.payment.create({
    data: {
      subscriptionId: testSubscriptionId,
      mercadopagoPaymentId: 'mp-action-test-002',
      amount: 10000,
      currency: 'ARS',
      status: 'APPROVED',
      paidAt: new Date('2026-01-10'),
    },
  });

  await prisma.payment.create({
    data: {
      subscriptionId: testSubscriptionId,
      mercadopagoPaymentId: 'mp-action-test-003',
      amount: 10000,
      currency: 'ARS',
      status: 'REFUNDED',
      paidAt: new Date('2025-12-15'),
    },
  });

  // Create an invoice for the first payment
  await prisma.invoice.create({
    data: {
      paymentId: testPaymentId,
      invoiceNumber: 'INV-TEST-001',
      issuedAt: new Date('2026-01-05'),
      customerName: 'Test User',
      customerEmail: testUserEmail,
      subtotal: 8264.46,
      ivaAmount: 1735.54,
      total: 10000,
    },
  });
});

afterAll(async () => {
  // Clean up test data in correct order (child to parent)
  await prisma.invoice.deleteMany({
    where: {
      payment: { subscriptionId: testSubscriptionId },
    },
  });

  await prisma.payment.deleteMany({
    where: { subscriptionId: testSubscriptionId },
  });

  await prisma.planChangeLog.deleteMany({
    where: { subscriptionId: testSubscriptionId },
  });

  await prisma.subscription.deleteMany({
    where: { userId: testUserId },
  });

  await prisma.user.deleteMany({
    where: { id: testUserId },
  });
});

describe('getBillingHistoryAction', () => {
  it('should return paginated payments with default filters', async () => {
    const { getBillingHistoryAction } = await import(
      '@/features/billing/actions/get-billing-history.action'
    );

    const filters: PaymentFilters = {
      page: 1,
      pageSize: 10,
    };

    const result = await getBillingHistoryAction(testSubscriptionId, filters);

    // Verify ServerResponse structure
    expect(result).toHaveProperty('hasError');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('payload');

    // Should succeed
    expect(result.hasError).toBe(false);

    // Verify paginated response structure
    expect(result.payload).toHaveProperty('data');
    expect(result.payload).toHaveProperty('total');
    expect(result.payload).toHaveProperty('page');
    expect(result.payload).toHaveProperty('pageSize');
    expect(result.payload).toHaveProperty('totalPages');

    // Should have 3 payments
    expect(result.payload?.total).toBe(3);
    expect(Array.isArray(result.payload?.data)).toBe(true);
  });

  it('should filter payments by status', async () => {
    const { getBillingHistoryAction } = await import(
      '@/features/billing/actions/get-billing-history.action'
    );

    const filters: PaymentFilters = {
      page: 1,
      pageSize: 10,
      status: 'REFUNDED',
    };

    const result = await getBillingHistoryAction(testSubscriptionId, filters);

    expect(result.hasError).toBe(false);
    expect(result.payload?.data.length).toBe(1);
    expect(result.payload?.data[0].status).toBe('REFUNDED');
  });

  it('should filter payments by date range', async () => {
    const { getBillingHistoryAction } = await import(
      '@/features/billing/actions/get-billing-history.action'
    );

    const filters: PaymentFilters = {
      page: 1,
      pageSize: 10,
      dateFrom: new Date('2026-01-01'),
      dateTo: new Date('2026-01-31'),
    };

    const result = await getBillingHistoryAction(testSubscriptionId, filters);

    expect(result.hasError).toBe(false);
    // Should only include January 2026 payments (2 payments)
    expect(result.payload?.data.length).toBe(2);
  });
});

describe('getSubscriptionStatusAction', () => {
  it('should return current subscription details', async () => {
    const { getSubscriptionStatusAction } = await import(
      '@/features/billing/actions/get-subscription-status.action'
    );

    const result = await getSubscriptionStatusAction(testSubscriptionId);

    // Verify ServerResponse structure
    expect(result).toHaveProperty('hasError');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('payload');

    // Should succeed
    expect(result.hasError).toBe(false);

    // Verify subscription status structure
    expect(result.payload).toHaveProperty('planType');
    expect(result.payload).toHaveProperty('status');
    expect(result.payload).toHaveProperty('nextBillingDate');
    expect(result.payload).toHaveProperty('mercadopagoId');

    // Verify values
    expect(result.payload?.planType).toBe('PRO');
    expect(result.payload?.status).toBe('AUTHORIZED');
    expect(result.payload?.mercadopagoId).toBe('test-mp-preapproval-actions-123');
  });

  it('should include last payment info if available', async () => {
    const { getSubscriptionStatusAction } = await import(
      '@/features/billing/actions/get-subscription-status.action'
    );

    const result = await getSubscriptionStatusAction(testSubscriptionId);

    expect(result.hasError).toBe(false);
    expect(result.payload).toHaveProperty('lastPayment');

    // Last payment should be the most recent one
    if (result.payload?.lastPayment) {
      expect(result.payload.lastPayment).toHaveProperty('amount');
      expect(result.payload.lastPayment).toHaveProperty('status');
      expect(result.payload.lastPayment).toHaveProperty('paidAt');
    }
  });
});

describe('downloadInvoiceAction', () => {
  it('should generate PDF buffer for valid payment with invoice', async () => {
    const { downloadInvoiceAction } = await import(
      '@/features/billing/actions/download-invoice.action'
    );

    const result = await downloadInvoiceAction(testPaymentId);

    // Verify ServerResponse structure
    expect(result).toHaveProperty('hasError');
    expect(result).toHaveProperty('message');
    expect(result).toHaveProperty('payload');

    // Should succeed
    expect(result.hasError).toBe(false);

    // Payload should contain PDF data
    expect(result.payload).toHaveProperty('buffer');
    expect(result.payload).toHaveProperty('filename');

    // Buffer should be a valid Buffer or base64 string
    expect(result.payload?.buffer).toBeDefined();
    expect(result.payload?.filename).toContain('INV-TEST-001');
  });

  it('should return error for payment without invoice', async () => {
    const { downloadInvoiceAction } = await import(
      '@/features/billing/actions/download-invoice.action'
    );

    // Create a payment without an invoice for this test
    const paymentWithoutInvoice = await prisma.payment.create({
      data: {
        subscriptionId: testSubscriptionId,
        mercadopagoPaymentId: 'mp-action-no-invoice',
        amount: 10000,
        currency: 'ARS',
        status: 'PENDING',
      },
    });

    try {
      const result = await downloadInvoiceAction(paymentWithoutInvoice.id);

      expect(result.hasError).toBe(true);
      expect(result.message).toBeTruthy();
    } finally {
      // Clean up
      await prisma.payment.delete({
        where: { id: paymentWithoutInvoice.id },
      });
    }
  });

  it('should return error for non-existent payment', async () => {
    const { downloadInvoiceAction } = await import(
      '@/features/billing/actions/download-invoice.action'
    );

    const result = await downloadInvoiceAction('non-existent-payment-id');

    expect(result.hasError).toBe(true);
    expect(result.message).toBeTruthy();
  });
});
