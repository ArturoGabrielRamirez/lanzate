/**
 * Billing Feature Types
 *
 * Type definitions for the billing feature data layer.
 * Re-exports Prisma types and defines input/filter types.
 */

import type {
  Payment,
  Invoice,
  PlanChangeLog,
  PaymentStatus,
  AccountType,
  InitiatorType,
} from '@prisma/client';

// Re-export Prisma types
export type { Payment, Invoice, PlanChangeLog, PaymentStatus, AccountType, InitiatorType };

/**
 * Input type for creating a new payment record
 */
export interface CreatePaymentInput {
  subscriptionId: string;
  mercadopagoPaymentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt?: Date;
  // AFIP-ready fields (optional)
  cuit?: string;
  ivaAmount?: number;
  netAmount?: number;
  caeCode?: string;
}

/**
 * Input type for creating a new invoice record
 */
export interface CreateInvoiceInput {
  paymentId: string;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  ivaAmount: number;
  total: number;
  // AFIP-ready fields (optional)
  customerCuit?: string;
  caeCode?: string;
  caeExpirationDate?: Date;
}

/**
 * Input type for creating a plan change log record
 */
export interface CreatePlanChangeLogInput {
  subscriptionId: string;
  previousPlan: AccountType;
  newPlan: AccountType;
  initiatorType: InitiatorType;
  initiatorId: string | null;
}

/**
 * Filters for querying payments
 */
export interface PaymentFilters {
  page?: number;
  pageSize?: number;
  status?: PaymentStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Paginated payments response
 */
export interface PaginatedPayments {
  data: Payment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * MercadoPago subscription data for updating subscription
 */
export interface MercadopagoSubscriptionData {
  mercadopagoPreapprovalId: string;
  status: 'PENDING' | 'AUTHORIZED' | 'PAUSED' | 'CANCELLED';
  nextBillingDate?: Date;
}

/**
 * MercadoPago Payment data structure (subset of fields we use)
 */
export interface MPPaymentData {
  id: string | number;
  status: string;
  transaction_amount: number;
  currency_id: string;
  date_approved?: string;
  payer?: {
    email?: string;
  };
  metadata?: {
    preapproval_id?: string;
  };
}

/**
 * MercadoPago Preapproval data structure (subset of fields we use)
 */
export interface MPPreapprovalData {
  id: string;
  status: string;
  external_reference?: string;
  next_payment_date?: string;
}

/**
 * Options for handlePaymentCreated to allow dependency injection for testing
 */
export interface HandlePaymentCreatedOptions {
  getPayment?: (id: string) => Promise<MPPaymentData>;
  subscriptionId?: string;
  paymentData?: MPPaymentData;
}

/**
 * Options for handlePaymentUpdated to allow dependency injection for testing
 */
export interface HandlePaymentUpdatedOptions {
  getPayment?: (id: string) => Promise<MPPaymentData>;
  paymentData?: MPPaymentData;
}

/**
 * Options for handleSubscriptionPreapprovalUpdated to allow dependency injection for testing
 */
export interface HandleSubscriptionPreapprovalUpdatedOptions {
  getPreapproval?: (id: string) => Promise<MPPreapprovalData>;
  preapprovalData?: MPPreapprovalData;
}

/**
 * Webhook notification body structure from MercadoPago
 */
export interface WebhookNotification {
  type: string;
  action?: string;
  data: {
    id: string;
  };
}
