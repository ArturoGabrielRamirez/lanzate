# Spec Requirements: Subscription Billing & Payment History

## Initial Description

Implement MercadoPago webhook integration to automatically track subscription payment transactions. Build payment history dashboard where users can view all subscription charges with status (successful, failed, pending, refunded), download invoices/receipts in PDF format, and track account plan changes (upgrades/downgrades between FREE, PRO, ENTERPRISE). Include webhook endpoint to receive MercadoPago IPN notifications and synchronize payment status. Generate simple invoices with basic billing information, designed with extensible data structure to support future integration with fiscal electronic invoicing systems (AFIP for Argentina, potentially other Latin American countries).

**Complexity:** Medium (M)

## Requirements Discussion

### First Round Questions

**Q1:** Are the subscription plans (FREE, PRO, ENTERPRISE) already defined in MercadoPago as preapproval plans that we need to sync? Or will we create the plans from scratch in both systems?
**Answer:** No hay ningun plan definido en Mercado Pago como preapproval, habria que crearlos (There are no plans defined in MercadoPago as preapproval, we need to create them)

**Q2:** For the payment table (date, amount, status, plan type with filtering), should we also include search by transaction ID? Or is filtering by date range and status sufficient?
**Answer:** A search field is not necessary, just a simple table BUT keep it as modular as possible - I'd like to reuse as much components as possible for future tables, paginations, filter buttons, etc.

**Q3:** Should we store additional fields now for future AFIP compliance (CUIT/CUIL tax ID, IVA breakdown, CAE placeholder) even if not displayed yet?
**Answer:** Yes

**Q4:** For MercadoPago IPN, we'll handle: payment.created, payment.updated, subscription_preapproval.updated. Should refunds be handled separately, or are they included in payment.updated status changes?
**Answer:** Initially unsure, but after clarification chose **(A)** - Handle refunds via status changes in `payment.updated` (simpler approach). Refunds are included when payment status changes to `refunded` or `partially_refunded`.

**Q5:** Should we track a full history log of plan changes with timestamps and user who initiated? Or just display current plan status?
**Answer:** Yes, let's keep a full history log of plan changes.

**Q6:** Who can access billing information besides the account owner?
**Answer:** Employees with certain permissions can also access billing info, maybe reuse the gate component for this if possible.

**Q7:** How should failed payments be handled - implement retry logic or rely on MercadoPago's built-in mechanism?
**Answer:** Let's rely on MP's built-in mechanism.

**Q8:** What should be explicitly excluded from this feature scope?
**Answer:** Exclude automatic dunning emails, proration for mid-cycle upgrades, multiple payment methods per account.

### Existing Code to Reference

**Similar Features Identified:**
- Feature: MercadoPago Webhook Handler - Path: `backup/app/api/mercadopago/route.ts`
- Feature: Membership Tab UI - Path: `backup/features/account/components/membership-tab.tsx`
- Feature: Cancel Subscription Action - Path: `backup/features/account/actions/cancel-suscription.action.ts`
- Feature: Create Preapproval Action - Path: `backup/features/account/actions/get-plan-href.action.ts`
- Components to potentially reuse: Gate component for permission-based access control
- Backend logic to reference: Existing webhook only handles `subscription_preapproval`, needs extension for `payment.created` and `payment.updated`
- Prisma schema has `Account` model with `suscription_id` and `AccountType` enum (FREE, PRO, ENTERPRISE)

### Follow-up Questions

**Follow-up 1:** For the modular/reusable table components - should the payment history be displayed within the membership tab or as a separate page?
**Answer:** The reusable table components will be used across admin listings (products, employees, sales, branches, etc.). In the membership tab, show only a subscription/account status summary with a "see details" or "see more" link. This link takes the user to a separate dedicated page with the full payment history table.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
N/A

## Requirements Summary

### Functional Requirements

**MercadoPago Integration:**
- Create subscription preapproval plans from scratch in MercadoPago (FREE, PRO, ENTERPRISE)
- Extend existing webhook endpoint to handle three notification types:
  - `payment.created` - New payment received
  - `payment.updated` - Payment status changes (including refunds via status `refunded`/`partially_refunded`)
  - `subscription_preapproval.updated` - Subscription status changes
- Synchronize payment status from MercadoPago IPN notifications to local database
- Rely on MercadoPago's built-in retry mechanism for failed payments (no custom retry logic)

**Payment History:**
- Store all subscription payment transactions with status tracking (successful, failed, pending, refunded)
- Display payments in a dedicated billing history page (separate from membership tab)
- Include filtering by date range and payment status (no search field needed)
- Show payment details: date, amount, status, plan type

**Invoice Generation:**
- Generate simple invoices/receipts in PDF format
- Include basic billing information
- Store AFIP-ready fields for future fiscal compliance:
  - CUIT/CUIL tax ID
  - IVA breakdown
  - CAE placeholder
  - Extensible structure for other Latin American fiscal requirements

**Plan Change Tracking:**
- Maintain full history log of plan changes (FREE <-> PRO <-> ENTERPRISE)
- Record timestamp of each change
- Record user/employee who initiated the change
- Support both upgrades and downgrades

**UI Components:**
- `SubscriptionStatusCard` - Compact summary component for membership tab showing:
  - Current plan status
  - Subscription ID
  - "See details" / "See more" link to full billing history
- `BillingHistoryPage` - Dedicated page with full payment history table
- Modular/reusable table components designed for admin pages:
  - `DataTable` - Core table component
  - `Pagination` - Pagination controls
  - `FilterButtons` - Filter UI elements
  - These will be reused for: Products, Employees, Sales, Branches admin listings

**Access Control:**
- Account owners can access their billing information
- Employees with specific permissions can access billing info
- Reuse existing gate component for permission-based access control

### Reusability Opportunities

- Gate component for permission-based billing access
- Existing MercadoPago webhook structure in `backup/app/api/mercadopago/route.ts`
- Existing membership tab component structure in `backup/features/account/components/membership-tab.tsx`
- actionWrapper utility from `@/features/global/utils`
- New modular table components (`DataTable`, `Pagination`, `FilterButtons`) designed for reuse across:
  - Products admin listing
  - Employees admin listing
  - Sales admin listing
  - Branches admin listing
  - Any future admin data tables

### Scope Boundaries

**In Scope:**
- MercadoPago preapproval plan creation (FREE, PRO, ENTERPRISE)
- Extended webhook endpoint for payment and subscription events
- Payment transaction storage and status synchronization
- Payment history page with filterable table
- PDF invoice/receipt generation
- AFIP-ready data structure (fields stored but not displayed)
- Plan change history logging with timestamps and initiator
- Permission-based access for employees
- Reusable table components for future admin pages
- Compact subscription status summary in membership tab

**Out of Scope:**
- Automatic dunning emails for failed payments
- Proration for mid-cycle plan upgrades/downgrades
- Multiple payment methods per account
- AFIP electronic invoicing integration (structure prepared, integration deferred)
- Search functionality in payment history table
- Custom payment retry logic (using MP's built-in mechanism)

### Technical Considerations

- **Integration Points:**
  - MercadoPago PreApproval API for subscription management
  - MercadoPago IPN webhooks for payment notifications
  - Existing Prisma schema with Account model and AccountType enum
  - PDF generation library (to be determined)

- **Existing System Constraints:**
  - Current webhook only handles `subscription_preapproval` - needs extension
  - Account model already has `suscription_id` field
  - AccountType enum already defines FREE, PRO, ENTERPRISE

- **Technology Stack (per tech-stack.md):**
  - Next.js App Router with Server Actions
  - Prisma ORM with PostgreSQL (via Supabase)
  - React Hook Form + Yup for validation
  - shadcn/ui components
  - nuqs for URL state management (useful for table filters)

- **Similar Code Patterns to Follow:**
  - Feature-based folder structure
  - Server Actions pattern from existing actions
  - actionWrapper utility for consistent action responses
  - Gate component pattern for access control

- **New Database Models Needed:**
  - Payment transaction records
  - Invoice/receipt records with AFIP-ready fields
  - Plan change history log
