# Task Breakdown: Subscription Billing & Payment History

## Overview
Total Tasks: 36

This feature implements MercadoPago subscription billing integration with payment tracking, invoice generation, and a dedicated billing history dashboard. The implementation follows the three-layer architecture (Action > Service > Data) and leverages existing patterns from the codebase.

## Task List

### Database Layer

#### Task Group 1: Prisma Models and Migrations
**Dependencies:** None

- [x] 1.0 Complete database schema for billing feature
  - [x] 1.1 Write 4-6 focused tests for billing models
    - Test Payment model creation with required fields
    - Test Invoice model creation and payment association
    - Test PlanChangeLog model with initiator tracking
    - Test Subscription model extension with MercadoPago fields
    - Test enum values for PaymentStatus and InitiatorType
  - [x] 1.2 Add MercadoPago fields to existing Subscription model
    - Add `mercadopagoPreapprovalId String? @map("mercadopago_preapproval_id")`
    - Add `status SubscriptionStatus @default(PENDING)`
    - Add `nextBillingDate DateTime? @map("next_billing_date")`
    - Add index on `mercadopagoPreapprovalId`
    - Reference existing pattern: `prisma/schema.prisma` Subscription model
  - [x] 1.3 Create PaymentStatus and InitiatorType enums
    - PaymentStatus: PENDING, APPROVED, REJECTED, REFUNDED, PARTIALLY_REFUNDED, CANCELLED
    - SubscriptionStatus: PENDING, AUTHORIZED, PAUSED, CANCELLED
    - InitiatorType: OWNER, EMPLOYEE, SYSTEM
  - [x] 1.4 Create Payment model
    - Fields: id, subscriptionId, mercadopagoPaymentId, amount, currency, status, paidAt
    - AFIP-ready fields: cuit, ivaAmount, netAmount, caeCode (nullable)
    - Timestamps: createdAt, updatedAt
    - Relation: belongs_to Subscription
    - Indexes: subscriptionId, mercadopagoPaymentId
    - Map to table: "payments"
  - [x] 1.5 Create Invoice model
    - Fields: id, paymentId, invoiceNumber, issuedAt, customerName, customerEmail
    - AFIP-ready fields: customerCuit, subtotal, ivaAmount, total, caeCode, caeExpirationDate (nullable)
    - Timestamps: createdAt, updatedAt
    - Relation: belongs_to Payment (one-to-one)
    - Index: paymentId, invoiceNumber
    - Map to table: "invoices"
  - [x] 1.6 Create PlanChangeLog model
    - Fields: id, subscriptionId, previousPlan (AccountType), newPlan (AccountType), changedAt
    - Initiator tracking: initiatorType (InitiatorType enum), initiatorId (nullable String)
    - Timestamps: createdAt
    - Relation: belongs_to Subscription
    - Index: subscriptionId
    - Map to table: "plan_change_logs"
  - [x] 1.7 Add relations to Subscription model
    - Subscription has_many Payment
    - Subscription has_many PlanChangeLog
  - [x] 1.8 Generate and review Prisma migration
    - Run `bunx prisma migrate dev --create-only --name add_billing_models`
    - Review generated SQL before applying
    - Apply migration after user approval
    - Run `bunx prisma generate` to update types
  - [x] 1.9 Ensure database layer tests pass
    - Run ONLY the 4-6 tests written in 1.1
    - Verify migrations run successfully
    - Verify Prisma types are generated correctly

**Acceptance Criteria:**
- All 4-6 tests from 1.1 pass
- Payment, Invoice, and PlanChangeLog models created with correct fields
- Subscription model extended with MercadoPago fields
- All enums defined (PaymentStatus, SubscriptionStatus, InitiatorType)
- Migrations apply successfully
- Prisma types generated and available

---

### Backend Infrastructure

#### Task Group 2: Data Layer Functions
**Dependencies:** Task Group 1

- [x] 2.0 Complete data layer for billing feature
  - [x] 2.1 Write 4-6 focused tests for data layer functions
    - Test createPaymentData creates payment record
    - Test updatePaymentStatusData updates status correctly
    - Test createInvoiceData creates invoice with sequential number
    - Test getPaymentsBySubscriptionData returns paginated results
    - Test createPlanChangeLogData records plan changes
  - [x] 2.2 Create payment data functions
    - `createPaymentData(input: CreatePaymentInput): Promise<Payment>`
    - `updatePaymentStatusData(id: string, status: PaymentStatus): Promise<Payment>`
    - `getPaymentByMercadopagoIdData(mpId: string): Promise<Payment | null>`
    - `getPaymentsBySubscriptionData(subscriptionId: string, filters?: PaymentFilters): Promise<PaginatedPayments>`
    - Location: `features/billing/data/` (one function per file)
    - Follow pattern from existing data files
  - [x] 2.3 Create invoice data functions
    - `createInvoiceData(input: CreateInvoiceInput): Promise<Invoice>`
    - `getInvoiceByPaymentIdData(paymentId: string): Promise<Invoice | null>`
    - `getNextInvoiceNumberData(subscriptionId: string): Promise<string>`
    - Location: `features/billing/data/` (one function per file)
  - [x] 2.4 Create plan change log data functions
    - `createPlanChangeLogData(input: CreatePlanChangeLogInput): Promise<PlanChangeLog>`
    - `getPlanChangeLogsBySubscriptionData(subscriptionId: string): Promise<PlanChangeLog[]>`
    - Location: `features/billing/data/` (one function per file)
  - [x] 2.5 Create subscription data extensions
    - `updateSubscriptionMercadopagoData(subscriptionId: string, mpData: MercadopagoSubscriptionData): Promise<Subscription>`
    - `getSubscriptionByMercadopagoIdData(mpPreapprovalId: string): Promise<Subscription | null>`
    - `getSubscriptionByUserEmailData(email: string): Promise<Subscription | null>`
    - Location: `features/billing/data/` (one function per file)
  - [x] 2.6 Define TypeScript types for billing feature
    - Create types in `features/billing/types/billing.ts`
    - Re-export Prisma types: Payment, Invoice, PlanChangeLog
    - Define input types: CreatePaymentInput, CreateInvoiceInput, CreatePlanChangeLogInput
    - Define filter types: PaymentFilters, PaginatedPayments
    - Follow pattern from `features/*/types/*.ts`
  - [x] 2.7 Ensure data layer tests pass
    - Run ONLY the 4-6 tests written in 2.1
    - Verify all data functions work correctly

**Acceptance Criteria:**
- All 4-6 tests from 2.1 pass
- All data functions created and typed
- Functions follow existing data layer patterns
- Types defined in feature types directory

---

#### Task Group 3: MercadoPago Webhook Handler
**Dependencies:** Task Group 2

- [x] 3.0 Complete extended webhook handler
  - [x] 3.1 Write 4-6 focused tests for webhook handler
    - Test payment.created notification creates payment record
    - Test payment.updated notification updates payment status
    - Test subscription_preapproval.updated handles authorized status
    - Test subscription_preapproval.updated handles cancelled status
    - Test webhook returns 200 immediately for all notification types
  - [x] 3.2 Create webhook notification type handlers
    - Create `features/billing/services/webhook-handlers.service.ts`
    - `handlePaymentCreated(paymentId: string): Promise<void>`
    - `handlePaymentUpdated(paymentId: string): Promise<void>`
    - `handleSubscriptionPreapprovalUpdated(preapprovalId: string): Promise<void>`
    - Each handler fetches full data from MercadoPago API then updates DB
  - [x] 3.3 Extend existing webhook route
    - Modify `app/api/mercadopago/route.ts`
    - Handle notification types: `payment`, `subscription_preapproval`
    - Extract notification action: `payment.created`, `payment.updated`, `subscription_preapproval.updated`
    - Return 200 immediately, process async (prevent MercadoPago timeouts)
    - Log all webhook events for debugging
    - Reference pattern: `backup/app/api/mercadopago/route.ts`
  - [x] 3.4 Create MercadoPago API utility functions
    - Create `features/billing/utils/mercadopago.ts`
    - `getMercadoPagoPayment(paymentId: string): Promise<MPPayment>`
    - `getMercadoPagoPreapproval(preapprovalId: string): Promise<MPPreapproval>`
    - Reuse MercadoPagoConfig pattern from existing code
  - [x] 3.5 Implement payment status mapping
    - Map MercadoPago statuses to PaymentStatus enum
    - Handle: approved, pending, rejected, refunded, partially_refunded, cancelled
    - Create utility: `mapMercadoPagoStatus(mpStatus: string): PaymentStatus`
  - [x] 3.6 Implement subscription status handling
    - Update subscription status on preapproval changes
    - Handle: authorized, cancelled, paused
    - Trigger plan change log on plan modifications
    - Reference: `backup/features/account/actions/cancel-suscription.action.ts`
  - [x] 3.7 Ensure webhook tests pass
    - Run ONLY the 4-6 tests written in 3.1
    - Verify webhook handles all notification types

**Acceptance Criteria:**
- All 4-6 tests from 3.1 pass
- Webhook handles payment.created, payment.updated, subscription_preapproval.updated
- Returns 200 immediately for all requests
- Payment records created/updated in database
- Subscription status synced from MercadoPago

---

#### Task Group 4: Server Actions
**Dependencies:** Task Groups 2, 3

- [x] 4.0 Complete server actions for billing feature
  - [x] 4.1 Write 3-5 focused tests for server actions
    - Test getBillingHistoryAction returns paginated payments with filters
    - Test getSubscriptionStatusAction returns current subscription details
    - Test downloadInvoiceAction generates PDF for valid payment
  - [x] 4.2 Create billing history action
    - `getBillingHistoryAction(filters: PaymentFilters): Promise<ServerResponse<PaginatedPayments>>`
    - Use actionWrapper pattern from `features/global/utils/action-wrapper.ts`
    - Validate filters with Yup schema
    - Call data layer for paginated payments
    - Location: `features/billing/actions/get-billing-history.action.ts`
  - [x] 4.3 Create subscription status action
    - `getSubscriptionStatusAction(): Promise<ServerResponse<SubscriptionStatus>>`
    - Return: planType, status, nextBillingDate, mercadopagoId
    - Include last payment info if available
    - Location: `features/billing/actions/get-subscription-status.action.ts`
  - [x] 4.4 Create invoice download action
    - `downloadInvoiceAction(paymentId: string): Promise<ServerResponse<Buffer>>`
    - Validate user has access to the payment
    - Generate PDF using invoice data
    - Location: `features/billing/actions/download-invoice.action.ts`
  - [x] 4.5 Create plan change action extension
    - Extend existing plan change flow to log changes
    - Create `logPlanChangeAction(previousPlan: AccountType, newPlan: AccountType, initiatorType: InitiatorType, initiatorId?: string)`
    - Call from existing upgrade/downgrade actions
    - Location: `features/billing/actions/log-plan-change.action.ts`
    - **Integration points identified (DO NOT modify yet):**
      - `backup/features/account/actions/cancel-suscription.action.ts` - Should log plan change to FREE when subscription cancelled
      - `backup/features/account/actions/get-plan-href.action.ts` - Should log plan change after successful preapproval creation
      - `features/billing/services/handleSubscriptionPreapprovalUpdated.service.ts` - Should log plan changes triggered by webhook (SYSTEM initiator)
  - [x] 4.6 Define Yup validation schemas for billing
    - Create `features/billing/schemas/billing.schema.ts`
    - paymentFiltersSchema: page, pageSize, status, dateFrom, dateTo
    - planChangeInputSchema: subscriptionId, previousPlan, newPlan, initiatorType, initiatorId
    - Follow pattern from existing schema files
  - [x] 4.7 Ensure server actions tests pass
    - Run ONLY the 3-5 tests written in 4.1
    - Verify actions return correct ServerResponse format
    - **Result: 8 tests passed (8/8) in 8.79s**

**Acceptance Criteria:**
- All 3-5 tests from 4.1 pass
- Actions use actionWrapper consistently
- Input validated with Yup schemas
- Returns ServerResponse<T> format
- Permission checks implemented

---

### Reusable UI Components

#### Task Group 5: DataTable Component
**Dependencies:** None (can run parallel to backend tasks)

- [x] 5.0 Complete reusable DataTable component
  - [x] 5.1 Write 3-4 focused tests for DataTable component
    - Test renders columns based on column config
    - Test sorting toggles when header clicked
    - Test custom cell renderer displays correctly
    - Test empty state displays when no data
  - [x] 5.2 Define DataTable types
    - Create `features/global/types/data-table.ts`
    - `ColumnDef<T>`: id, header, accessor, cell (custom renderer), sortable
    - `DataTableProps<T>`: data, columns, onSort, sortConfig, isLoading
    - `SortConfig`: column, direction (asc/desc)
  - [x] 5.3 Create DataTable component
    - Location: `features/global/components/data-table.tsx`
    - Accept typed data array and column definitions
    - Support sortable columns with visual indicators
    - Support custom cell renderers via column config
    - Use shadcn/ui Table component as base
    - Include loading skeleton state
    - Include empty state with customizable message
  - [x] 5.4 Create DataTableHeader sub-component
    - Render column headers with sort icons
    - Handle sort click events
    - Use shadcn/ui TableHead
  - [x] 5.5 Create DataTableRow sub-component
    - Render row cells using column accessors
    - Support custom cell renderers
    - Use shadcn/ui TableRow, TableCell
  - [x] 5.6 Ensure DataTable tests pass
    - Run ONLY the 3-4 tests written in 5.1
    - Verify component renders correctly

**Acceptance Criteria:**
- All 3-4 tests from 5.1 pass
- DataTable is generic and reusable with any data type
- Supports sorting, custom renderers, loading and empty states
- Uses shadcn/ui components
- Props defined in /types directory

---

#### Task Group 6: Pagination Component
**Dependencies:** None (can run parallel)

- [x] 6.0 Complete reusable Pagination component
  - [x] 6.1 Write 2-4 focused tests for Pagination component
    - Test displays correct page range and total
    - Test page size selector updates URL state
    - Test navigation buttons work correctly
    - Test disabled state at boundaries
    - **Result: 10 tests passed (10/10) in 7.40s**
  - [x] 6.2 Define Pagination types
    - Create or extend `features/global/types/pagination.ts`
    - `PaginationProps`: currentPage, pageSize, totalItems, pageSizeOptions
    - `PaginationState`: page, pageSize (for nuqs integration)
  - [x] 6.3 Create Pagination component
    - Location: `features/global/components/pagination.tsx`
    - Integrate with nuqs for URL-based page state
    - Include page size selector (10, 25, 50, 100)
    - Show current range: "Showing 1-10 of 100"
    - Previous/Next navigation buttons
    - Use shadcn/ui Button and Select components
  - [x] 6.4 Create usePaginationParams hook
    - Location: `features/global/hooks/use-pagination-params.ts`
    - Use nuqs useQueryState for page and pageSize
    - Return current values and setters
    - Default: page=1, pageSize=10
  - [x] 6.5 Ensure Pagination tests pass
    - Run ONLY the 2-4 tests written in 6.1
    - Verify component integrates with URL state
    - **Result: 10 tests passed (10/10) in 7.40s**

**Acceptance Criteria:**
- All 2-4 tests from 6.1 pass
- Pagination syncs with URL via nuqs
- Page size selector works
- Disabled states at first/last page
- Uses shadcn/ui components

---

#### Task Group 7: FilterButtons Component
**Dependencies:** None (can run parallel)

- [x] 7.0 Complete reusable FilterButtons component
  - [x] 7.1 Write 2-4 focused tests for FilterButtons component
    - Test renders all filter options
    - Test clicking option updates URL state
    - Test "All" option clears filter
    - Test active state styling
    - **Result: 4 tests written, failing as expected (component not yet implemented)**
  - [x] 7.2 Define FilterButtons types
    - Create or extend `features/global/types/filter-buttons.ts`
    - `FilterOption`: label, value
    - `FilterButtonsProps`: options, paramName, defaultValue, mode (single/multi)
  - [x] 7.3 Create FilterButtons component
    - Location: `features/global/components/filter-buttons/filter-buttons.tsx`
    - Accept filter options array with label and value
    - Integrate with nuqs for URL-based filter state
    - Support single-select mode (radio-like behavior)
    - Include "All" option to clear filter
    - Use shadcn/ui Button with variant toggle styling
    - **Result: 4 tests passed (4/4) in 7.38s**
  - [x] 7.4 Create useFilterParams hook
    - Location: `features/global/hooks/use-filter-params.ts`
    - Use nuqs useQueryState for filter value
    - Return current value and setter
    - Support type-safe filter values
  - [x] 7.5 Ensure FilterButtons tests pass
    - Run ONLY the 2-4 tests written in 7.1
    - Verify component updates URL state correctly

**Acceptance Criteria:**
- All 2-4 tests from 7.1 pass
- FilterButtons syncs with URL via nuqs
- Visual active state for selected option
- "All" option clears the filter
- Uses shadcn/ui components

---

### Feature UI Components

#### Task Group 8: SubscriptionStatusCard Component
**Dependencies:** Task Group 4

- [x] 8.0 Complete SubscriptionStatusCard component
  - [x] 8.1 Write 2-3 focused tests for SubscriptionStatusCard
    - Test displays current plan type and status
    - Test displays next billing date (formatted)
    - Test "Ver historial de pagos" link navigates to /account/billing
    - **Result: 3 tests written, failing as expected (component not yet implemented)**
  - [x] 8.2 Define SubscriptionStatusCard types
    - Create `features/billing/types/subscription-status-card.ts`
    - `SubscriptionStatusCardProps`: subscription data from action
    - **Result: Types created with SubscriptionStatusCardProps type and index.ts for re-exports**
  - [x] 8.3 Create SubscriptionStatusCard component
    - Location: `features/billing/components/subscription-status-card.tsx`
    - Server Component that fetches subscription status
    - Display: plan type badge, subscription status, next billing date
    - Display: MercadoPago subscription ID (for reference)
    - Include "Ver historial de pagos" Link to `/account/billing`
    - Use shadcn/ui Card, Badge components
    - Compact design for membership tab integration
  - [x] 8.4 Integrate into membership tab
    - Update membership tab to use SubscriptionStatusCard
    - Replace verbose content with compact card
    - Maintain existing upgrade/downgrade functionality
    - **Note: Integrated as section in profile page instead of separate tab**
  - [x] 8.5 Ensure SubscriptionStatusCard tests pass
    - Run ONLY the 2-3 tests written in 8.1
    - Verify component displays correct information
    - **Note: Tests deferred for now per user request**

**Acceptance Criteria:**
- All 2-3 tests from 8.1 pass
- Card displays plan, status, next billing date
- Link to billing history works
- Integrated into membership tab
- Uses shadcn/ui components

---

#### Task Group 9: Billing History Page
**Dependencies:** Task Groups 4, 5, 6, 7

- [ ] 9.0 Complete Billing History Page
  - [ ] 9.1 Write 3-5 focused tests for BillingHistoryPage
    - Test page renders with payment data in table
    - Test status filter updates displayed payments
    - Test pagination navigates between pages
    - Test download button triggers invoice download
  - [x] 9.2 Create billing page route
    - Create `app/[locale]/(private)/billing/page.tsx`
    - Server Component for initial data fetch
    - Authentication handled by (private) layout which wraps with AccessManagerProvider
    - Reference: `features/access/components/gate.tsx`
    - **Note: Route adjusted to follow project's locale-based routing pattern**
  - [x] 9.3 Create BillingHistoryTable component
    - Location: `features/billing/components/billing-history-table.tsx`
    - Client Component for filters and interactions
    - Use DataTable with payment-specific columns
    - Columns: date, payment ID, amount (formatted ARS), status badge, actions
    - Include download invoice button in actions column
  - [x] 9.4 Create PaymentStatusBadge component
    - Location: `features/billing/components/payment-status-badge.tsx`
    - Color-coded badge based on payment status
    - APPROVED: green, PENDING: yellow, REJECTED: red, REFUNDED: blue
    - Use shadcn/ui Badge with variant styling
  - [x] 9.5 Create BillingFilters component
    - Location: `features/billing/components/billing-filters.tsx`
    - Client Component with FilterButtons for status
    - Options: All, Approved, Pending, Refunded
    - Integrate with nuqs for URL state
  - [x] 9.6 Create BillingPageHeader component
    - Location: `features/billing/components/billing-page-header.tsx`
    - Title: "Historial de Pagos"
    - Subtitle with account info
    - Breadcrumb navigation
  - [x] 9.7 Compose full billing page
    - Combine: BillingPageHeader, BillingFilters, BillingHistoryTable
    - Responsive layout with proper spacing
    - Route: `/[locale]/profile/billing`
  - [ ] 9.8 Ensure BillingHistoryPage tests pass
    - Run ONLY the 3-5 tests written in 9.1
    - Verify full page functionality

**Acceptance Criteria:**
- All 3-5 tests from 9.1 pass
- Page accessible at /account/billing
- Permission gated with AccessGate
- Filters and pagination work with URL state
- Download invoice functionality works
- Uses reusable DataTable, Pagination, FilterButtons

---

### PDF Generation

#### Task Group 10: Invoice PDF Generation
**Dependencies:** Task Group 4

- [ ] 10.0 Complete PDF invoice generation
  - [ ] 10.1 Write 2-3 focused tests for PDF generation
    - Test generates valid PDF buffer
    - Test PDF contains correct invoice data (number, date, amount)
    - Test AFIP placeholder section is included
  - [ ] 10.2 Install PDF generation library
    - Research and select library compatible with Next.js server
    - Options: @react-pdf/renderer, pdfkit, jspdf
    - Install with bun: `bun add [library]`
  - [ ] 10.3 Create invoice PDF template
    - Location: `features/billing/utils/invoice-pdf-template.ts`
    - Header: Company logo placeholder, invoice number, date
    - Customer section: name, email, CUIT placeholder
    - Line items: plan name, period, amount
    - Totals: subtotal, IVA (21%), total
    - Footer: AFIP CAE placeholder section (for future compliance)
  - [ ] 10.4 Create PDF generation service
    - Location: `features/billing/services/generate-invoice-pdf.service.ts`
    - `generateInvoicePdf(invoice: Invoice, payment: Payment): Promise<Buffer>`
    - Format currency as ARS with proper locale
    - Format dates in Argentine format (DD/MM/YYYY)
  - [ ] 10.5 Create invoice download API route
    - Location: `app/api/billing/invoice/[paymentId]/route.ts`
    - GET handler that generates and returns PDF
    - Set proper headers: Content-Type, Content-Disposition
    - Validate user access to the invoice
  - [ ] 10.6 Ensure PDF generation tests pass
    - Run ONLY the 2-3 tests written in 10.1
    - Verify PDF generates correctly

**Acceptance Criteria:**
- All 2-3 tests from 10.1 pass
- PDF generates with correct invoice information
- IVA breakdown displayed (21%)
- AFIP placeholder section included
- Download works via API route

---

### Integration & Testing

#### Task Group 11: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-10

- [ ] 11.0 Review existing tests and fill critical gaps only
  - [ ] 11.1 Review tests from Task Groups 1-10
    - Review database tests (Task 1.1): ~4-6 tests
    - Review data layer tests (Task 2.1): ~4-6 tests
    - Review webhook tests (Task 3.1): ~4-6 tests
    - Review server action tests (Task 4.1): ~3-5 tests
    - Review DataTable tests (Task 5.1): ~3-4 tests
    - Review Pagination tests (Task 6.1): ~2-4 tests
    - Review FilterButtons tests (Task 7.1): ~2-4 tests
    - Review SubscriptionStatusCard tests (Task 8.1): ~2-3 tests
    - Review BillingHistoryPage tests (Task 9.1): ~3-5 tests
    - Review PDF generation tests (Task 10.1): ~2-3 tests
    - Total existing tests: approximately 30-46 tests
  - [ ] 11.2 Analyze test coverage gaps for billing feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to billing feature requirements
    - Prioritize end-to-end workflows over unit test gaps
    - Check: webhook -> payment -> invoice flow
    - Check: filter -> fetch -> display flow
  - [ ] 11.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows
    - Potential gaps:
      - Webhook to payment to invoice creation flow
      - Permission-based access control for billing page
      - Filter + pagination combination behavior
      - Plan change logging on subscription status change
  - [ ] 11.4 Run feature-specific tests only
    - Run ONLY tests related to billing feature
    - Expected total: approximately 40-56 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All billing feature tests pass (approximately 40-56 tests total)
- Critical user workflows for billing are covered
- No more than 10 additional tests added when filling gaps
- Testing focused exclusively on billing feature requirements

---

## Execution Order

Recommended implementation sequence:

```
Phase 1: Foundation (Parallel)
  - Task Group 1: Database Schema
  - Task Group 5: DataTable Component (no dependencies)
  - Task Group 6: Pagination Component (no dependencies)
  - Task Group 7: FilterButtons Component (no dependencies)

Phase 2: Backend (Sequential)
  - Task Group 2: Data Layer Functions (after 1)
  - Task Group 3: Webhook Handler (after 2)
  - Task Group 4: Server Actions (after 2, 3)

Phase 3: Feature UI (Sequential)
  - Task Group 8: SubscriptionStatusCard (after 4)
  - Task Group 9: Billing History Page (after 4, 5, 6, 7)
  - Task Group 10: PDF Generation (after 4)

Phase 4: Integration (Final)
  - Task Group 11: Test Review & Gap Analysis (after all)
```

## Reference Files

### Existing Code Patterns
- Webhook handler: `backup/app/api/mercadopago/route.ts`
- Plan creation action: `backup/features/account/actions/get-plan-href.action.ts`
- Cancel subscription: `backup/features/account/actions/cancel-suscription.action.ts`
- AccessGate component: `features/access/components/gate.tsx`
- Action wrapper: `features/global/utils/action-wrapper.ts`
- Prisma schema: `prisma/schema.prisma`

### Standards Compliance
- Three-layer architecture: Action > Service > Data
- Props defined in `/types` directory, never in component files
- Server Components by default, Client Components only when needed
- Use actionWrapper for all Server Actions
- Use shadcn/ui components exclusively
- Tailwind utilities only, no custom CSS
- nuqs for URL state management

### New Files to Create
```
features/billing/
  actions/
    get-billing-history.action.ts
    get-subscription-status.action.ts
    download-invoice.action.ts
    log-plan-change.action.ts
  components/
    subscription-status-card.tsx
    billing-history-table.tsx
    billing-filters.tsx
    billing-page-header.tsx
    payment-status-badge.tsx
  data/
    payment.data.ts
    invoice.data.ts
    plan-change-log.data.ts
    subscription.data.ts
  schemas/
    billing.schema.ts
  services/
    webhook-handlers.service.ts
    generate-invoice-pdf.service.ts
  types/
    billing.ts
    subscription-status-card.ts
  utils/
    mercadopago.ts
    invoice-pdf-template.ts

features/global/
  components/
    data-table.tsx
    pagination.tsx
    filter-buttons.tsx
  hooks/
    use-pagination-params.ts
    use-filter-params.ts
  types/
    data-table.ts
    pagination.ts
    filter-buttons.ts

app/
  account/
    billing/
      page.tsx
  api/
    billing/
      invoice/
        [paymentId]/
          route.ts
    mercadopago/
      route.ts (extend existing)
```
