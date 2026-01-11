/**
 * Billing Models Tests
 *
 * These tests verify the Payment, Invoice, and PlanChangeLog Prisma models work correctly,
 * as well as the Subscription model extensions for MercadoPago integration.
 * Tests are written following TDD principles - models will be created in later tasks.
 *
 * Tests cover:
 * - Payment model: creation with required fields, status enum validation, AFIP-ready fields
 * - Invoice model: creation and payment association
 * - PlanChangeLog model: initiator tracking with InitiatorType enum
 * - Subscription model: MercadoPago fields extension
 * - Enum values: PaymentStatus, SubscriptionStatus, InitiatorType
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { prisma } from '@/lib/prisma';

// Test data
const testUserEmail = 'billing-test-user@example.com';
const testSupabaseId = 'billing-test-supabase-id';
let testUserId: string;
let testSubscriptionId: string;
let testPaymentId: string;

// Clean up test data before and after all tests
beforeAll(async () => {
  // Clean up any existing test data in reverse order of dependencies
  await prisma.invoice.deleteMany({
    where: {
      payment: {
        subscription: {
          user: {
            email: testUserEmail,
          },
        },
      },
    },
  });

  await prisma.payment.deleteMany({
    where: {
      subscription: {
        user: {
          email: testUserEmail,
        },
      },
    },
  });

  await prisma.planChangeLog.deleteMany({
    where: {
      subscription: {
        user: {
          email: testUserEmail,
        },
      },
    },
  });

  await prisma.subscription.deleteMany({
    where: {
      user: {
        email: testUserEmail,
      },
    },
  });

  await prisma.user.deleteMany({
    where: {
      email: testUserEmail,
    },
  });

  // Create a test user and subscription for relationship testing
  const user = await prisma.user.create({
    data: {
      email: testUserEmail,
      username: 'billingtestuser',
      supabaseId: testSupabaseId,
    },
  });
  testUserId = user.id;

  // Create a subscription for the user with MercadoPago fields
  const subscription = await prisma.subscription.create({
    data: {
      userId: testUserId,
      accountType: 'PRO',
      mercadopagoPreapprovalId: 'test-mp-preapproval-123',
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
      payment: {
        subscriptionId: testSubscriptionId,
      },
    },
  });

  await prisma.payment.deleteMany({
    where: {
      subscriptionId: testSubscriptionId,
    },
  });

  await prisma.planChangeLog.deleteMany({
    where: {
      subscriptionId: testSubscriptionId,
    },
  });

  await prisma.subscription.deleteMany({
    where: {
      userId: testUserId,
    },
  });

  await prisma.user.deleteMany({
    where: {
      id: testUserId,
    },
  });
});

describe('Payment Model', () => {
  it('should create payment with required fields and validate PaymentStatus enum', async () => {
    const payment = await prisma.payment.create({
      data: {
        subscriptionId: testSubscriptionId,
        mercadopagoPaymentId: 'mp-payment-001',
        amount: 10000.0,
        currency: 'ARS',
        status: 'APPROVED',
        paidAt: new Date(),
      },
    });

    testPaymentId = payment.id;

    expect(payment).toBeDefined();
    expect(payment.subscriptionId).toBe(testSubscriptionId);
    expect(payment.mercadopagoPaymentId).toBe('mp-payment-001');
    expect(Number(payment.amount)).toBe(10000.0);
    expect(payment.currency).toBe('ARS');
    expect(payment.status).toBe('APPROVED');
    expect(payment.paidAt).toBeInstanceOf(Date);
    expect(payment.createdAt).toBeInstanceOf(Date);
    expect(payment.updatedAt).toBeInstanceOf(Date);
  });

  it('should support all PaymentStatus enum values including refund statuses', async () => {
    // Test PENDING status
    const pendingPayment = await prisma.payment.create({
      data: {
        subscriptionId: testSubscriptionId,
        mercadopagoPaymentId: 'mp-payment-pending',
        amount: 10000.0,
        currency: 'ARS',
        status: 'PENDING',
      },
    });
    expect(pendingPayment.status).toBe('PENDING');

    // Test REJECTED status
    await prisma.payment.update({
      where: { id: pendingPayment.id },
      data: { status: 'REJECTED' },
    });
    let updated = await prisma.payment.findUnique({ where: { id: pendingPayment.id } });
    expect(updated?.status).toBe('REJECTED');

    // Test REFUNDED status
    await prisma.payment.update({
      where: { id: pendingPayment.id },
      data: { status: 'REFUNDED' },
    });
    updated = await prisma.payment.findUnique({ where: { id: pendingPayment.id } });
    expect(updated?.status).toBe('REFUNDED');

    // Test PARTIALLY_REFUNDED status
    await prisma.payment.update({
      where: { id: pendingPayment.id },
      data: { status: 'PARTIALLY_REFUNDED' },
    });
    updated = await prisma.payment.findUnique({ where: { id: pendingPayment.id } });
    expect(updated?.status).toBe('PARTIALLY_REFUNDED');

    // Test CANCELLED status
    await prisma.payment.update({
      where: { id: pendingPayment.id },
      data: { status: 'CANCELLED' },
    });
    updated = await prisma.payment.findUnique({ where: { id: pendingPayment.id } });
    expect(updated?.status).toBe('CANCELLED');

    // Clean up
    await prisma.payment.delete({ where: { id: pendingPayment.id } });
  });

  it('should store AFIP-ready fields including cuit, ivaAmount, netAmount, and nullable caeCode', async () => {
    const paymentWithAfip = await prisma.payment.create({
      data: {
        subscriptionId: testSubscriptionId,
        mercadopagoPaymentId: 'mp-payment-afip',
        amount: 12100.0,
        currency: 'ARS',
        status: 'APPROVED',
        paidAt: new Date(),
        // AFIP-ready fields
        cuit: '20-12345678-9',
        ivaAmount: 2100.0,
        netAmount: 10000.0,
        caeCode: null, // nullable for future AFIP integration
      },
    });

    expect(paymentWithAfip.cuit).toBe('20-12345678-9');
    expect(Number(paymentWithAfip.ivaAmount)).toBe(2100.0);
    expect(Number(paymentWithAfip.netAmount)).toBe(10000.0);
    expect(paymentWithAfip.caeCode).toBeNull();

    // Clean up
    await prisma.payment.delete({ where: { id: paymentWithAfip.id } });
  });
});

describe('Invoice Model', () => {
  it('should create invoice with payment association and sequential invoice number', async () => {
    const invoice = await prisma.invoice.create({
      data: {
        paymentId: testPaymentId,
        invoiceNumber: 'INV-2026-0001',
        issuedAt: new Date(),
        customerName: 'Test Customer',
        customerEmail: testUserEmail,
        // AFIP-ready fields
        subtotal: 10000.0,
        ivaAmount: 2100.0,
        total: 12100.0,
      },
    });

    expect(invoice).toBeDefined();
    expect(invoice.paymentId).toBe(testPaymentId);
    expect(invoice.invoiceNumber).toBe('INV-2026-0001');
    expect(invoice.customerName).toBe('Test Customer');
    expect(invoice.customerEmail).toBe(testUserEmail);
    expect(Number(invoice.subtotal)).toBe(10000.0);
    expect(Number(invoice.ivaAmount)).toBe(2100.0);
    expect(Number(invoice.total)).toBe(12100.0);
    expect(invoice.issuedAt).toBeInstanceOf(Date);
    expect(invoice.createdAt).toBeInstanceOf(Date);

    // Verify one-to-one relationship with payment
    const paymentWithInvoice = await prisma.payment.findUnique({
      where: { id: testPaymentId },
      include: { invoice: true },
    });
    expect(paymentWithInvoice?.invoice).toBeDefined();
    expect(paymentWithInvoice?.invoice?.invoiceNumber).toBe('INV-2026-0001');

    // Clean up
    await prisma.invoice.delete({ where: { id: invoice.id } });
  });

  it('should store AFIP-ready invoice fields including customerCuit, caeCode, and caeExpirationDate', async () => {
    // Create a separate payment for this test to avoid unique constraint on paymentId
    const afipPayment = await prisma.payment.create({
      data: {
        subscriptionId: testSubscriptionId,
        mercadopagoPaymentId: 'mp-payment-afip-invoice',
        amount: 12100.0,
        currency: 'ARS',
        status: 'APPROVED',
        paidAt: new Date(),
      },
    });

    const invoiceWithAfip = await prisma.invoice.create({
      data: {
        paymentId: afipPayment.id,
        invoiceNumber: 'INV-2026-0002',
        issuedAt: new Date(),
        customerName: 'AFIP Test Customer',
        customerEmail: testUserEmail,
        // AFIP-ready fields
        customerCuit: '20-12345678-9',
        subtotal: 10000.0,
        ivaAmount: 2100.0,
        total: 12100.0,
        caeCode: null, // nullable for future
        caeExpirationDate: null, // nullable for future
      },
    });

    expect(invoiceWithAfip.customerCuit).toBe('20-12345678-9');
    expect(invoiceWithAfip.caeCode).toBeNull();
    expect(invoiceWithAfip.caeExpirationDate).toBeNull();

    // Clean up
    await prisma.invoice.delete({ where: { id: invoiceWithAfip.id } });
    await prisma.payment.delete({ where: { id: afipPayment.id } });
  });
});

describe('PlanChangeLog Model', () => {
  it('should create plan change log with initiator tracking using InitiatorType enum', async () => {
    // Test OWNER initiator
    const ownerChange = await prisma.planChangeLog.create({
      data: {
        subscriptionId: testSubscriptionId,
        previousPlan: 'FREE',
        newPlan: 'PRO',
        changedAt: new Date(),
        initiatorType: 'OWNER',
        initiatorId: testUserId,
      },
    });

    expect(ownerChange).toBeDefined();
    expect(ownerChange.subscriptionId).toBe(testSubscriptionId);
    expect(ownerChange.previousPlan).toBe('FREE');
    expect(ownerChange.newPlan).toBe('PRO');
    expect(ownerChange.initiatorType).toBe('OWNER');
    expect(ownerChange.initiatorId).toBe(testUserId);
    expect(ownerChange.changedAt).toBeInstanceOf(Date);
    expect(ownerChange.createdAt).toBeInstanceOf(Date);

    // Test EMPLOYEE initiator
    const employeeChange = await prisma.planChangeLog.create({
      data: {
        subscriptionId: testSubscriptionId,
        previousPlan: 'PRO',
        newPlan: 'ENTERPRISE',
        changedAt: new Date(),
        initiatorType: 'EMPLOYEE',
        initiatorId: 'employee-123',
      },
    });
    expect(employeeChange.initiatorType).toBe('EMPLOYEE');

    // Test SYSTEM initiator (webhook-triggered)
    const systemChange = await prisma.planChangeLog.create({
      data: {
        subscriptionId: testSubscriptionId,
        previousPlan: 'ENTERPRISE',
        newPlan: 'PRO',
        changedAt: new Date(),
        initiatorType: 'SYSTEM',
        initiatorId: null, // System changes may not have an initiatorId
      },
    });
    expect(systemChange.initiatorType).toBe('SYSTEM');
    expect(systemChange.initiatorId).toBeNull();

    // Clean up
    await prisma.planChangeLog.deleteMany({
      where: {
        id: { in: [ownerChange.id, employeeChange.id, systemChange.id] },
      },
    });
  });
});

describe('Subscription Model Extensions', () => {
  it('should support MercadoPago fields: mercadopagoPreapprovalId, status, nextBillingDate', async () => {
    // Fetch the subscription created in beforeAll
    const subscription = await prisma.subscription.findUnique({
      where: { id: testSubscriptionId },
    });

    expect(subscription).toBeDefined();
    expect(subscription?.mercadopagoPreapprovalId).toBe('test-mp-preapproval-123');
    expect(subscription?.status).toBe('AUTHORIZED');
    expect(subscription?.nextBillingDate).toBeInstanceOf(Date);
  });

  it('should validate SubscriptionStatus enum values: PENDING, AUTHORIZED, PAUSED, CANCELLED', async () => {
    // Use the existing subscription and test status transitions
    // Store original status to restore later
    const originalSubscription = await prisma.subscription.findUnique({
      where: { id: testSubscriptionId },
    });
    const originalStatus = originalSubscription?.status;

    // Test PENDING status
    await prisma.subscription.update({
      where: { id: testSubscriptionId },
      data: { status: 'PENDING' },
    });
    let updated = await prisma.subscription.findUnique({ where: { id: testSubscriptionId } });
    expect(updated?.status).toBe('PENDING');

    // Test AUTHORIZED status
    await prisma.subscription.update({
      where: { id: testSubscriptionId },
      data: { status: 'AUTHORIZED' },
    });
    updated = await prisma.subscription.findUnique({ where: { id: testSubscriptionId } });
    expect(updated?.status).toBe('AUTHORIZED');

    // Test PAUSED status
    await prisma.subscription.update({
      where: { id: testSubscriptionId },
      data: { status: 'PAUSED' },
    });
    updated = await prisma.subscription.findUnique({ where: { id: testSubscriptionId } });
    expect(updated?.status).toBe('PAUSED');

    // Test CANCELLED status
    await prisma.subscription.update({
      where: { id: testSubscriptionId },
      data: { status: 'CANCELLED' },
    });
    updated = await prisma.subscription.findUnique({ where: { id: testSubscriptionId } });
    expect(updated?.status).toBe('CANCELLED');

    // Restore original status
    if (originalStatus) {
      await prisma.subscription.update({
        where: { id: testSubscriptionId },
        data: { status: originalStatus },
      });
    }
  });

  it('should establish has_many relationships with Payment and PlanChangeLog', async () => {
    // Create a payment for the subscription
    const payment = await prisma.payment.create({
      data: {
        subscriptionId: testSubscriptionId,
        mercadopagoPaymentId: 'mp-payment-relation-test',
        amount: 10000.0,
        currency: 'ARS',
        status: 'APPROVED',
        paidAt: new Date(),
      },
    });

    // Create a plan change log for the subscription
    const planChangeLog = await prisma.planChangeLog.create({
      data: {
        subscriptionId: testSubscriptionId,
        previousPlan: 'FREE',
        newPlan: 'PRO',
        changedAt: new Date(),
        initiatorType: 'OWNER',
        initiatorId: testUserId,
      },
    });

    // Fetch subscription with relations
    const subscriptionWithRelations = await prisma.subscription.findUnique({
      where: { id: testSubscriptionId },
      include: {
        payments: true,
        planChangeLogs: true,
      },
    });

    expect(subscriptionWithRelations).toBeDefined();
    expect(subscriptionWithRelations?.payments).toBeDefined();
    expect(subscriptionWithRelations?.payments.length).toBeGreaterThanOrEqual(1);
    expect(subscriptionWithRelations?.planChangeLogs).toBeDefined();
    expect(subscriptionWithRelations?.planChangeLogs.length).toBeGreaterThanOrEqual(1);

    // Verify the specific records exist in the relations
    const paymentIds = subscriptionWithRelations?.payments.map((p) => p.mercadopagoPaymentId);
    expect(paymentIds).toContain('mp-payment-relation-test');

    // Clean up
    await prisma.payment.delete({ where: { id: payment.id } });
    await prisma.planChangeLog.delete({ where: { id: planChangeLog.id } });
  });
});
