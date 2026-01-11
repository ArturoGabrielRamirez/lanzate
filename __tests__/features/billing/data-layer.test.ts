/**
 * Billing Data Layer Tests
 *
 * These tests verify the data layer functions for the billing feature work correctly.
 * Tests are written following TDD principles - data functions will be created in later tasks.
 *
 * Tests cover:
 * - createPaymentData: creates payment record with required fields
 * - updatePaymentStatusData: updates payment status correctly
 * - createInvoiceData: creates invoice with sequential number
 * - getPaymentsBySubscriptionData: returns paginated results with filters
 * - createPlanChangeLogData: records plan changes with initiator tracking
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { prisma } from '@/lib/prisma';
import {
  createPaymentData,
  updatePaymentStatusData,
  getPaymentByMercadopagoIdData,
  getPaymentsBySubscriptionData,
  createInvoiceData,
  getInvoiceByPaymentIdData,
  getNextInvoiceNumberData,
  createPlanChangeLogData,
  getPlanChangeLogsBySubscriptionData,
} from '@/features/billing/data';
import type {
  CreatePaymentInput,
  CreateInvoiceInput,
  CreatePlanChangeLogInput,
} from '@/features/billing/types/billing';

// Test data
const testUserEmail = 'billing-data-test@example.com';
const testSupabaseId = 'billing-data-test-supabase-id';
let testUserId: string;
let testSubscriptionId: string;

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

  // Create a test user and subscription for relationship testing
  const user = await prisma.user.create({
    data: {
      email: testUserEmail,
      username: 'billingdatatestuser',
      supabaseId: testSupabaseId,
    },
  });
  testUserId = user.id;

  const subscription = await prisma.subscription.create({
    data: {
      userId: testUserId,
      accountType: 'PRO',
      mercadopagoPreapprovalId: 'test-mp-preapproval-data-123',
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

describe('Payment Data Functions', () => {
  let createdPaymentId: string;

  it('should create payment record with createPaymentData', async () => {
    const input: CreatePaymentInput = {
      subscriptionId: testSubscriptionId,
      mercadopagoPaymentId: 'mp-data-test-001',
      amount: 10000,
      currency: 'ARS',
      status: 'APPROVED',
      paidAt: new Date(),
    };

    const payment = await createPaymentData(input);
    createdPaymentId = payment.id;

    expect(payment).toBeDefined();
    expect(payment.id).toBeDefined();
    expect(payment.subscriptionId).toBe(testSubscriptionId);
    expect(payment.mercadopagoPaymentId).toBe('mp-data-test-001');
    expect(Number(payment.amount)).toBe(10000);
    expect(payment.currency).toBe('ARS');
    expect(payment.status).toBe('APPROVED');
    expect(payment.paidAt).toBeInstanceOf(Date);
    expect(payment.createdAt).toBeInstanceOf(Date);
    expect(payment.updatedAt).toBeInstanceOf(Date);
  });

  it('should update payment status with updatePaymentStatusData', async () => {
    // First create a payment to update
    const input: CreatePaymentInput = {
      subscriptionId: testSubscriptionId,
      mercadopagoPaymentId: 'mp-data-test-status-update',
      amount: 10000,
      currency: 'ARS',
      status: 'PENDING',
    };

    const payment = await createPaymentData(input);

    // Update to APPROVED
    const updatedPayment = await updatePaymentStatusData(payment.id, 'APPROVED');
    expect(updatedPayment.status).toBe('APPROVED');

    // Update to REFUNDED
    const refundedPayment = await updatePaymentStatusData(payment.id, 'REFUNDED');
    expect(refundedPayment.status).toBe('REFUNDED');

    // Clean up
    await prisma.payment.delete({ where: { id: payment.id } });
  });

  it('should get payment by MercadoPago ID with getPaymentByMercadopagoIdData', async () => {
    const mpPaymentId = 'mp-data-test-find-by-mp-id';
    const input: CreatePaymentInput = {
      subscriptionId: testSubscriptionId,
      mercadopagoPaymentId: mpPaymentId,
      amount: 15000,
      currency: 'ARS',
      status: 'APPROVED',
      paidAt: new Date(),
    };

    await createPaymentData(input);

    const foundPayment = await getPaymentByMercadopagoIdData(mpPaymentId);

    expect(foundPayment).toBeDefined();
    expect(foundPayment?.mercadopagoPaymentId).toBe(mpPaymentId);
    expect(Number(foundPayment?.amount)).toBe(15000);

    // Test not found case
    const notFound = await getPaymentByMercadopagoIdData('non-existent-mp-id');
    expect(notFound).toBeNull();

    // Clean up
    if (foundPayment) {
      await prisma.payment.delete({ where: { id: foundPayment.id } });
    }
  });

  it('should return paginated results with getPaymentsBySubscriptionData', async () => {
    // Create multiple payments for pagination testing
    const payments = [];
    for (let i = 0; i < 5; i++) {
      const payment = await createPaymentData({
        subscriptionId: testSubscriptionId,
        mercadopagoPaymentId: `mp-data-test-pagination-${i}`,
        amount: 10000 + i * 1000,
        currency: 'ARS',
        status: i < 3 ? 'APPROVED' : 'PENDING',
        paidAt: i < 3 ? new Date() : undefined,
      });
      payments.push(payment);
    }

    // Test basic pagination
    const page1 = await getPaymentsBySubscriptionData(testSubscriptionId, {
      page: 1,
      pageSize: 2,
    });

    expect(page1.data).toBeDefined();
    expect(page1.data.length).toBe(2);
    expect(page1.total).toBeGreaterThanOrEqual(5);
    expect(page1.page).toBe(1);
    expect(page1.pageSize).toBe(2);

    // Test second page
    const page2 = await getPaymentsBySubscriptionData(testSubscriptionId, {
      page: 2,
      pageSize: 2,
    });
    expect(page2.data.length).toBe(2);
    expect(page2.page).toBe(2);

    // Test status filter
    const approvedOnly = await getPaymentsBySubscriptionData(testSubscriptionId, {
      page: 1,
      pageSize: 10,
      status: 'APPROVED',
    });
    expect(approvedOnly.data.every((p) => p.status === 'APPROVED')).toBe(true);

    // Clean up
    for (const payment of payments) {
      await prisma.payment.delete({ where: { id: payment.id } });
    }

    // Clean up first test payment
    if (createdPaymentId) {
      await prisma.payment.delete({ where: { id: createdPaymentId } });
    }
  });
});

describe('Invoice Data Functions', () => {
  let testPaymentId: string;

  beforeAll(async () => {
    // Create a payment for invoice testing
    const payment = await prisma.payment.create({
      data: {
        subscriptionId: testSubscriptionId,
        mercadopagoPaymentId: 'mp-invoice-test-payment',
        amount: 10000,
        currency: 'ARS',
        status: 'APPROVED',
        paidAt: new Date(),
      },
    });
    testPaymentId = payment.id;
  });

  afterAll(async () => {
    // Clean up invoice test payment
    await prisma.invoice.deleteMany({
      where: { paymentId: testPaymentId },
    });
    await prisma.payment.delete({ where: { id: testPaymentId } });
  });

  it('should create invoice with sequential number using createInvoiceData', async () => {
    const input: CreateInvoiceInput = {
      paymentId: testPaymentId,
      customerName: 'Test Customer',
      customerEmail: testUserEmail,
      subtotal: 8264.46,
      ivaAmount: 1735.54,
      total: 10000,
    };

    const invoice = await createInvoiceData(input);

    expect(invoice).toBeDefined();
    expect(invoice.id).toBeDefined();
    expect(invoice.paymentId).toBe(testPaymentId);
    expect(invoice.invoiceNumber).toBeDefined();
    expect(invoice.invoiceNumber).toMatch(/^INV-\d{4}-\d{4,}$/); // Format: INV-YYYY-NNNN
    expect(invoice.customerName).toBe('Test Customer');
    expect(invoice.customerEmail).toBe(testUserEmail);
    expect(Number(invoice.subtotal)).toBeCloseTo(8264.46, 2);
    expect(Number(invoice.ivaAmount)).toBeCloseTo(1735.54, 2);
    expect(Number(invoice.total)).toBe(10000);
    expect(invoice.issuedAt).toBeInstanceOf(Date);
    expect(invoice.createdAt).toBeInstanceOf(Date);

    // Clean up
    await prisma.invoice.delete({ where: { id: invoice.id } });
  });

  it('should get invoice by payment ID with getInvoiceByPaymentIdData', async () => {
    // Create an invoice first
    const invoice = await prisma.invoice.create({
      data: {
        paymentId: testPaymentId,
        invoiceNumber: 'INV-2026-TEST',
        issuedAt: new Date(),
        customerName: 'Find Test Customer',
        customerEmail: testUserEmail,
        subtotal: 8264.46,
        ivaAmount: 1735.54,
        total: 10000,
      },
    });

    const foundInvoice = await getInvoiceByPaymentIdData(testPaymentId);

    expect(foundInvoice).toBeDefined();
    expect(foundInvoice?.id).toBe(invoice.id);
    expect(foundInvoice?.invoiceNumber).toBe('INV-2026-TEST');

    // Test not found case
    const notFound = await getInvoiceByPaymentIdData('non-existent-payment-id');
    expect(notFound).toBeNull();

    // Clean up
    await prisma.invoice.delete({ where: { id: invoice.id } });
  });

  it('should generate next sequential invoice number with getNextInvoiceNumberData', async () => {
    // Get the next invoice number
    const invoiceNumber1 = await getNextInvoiceNumberData(testSubscriptionId);

    expect(invoiceNumber1).toBeDefined();
    expect(invoiceNumber1).toMatch(/^INV-\d{4}-\d{4,}$/);

    // Create an invoice with this number to advance the counter
    const tempPayment = await prisma.payment.create({
      data: {
        subscriptionId: testSubscriptionId,
        mercadopagoPaymentId: 'mp-invoice-number-test',
        amount: 10000,
        currency: 'ARS',
        status: 'APPROVED',
      },
    });

    await prisma.invoice.create({
      data: {
        paymentId: tempPayment.id,
        invoiceNumber: invoiceNumber1,
        issuedAt: new Date(),
        customerName: 'Seq Test Customer',
        customerEmail: testUserEmail,
        subtotal: 8264.46,
        ivaAmount: 1735.54,
        total: 10000,
      },
    });

    // Get next number - should be incremented
    const invoiceNumber2 = await getNextInvoiceNumberData(testSubscriptionId);
    expect(invoiceNumber2).toBeDefined();
    expect(invoiceNumber2).not.toBe(invoiceNumber1);

    // Extract sequence numbers and verify increment
    const seq1 = parseInt(invoiceNumber1.split('-')[2]);
    const seq2 = parseInt(invoiceNumber2.split('-')[2]);
    expect(seq2).toBe(seq1 + 1);

    // Clean up
    await prisma.invoice.deleteMany({
      where: { paymentId: tempPayment.id },
    });
    await prisma.payment.delete({ where: { id: tempPayment.id } });
  });
});

describe('PlanChangeLog Data Functions', () => {
  it('should record plan change with createPlanChangeLogData', async () => {
    const input: CreatePlanChangeLogInput = {
      subscriptionId: testSubscriptionId,
      previousPlan: 'FREE',
      newPlan: 'PRO',
      initiatorType: 'OWNER',
      initiatorId: testUserId,
    };

    const planChange = await createPlanChangeLogData(input);

    expect(planChange).toBeDefined();
    expect(planChange.id).toBeDefined();
    expect(planChange.subscriptionId).toBe(testSubscriptionId);
    expect(planChange.previousPlan).toBe('FREE');
    expect(planChange.newPlan).toBe('PRO');
    expect(planChange.initiatorType).toBe('OWNER');
    expect(planChange.initiatorId).toBe(testUserId);
    expect(planChange.changedAt).toBeInstanceOf(Date);
    expect(planChange.createdAt).toBeInstanceOf(Date);

    // Clean up
    await prisma.planChangeLog.delete({ where: { id: planChange.id } });
  });

  it('should record system-initiated plan changes with null initiatorId', async () => {
    const input: CreatePlanChangeLogInput = {
      subscriptionId: testSubscriptionId,
      previousPlan: 'PRO',
      newPlan: 'FREE',
      initiatorType: 'SYSTEM',
      initiatorId: null,
    };

    const planChange = await createPlanChangeLogData(input);

    expect(planChange.initiatorType).toBe('SYSTEM');
    expect(planChange.initiatorId).toBeNull();

    // Clean up
    await prisma.planChangeLog.delete({ where: { id: planChange.id } });
  });

  it('should get plan change logs by subscription with getPlanChangeLogsBySubscriptionData', async () => {
    // Create multiple plan change logs
    const logs = [];
    const transitions = [
      { from: 'FREE', to: 'PRO' },
      { from: 'PRO', to: 'ENTERPRISE' },
      { from: 'ENTERPRISE', to: 'PRO' },
    ] as const;

    for (const { from, to } of transitions) {
      const log = await prisma.planChangeLog.create({
        data: {
          subscriptionId: testSubscriptionId,
          previousPlan: from,
          newPlan: to,
          changedAt: new Date(),
          initiatorType: 'OWNER',
          initiatorId: testUserId,
        },
      });
      logs.push(log);
    }

    const foundLogs = await getPlanChangeLogsBySubscriptionData(testSubscriptionId);

    expect(foundLogs).toBeDefined();
    expect(foundLogs.length).toBeGreaterThanOrEqual(3);

    // Verify all transitions are recorded
    const logTransitions = foundLogs.map((l) => ({
      from: l.previousPlan,
      to: l.newPlan,
    }));
    for (const transition of transitions) {
      expect(
        logTransitions.some((t) => t.from === transition.from && t.to === transition.to)
      ).toBe(true);
    }

    // Clean up
    for (const log of logs) {
      await prisma.planChangeLog.delete({ where: { id: log.id } });
    }
  });
});
