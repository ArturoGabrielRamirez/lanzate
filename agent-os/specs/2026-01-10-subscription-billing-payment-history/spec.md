# Specification: Subscription Billing & Payment History

## Goal
Implement MercadoPago subscription billing integration with payment tracking, invoice generation, and a dedicated billing history dashboard that allows users to view payment transactions, download PDF invoices, and track plan changes.

## User Stories
- As an account owner, I want to view my complete payment history so that I can track all subscription charges and their statuses
- As an account owner, I want to download PDF invoices for my payments so that I can keep records for accounting purposes
- As an employee with billing permissions, I want to access the account's billing information so that I can assist with payment inquiries

## Specific Requirements

**MercadoPago Preapproval Plan Creation**
- Create subscription preapproval plans in MercadoPago for PRO and ENTERPRISE tiers (FREE has no payment)
- Store plan configuration with monthly pricing in ARS currency
- Use MercadoPago PreApproval API to create subscriptions with `frequency: 1, frequency_type: "months"`
- Store `external_reference` as user email for webhook identification
- Follow existing pattern from `backup/features/account/actions/get-plan-href.action.ts`

**Extended Webhook Handler**
- Extend existing webhook at `/api/mercadopago` to handle three notification types
- Handle `payment.created` to record new payment transactions in database
- Handle `payment.updated` to sync payment status changes including refunds (status `refunded` or `partially_refunded`)
- Handle `subscription_preapproval.updated` for subscription status changes (authorized, cancelled, paused)
- Return 200 response immediately to avoid MercadoPago timeouts
- Log all webhook events for debugging purposes

**Payment Transaction Model**
- Create new `Payment` Prisma model to store all subscription payment records
- Fields: id, subscriptionId, mercadopagoPaymentId, amount, currency, status, paidAt, createdAt, updatedAt
- Status enum: PENDING, APPROVED, REJECTED, REFUNDED, PARTIALLY_REFUNDED, CANCELLED
- Store AFIP-ready fields: cuit, ivaAmount, netAmount, caeCode (nullable for future)
- Index on subscriptionId and mercadopagoPaymentId for efficient queries

**Plan Change History Model**
- Create new `PlanChangeLog` Prisma model to track all plan upgrades/downgrades
- Fields: id, subscriptionId, previousPlan, newPlan, changedAt, initiatorType, initiatorId
- InitiatorType enum: OWNER, EMPLOYEE, SYSTEM (for webhook-triggered changes)
- Store which user or employee initiated the change for audit purposes

**Invoice/Receipt Model**
- Create new `Invoice` Prisma model linked to Payment records
- Fields: id, paymentId, invoiceNumber, issuedAt, customerName, customerEmail
- AFIP-ready fields: customerCuit, subtotal, ivaAmount, total, caeCode, caeExpirationDate (nullable)
- Generate sequential invoice numbers per account

**Billing History Page**
- Create dedicated page at `/account/billing` for full payment history
- Display payments in a table with columns: date, invoice number, amount, status, plan type, actions
- Include filter buttons for payment status (All, Approved, Pending, Refunded)
- Include date range filter using nuqs for URL state management
- Provide download button for each payment's PDF invoice
- Use Server Component for initial data fetch, Client Components for filters

**PDF Invoice Generation**
- Generate downloadable PDF invoices with basic billing information
- Include: invoice number, date, customer details, plan name, amount, IVA breakdown
- Include placeholder section for future CAE/AFIP compliance data
- Use a PDF generation library compatible with Next.js server environment

**SubscriptionStatusCard Component**
- Create compact card component for display in membership tab
- Show current plan type, subscription status, next billing date
- Display MercadoPago subscription ID for reference
- Include "Ver historial de pagos" link to `/account/billing` page
- Replace verbose membership tab content with this compact card

**Reusable DataTable Component**
- Build generic `DataTable` component with typed column definitions
- Support sorting, row selection, and custom cell renderers
- Design for reuse across Products, Employees, Sales, Branches admin pages
- Accept data array and column config as props

**Reusable Pagination Component**
- Build `Pagination` component with page size selector and navigation
- Integrate with nuqs for URL-based page state
- Support configurable page sizes (10, 25, 50, 100)
- Show current range and total count

**Reusable FilterButtons Component**
- Build `FilterButtons` component for status/category filtering
- Accept filter options array with label and value
- Integrate with nuqs for URL-based filter state
- Support single-select and multi-select modes

## Visual Design
No visual mockups provided. Follow existing shadcn/ui component patterns and Card-based layouts seen in `membership-tab.tsx`.

## Existing Code to Leverage

**`backup/app/api/mercadopago/route.ts`**
- Contains basic webhook POST handler structure
- Shows MercadoPagoConfig initialization with access token
- Demonstrates fetching PreApproval by ID from webhook payload
- Pattern for checking `preapproval.status === "authorized"`
- Extend this handler to support additional notification types

**`backup/features/account/actions/get-plan-href.action.ts`**
- Shows PreApproval.create() API usage with body configuration
- Contains plan pricing mapping (starter: 0, business: 10000, enterprise: 25000)
- Demonstrates auto_recurring configuration with frequency and currency
- Uses actionWrapper pattern for consistent error handling
- Pattern for returning init_point URL to redirect user

**`backup/features/account/actions/cancel-suscription.action.ts`**
- Shows PreApproval.update() API for changing subscription status
- Demonstrates status update to "cancelled"
- Uses revalidatePath after mutation
- Pattern for calling data layer function after MercadoPago API call

**`features/access/components/gate.tsx`**
- Complete AccessGate and AccessManagerProvider implementation
- Permission-based rendering with roles and permissions props
- Supports hide, show-fallback, and disable modes
- Use AccessGate with `permissions={['billing:view']}` for billing access control
- Pattern for wrapping protected content

**`features/global/utils/action-wrapper.ts`**
- Standard actionWrapper utility for all Server Actions
- Handles Yup ValidationError and Prisma errors
- Returns consistent ServerResponse<T> structure
- Use for all new billing-related actions

## Out of Scope
- Automatic dunning emails for failed payments (rely on MercadoPago's built-in mechanism)
- Proration for mid-cycle plan upgrades or downgrades
- Multiple payment methods per account
- AFIP electronic invoicing integration (data structure prepared, integration deferred)
- Search functionality in payment history table
- Custom payment retry logic
- Webhook signature verification (implement in future security hardening)
- Email notifications for successful/failed payments
- Subscription pause/resume functionality beyond MercadoPago webhook handling
- Refund initiation from the application (handled via MercadoPago dashboard)
