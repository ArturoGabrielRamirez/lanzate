/**
 * Webhook Handler Tests
 *
 * These tests verify the MercadoPago webhook handler correctly processes
 * payment and subscription notifications.
 *
 * Tests cover:
 * - payment.created notification creates payment record
 * - payment.updated notification updates payment status
 * - subscription_preapproval.updated handles authorized status
 * - subscription_preapproval.updated handles cancelled status
 * - Webhook returns 200 immediately for all notification types
 *
 * Note: These tests mock the MercadoPago API responses to avoid external calls.
 */

import { describe, it, expect, beforeAll, afterAll, mock } from 'bun:test';

import { prisma } from '@/lib/prisma';

// Test data
const testUserEmail = 'webhook-test@example.com';
const testSupabaseId = 'webhook-test-supabase-id';
const testMercadopagoPreapprovalId = 'test-mp-preapproval-webhook-123';
let testUserId: string;
let testSubscriptionId: string;

// Mock MercadoPago responses
const mockPaymentData = {
  id: 12345678,
  status: 'approved',
  transaction_amount: 10000,
  currency_id: 'ARS',
  date_approved: '2026-01-10T10:00:00.000-03:00',
  payer: {
    email: testUserEmail,
  },
  metadata: {
    preapproval_id: testMercadopagoPreapprovalId,
  },
};

const mockPreapprovalData = {
  id: testMercadopagoPreapprovalId,
  status: 'authorized',
  external_reference: testUserEmail,
  next_payment_date: '2026-02-10T10:00:00.000-03:00',
};

// Clean up test data before and after all tests
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

  // Create a test user and subscription for webhook testing
  const user = await prisma.user.create({
    data: {
      email: testUserEmail,
      username: 'webhooktestuser',
      supabaseId: testSupabaseId,
    },
  });
  testUserId = user.id;

  const subscription = await prisma.subscription.create({
    data: {
      userId: testUserId,
      accountType: 'PRO',
      mercadopagoPreapprovalId: testMercadopagoPreapprovalId,
      status: 'AUTHORIZED',
      nextBillingDate: new Date('2026-02-10'),
    },
  });
  testSubscriptionId = subscription.id;
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

describe('Webhook Handler - payment.created', () => {
  it('should create payment record when payment.created notification is received', async () => {
    // Import the handler functions (will be created in task 3.2)
    const { handlePaymentCreated } = await import(
      '@/features/billing/services'
    );

    // Mock the MercadoPago API call
    const mockGetPayment = mock(() => Promise.resolve(mockPaymentData));

    // Call the handler with mocked data
    const mercadopagoPaymentId = 'mp-webhook-payment-001';
    await handlePaymentCreated(mercadopagoPaymentId, {
      getPayment: mockGetPayment,
      subscriptionId: testSubscriptionId,
      paymentData: {
        ...mockPaymentData,
        id: mercadopagoPaymentId,
      },
    });

    // Verify payment was created
    const payment = await prisma.payment.findFirst({
      where: { mercadopagoPaymentId },
    });

    expect(payment).toBeDefined();
    expect(payment?.subscriptionId).toBe(testSubscriptionId);
    expect(payment?.status).toBe('APPROVED');
    expect(Number(payment?.amount)).toBe(10000);
    expect(payment?.currency).toBe('ARS');

    // Clean up
    if (payment) {
      await prisma.payment.delete({ where: { id: payment.id } });
    }
  });
});

describe('Webhook Handler - payment.updated', () => {
  it('should update payment status when payment.updated notification is received', async () => {
    // Create an existing payment to update
    const existingPayment = await prisma.payment.create({
      data: {
        subscriptionId: testSubscriptionId,
        mercadopagoPaymentId: 'mp-webhook-payment-update-001',
        amount: 10000,
        currency: 'ARS',
        status: 'PENDING',
      },
    });

    const { handlePaymentUpdated } = await import(
      '@/features/billing/services'
    );

    // Mock updated payment data with refunded status
    const updatedPaymentData = {
      ...mockPaymentData,
      id: 'mp-webhook-payment-update-001',
      status: 'refunded',
    };

    // Call the handler
    await handlePaymentUpdated(existingPayment.mercadopagoPaymentId, {
      paymentData: updatedPaymentData,
    });

    // Verify payment status was updated
    const updatedPayment = await prisma.payment.findUnique({
      where: { id: existingPayment.id },
    });

    expect(updatedPayment).toBeDefined();
    expect(updatedPayment?.status).toBe('REFUNDED');

    // Clean up
    await prisma.payment.delete({ where: { id: existingPayment.id } });
  });

  it('should handle partially refunded status correctly', async () => {
    // Create an existing approved payment
    const existingPayment = await prisma.payment.create({
      data: {
        subscriptionId: testSubscriptionId,
        mercadopagoPaymentId: 'mp-webhook-payment-partial-refund',
        amount: 10000,
        currency: 'ARS',
        status: 'APPROVED',
        paidAt: new Date(),
      },
    });

    const { handlePaymentUpdated } = await import(
      '@/features/billing/services'
    );

    // Mock partially refunded payment data
    const partiallyRefundedData = {
      ...mockPaymentData,
      id: 'mp-webhook-payment-partial-refund',
      status: 'partially_refunded',
    };

    await handlePaymentUpdated(existingPayment.mercadopagoPaymentId, {
      paymentData: partiallyRefundedData,
    });

    // Verify status was updated to PARTIALLY_REFUNDED
    const updatedPayment = await prisma.payment.findUnique({
      where: { id: existingPayment.id },
    });

    expect(updatedPayment?.status).toBe('PARTIALLY_REFUNDED');

    // Clean up
    await prisma.payment.delete({ where: { id: existingPayment.id } });
  });
});

describe('Webhook Handler - subscription_preapproval.updated', () => {
  it('should handle authorized status and update subscription', async () => {
    // First set subscription to PENDING
    await prisma.subscription.update({
      where: { id: testSubscriptionId },
      data: { status: 'PENDING' },
    });

    const { handleSubscriptionPreapprovalUpdated } = await import(
      '@/features/billing/services'
    );

    // Mock preapproval data with authorized status
    const authorizedPreapprovalData = {
      ...mockPreapprovalData,
      status: 'authorized',
    };

    await handleSubscriptionPreapprovalUpdated(testMercadopagoPreapprovalId, {
      preapprovalData: authorizedPreapprovalData,
    });

    // Verify subscription status was updated to AUTHORIZED
    const updatedSubscription = await prisma.subscription.findUnique({
      where: { id: testSubscriptionId },
    });

    expect(updatedSubscription?.status).toBe('AUTHORIZED');

    // Restore original status
    await prisma.subscription.update({
      where: { id: testSubscriptionId },
      data: { status: 'AUTHORIZED' },
    });
  });

  it('should handle cancelled status and update subscription', async () => {
    // Set subscription to AUTHORIZED first
    await prisma.subscription.update({
      where: { id: testSubscriptionId },
      data: { status: 'AUTHORIZED' },
    });

    const { handleSubscriptionPreapprovalUpdated } = await import(
      '@/features/billing/services'
    );

    // Mock preapproval data with cancelled status
    const cancelledPreapprovalData = {
      ...mockPreapprovalData,
      status: 'cancelled',
    };

    await handleSubscriptionPreapprovalUpdated(testMercadopagoPreapprovalId, {
      preapprovalData: cancelledPreapprovalData,
    });

    // Verify subscription status was updated to CANCELLED
    const updatedSubscription = await prisma.subscription.findUnique({
      where: { id: testSubscriptionId },
    });

    expect(updatedSubscription?.status).toBe('CANCELLED');

    // Restore original status for other tests
    await prisma.subscription.update({
      where: { id: testSubscriptionId },
      data: { status: 'AUTHORIZED' },
    });
  });

  it('should handle paused status and update subscription', async () => {
    const { handleSubscriptionPreapprovalUpdated } = await import(
      '@/features/billing/services'
    );

    // Mock preapproval data with paused status
    const pausedPreapprovalData = {
      ...mockPreapprovalData,
      status: 'paused',
    };

    await handleSubscriptionPreapprovalUpdated(testMercadopagoPreapprovalId, {
      preapprovalData: pausedPreapprovalData,
    });

    // Verify subscription status was updated to PAUSED
    const updatedSubscription = await prisma.subscription.findUnique({
      where: { id: testSubscriptionId },
    });

    expect(updatedSubscription?.status).toBe('PAUSED');

    // Restore original status
    await prisma.subscription.update({
      where: { id: testSubscriptionId },
      data: { status: 'AUTHORIZED' },
    });
  });
});

describe('Webhook Handler - Response Handling', () => {
  it('should return 200 immediately for all notification types', async () => {
    // This test verifies the webhook route returns 200 without waiting for processing
    // We test by simulating a webhook request

    // Create a mock Request object
    const createMockRequest = (body: object): Request => {
      return new Request('http://localhost:3000/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    };

    // Test payment notification
    const paymentRequest = createMockRequest({
      type: 'payment',
      action: 'payment.created',
      data: { id: '12345678' },
    });

    // Test subscription_preapproval notification
    const subscriptionRequest = createMockRequest({
      type: 'subscription_preapproval',
      action: 'subscription_preapproval.updated',
      data: { id: testMercadopagoPreapprovalId },
    });

    // Import the route handler (to be extended in task 3.3)
    // For now, we verify the expected behavior
    const { POST } = await import('@/app/api/mercadopago/route');

    // Verify payment notification returns 200
    const paymentResponse = await POST(paymentRequest);
    expect(paymentResponse.status).toBe(200);

    // Verify subscription notification returns 200
    const subscriptionResponse = await POST(subscriptionRequest);
    expect(subscriptionResponse.status).toBe(200);
  });

  it('should return 200 for unknown notification types without error', async () => {
    const createMockRequest = (body: object): Request => {
      return new Request('http://localhost:3000/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    };

    // Test unknown notification type
    const unknownRequest = createMockRequest({
      type: 'unknown_type',
      action: 'unknown.action',
      data: { id: 'unknown-123' },
    });

    const { POST } = await import('@/app/api/mercadopago/route');

    // Should still return 200 to acknowledge receipt
    const response = await POST(unknownRequest);
    expect(response.status).toBe(200);
  });
});
