# Task Breakdown: Store Creation & Management

## Overview
Total Task Groups: 8
Estimated Total Tasks: ~50

This feature enables merchants to create stores with name, description, and subdomain. It implements account-type-based creation limits (FREE: 2, PRO: 5, ENTERPRISE: unlimited), subdomain routing middleware, and refactors dashboard navigation into a private layout.

## Task List

### Task Group 1: Database Schema & Migrations

#### Database Layer - Subscription & Store Models
**Dependencies:** None

- [ ] 1.0 Complete database schema updates
  - [x] 1.1 Write 2-8 focused tests for Subscription and Store models
    - Test Subscription model: userId relationship, accountType enum validation
    - Test Store model: subdomain uniqueness, ownerId relationship
    - Test Store-User relationship (one-to-many)
    - Limit to critical model behaviors only
  - [x] 1.2 Create Subscription model in Prisma schema
    - Fields: id (cuid), userId (foreign key to User), accountType (enum: FREE, PRO, ENTERPRISE), createdAt, updatedAt
    - Add one-to-one relationship between User and Subscription
    - Add @@map("subscriptions") for plural table name
    - Add @@index([userId]) for query performance
  - [x] 1.3 Update Store model in Prisma schema
    - Add description field (String?, @db.Text, optional)
    - Rename slug field to subdomain (String, unique, required)
    - Ensure fields: id (cuid), name (String, required), description (String?, @db.Text), subdomain (String, unique, indexed), ownerId (foreign key to User), createdAt, updatedAt
    - Add @@unique([subdomain]) constraint
    - Add @@index([subdomain]) for routing performance
    - Add @@index([ownerId]) for user queries
    - Add @@map("stores") for plural table name
    - Add relationship: owner User @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  - [x] 1.4 Update User model relationships
    - Add subscription Subscription? relationship
    - Update stores Store[] relationship to match new Store model
  - [x] 1.5 Create database migration
    - Run: bunx prisma migrate dev --name add_subscription_and_update_store
    - Review generated SQL before applying
    - Verify migration creates Subscription table
    - Verify migration renames Store.slug to Store.subdomain
    - Verify migration adds Store.description field
    - Verify all indexes are created
  - [x] 1.6 Regenerate Prisma types
    - Run: bunx prisma generate
    - Verify @prisma/client exports updated types
  - [x] 1.7 Run database layer tests
    - Execute ONLY the 2-8 tests written in 1.1
    - Verify migrations run successfully
    - Do NOT run entire test suite

**Acceptance Criteria:**
- Subscription model exists with accountType enum (FREE, PRO, ENTERPRISE)
- Store model has description and subdomain (with unique constraint)
- User-Subscription relationship is one-to-one
- User-Store relationship is one-to-many with cascade delete
- All indexes created on foreign keys and subdomain
- Migration applied successfully
- Prisma types regenerated
- Model tests pass (2-8 tests)

---

### Task Group 2: TypeScript Types & Validation Schemas

#### Type Definitions & Validation Layer
**Dependencies:** Task Group 1

- [x] 2.0 Complete types and validation schemas
  - [x] 2.1 Write 2-8 focused tests for validation schemas
    - Test createStoreSchema with valid input
    - Test subdomain validation (lowercase, alphanumeric + hyphens)
    - Test subdomain format transformation (auto-lowercase)
    - Test field length constraints (name, description, subdomain)
    - Test required field validation
    - Limit to critical validation behaviors only
  - [x] 2.2 Create Subscription types file
    - Path: features/subscriptions/types/subscription.ts
    - Re-export: Subscription, AccountType from @prisma/client
    - Create: SubscriptionWithUser extends Subscription with User relation
    - Follow models.md pattern for Prisma type reuse
  - [x] 2.3 Update Store types file
    - Path: features/stores/types/store.ts
    - Re-export: Store from @prisma/client
    - Update: StoreWithOwner to include subdomain and description
    - Create: CreateStoreInput = Omit<Store, 'id' | 'createdAt' | 'updatedAt'>
  - [x] 2.4 Create store validation schema factory
    - Path: features/stores/schemas/schemaFactory.ts
    - Create: createStoreSchema(t: (key: string) => string)
    - Follow schemaFactory.ts pattern from features/auth/schemas/
    - Fields:
      - name: string, required, min 1 char, max 100 chars, trim
      - description: string, optional, max 500 chars, trim
      - subdomain: string, required, lowercase transformation, regex /^[a-z0-9-]+$/, min 3 chars, max 63 chars, trim
    - Export: CreateStoreInput type using yup.InferType<typeof createStoreSchema>
    - Use translation keys for all error messages: 'validation.store.name.required', etc.
  - [x] 2.5 Add validation translation keys
    - Path: locales/en/common.json and locales/es/common.json
    - Add validation.store.name.required, validation.store.name.min, validation.store.name.max
    - Add validation.store.subdomain.required, validation.store.subdomain.format, validation.store.subdomain.min, validation.store.subdomain.max
    - Add validation.store.description.max
    - Add validation.store.subdomain.taken for uniqueness errors
  - [x] 2.6 Run validation schema tests
    - Execute ONLY the 2-8 tests written in 2.1
    - Verify schema validation works correctly
    - Do NOT run entire test suite

**Acceptance Criteria:**
- Subscription and Store types properly re-export Prisma types
- createStoreSchema factory function created with i18n support
- Subdomain validation enforces lowercase alphanumeric + hyphens
- Subdomain auto-transforms to lowercase
- All validation error messages use translation keys
- Translation files updated for both English and Spanish
- Validation schema tests pass (2-8 tests)

---

### Task Group 3: Data Layer & Service Layer

#### Store Creation Business Logic
**Dependencies:** Task Group 2

- [x] 3.0 Complete data and service layers
  - [x] 3.1 Write 2-8 focused tests for data and service layers
    - Test createStoreData inserts store record with correct fields
    - Test createStoreService checks store count against account limits
    - Test service throws error when FREE user has 2 stores
    - Test service throws error when PRO user has 5 stores
    - Test service allows ENTERPRISE users unlimited stores
    - Test findUserStoresData query
    - Limit to critical business logic behaviors only
  - [x] 3.2 Create data layer functions
    - Path: features/stores/data/createStore.data.ts
    - Function: createStoreData(input: CreateStoreInput, userId: string): Promise<Store>
    - Pure Prisma query: prisma.store.create({ data: { ...input, ownerId: userId } })
    - Import prisma from @/features/core/data/prisma
    - Path: features/stores/data/findUserStores.data.ts
    - Function: findUserStoresData(userId: string): Promise<Store[]>
    - Query: prisma.store.findMany({ where: { ownerId: userId } })
    - Path: features/stores/data/countUserStores.data.ts
    - Function: countUserStoresData(userId: string): Promise<number>
    - Query: prisma.store.count({ where: { ownerId: userId } })
  - [x] 3.3 Create getUserSubscription data function
    - Path: features/subscriptions/data/getUserSubscription.data.ts
    - Function: getUserSubscriptionData(userId: string): Promise<Subscription | null>
    - Query: prisma.subscription.findUnique({ where: { userId } })
  - [x] 3.4 Create service layer for store creation
    - Path: features/stores/services/createStore.service.ts
    - Function: createStoreService(input: CreateStoreInput, userId: string): Promise<Store>
    - Business logic:
      1. Get user's subscription using getUserSubscriptionData
      2. Count user's current stores using countUserStoresData
      3. Check limit: FREE=2, PRO=5, ENTERPRISE=unlimited
      4. Throw error if limit reached (use translation key)
      5. Call createStoreData if allowed
      6. Return created store
    - Transform subdomain to lowercase before passing to data layer
  - [x] 3.5 Add service error message translations
    - Path: locales/en/common.json and locales/es/common.json
    - Add: errors.store.limitReached.free, errors.store.limitReached.pro
    - Add: errors.store.subdomainTaken
  - [x] 3.6 Run data and service layer tests
    - Execute ONLY the 2-8 tests written in 3.1
    - Verify store creation limits work correctly
    - Do NOT run entire test suite

**Acceptance Criteria:**
- createStoreData function creates store with userId as ownerId
- countUserStoresData returns accurate store count for user
- createStoreService enforces account-type-based limits
- Service throws appropriate errors for limit violations
- Subdomain is transformed to lowercase in service layer
- All error messages use translation keys
- Data and service layer tests pass (2-8 tests)

---

### Task Group 4: Server Actions

#### Server Action for Store Creation
**Dependencies:** Task Group 3

- [ ] 4.0 Complete server action layer
  - [x] 4.1 Write 2-8 focused tests for createStoreAction
    - Test action validates input with schema
    - Test action returns error when limit reached
    - Test action creates store successfully with valid input
    - Test action revalidates paths after creation
    - Test action handles unique constraint violation (subdomain taken)
    - Limit to critical action behaviors only
  - [ ] 4.2 Create createStoreAction
    - Path: features/stores/actions/createStore.action.ts
    - Directive: "use server" at top of file
    - Function: createStoreAction(formData: FormData): Promise<ActionResponse<Store>>
    - Use actionWrapper from @/features/core
    - Get userId from current user session (Supabase Auth)
    - Throw error if !userId ("User not authenticated")
    - Validate formData with createStoreSchema
    - Call createStoreService(validatedData, userId)
    - Revalidate: revalidatePath('/[locale]/dashboard') and revalidatePath('/[locale]/stores')
    - Return: { payload: store, message: 'Store created successfully' }
    - Handle Prisma unique constraint error (P2002) for subdomain
    - Return error message using translation key: errors.store.subdomainTaken
  - [ ] 4.3 Add action success message translations
    - Path: locales/en/common.json and locales/es/common.json
    - Add: success.store.created
  - [ ] 4.4 Run server action tests
    - Execute ONLY the 2-8 tests written in 4.1
    - Verify action validates, creates, and revalidates correctly
    - Do NOT run entire test suite

**Acceptance Criteria:**
- createStoreAction wrapped with actionWrapper
- Action validates input with createStoreSchema
- Action verifies user authentication before proceeding
- Action enforces store limits via service layer
- Action revalidates /[locale]/dashboard and /[locale]/stores paths
- Action returns ActionResponse<Store> with proper structure
- Subdomain uniqueness violations handled gracefully
- All messages use translation keys
- Server action tests pass (2-8 tests)

---

### Task Group 5: Access Control & UI Components

#### Store Creation Form & Access Gate Integration
**Dependencies:** Task Group 4

- [ ] 5.0 Complete access control and UI components
  - [ ] 5.1 Write 2-8 focused tests for UI components
    - Test CreateStoreForm renders all fields
    - Test form validates input client-side
    - Test form displays error messages
    - Test AccessGate disables button when limit reached
    - Test CreateStoreButton shows correct upgrade message
    - Limit to critical UI behaviors only
  - [ ] 5.2 Copy AccessGate components to project
    - Source: backup/features/shadcn/components/gate.tsx
    - Destination: features/access/components/
    - Copy: AccessGate, AccessManagerProvider, usePermissionCheck
    - Verify all shadcn/ui dependencies are available
  - [ ] 5.3 Create AccessGate types
    - Path: features/access/types/access.ts
    - Define: AccessGateProps, AccessManagerProviderProps
    - Define: UserSession interface with roles: string[]
  - [ ] 5.4 Create CreateStoreForm component
    - Path: features/stores/components/CreateStoreForm.tsx
    - Directive: "use client"
    - Use react-hook-form with yupResolver(createStoreSchema(t))
    - Fields: name (Input), description (Textarea), subdomain (Input)
    - Transform subdomain to lowercase on input (onChange)
    - Display inline error messages using errors object
    - Use useTransition for form submission
    - Call createStoreAction on submit
    - Display toast on success/error
    - On success: show confirmation message for 1.5 seconds, then redirect to /[locale]/store/[subdomain]
    - Use shadcn/ui: Form, Input, Textarea, Button, Label
    - Follow useTransition pattern from components.md
  - [ ] 5.5 Create CreateStoreButton component
    - Path: features/stores/components/CreateStoreButton.tsx
    - Directive: "use client"
    - Props: currentStoreCount (number), accountType (AccountType)
    - Wrap button with AccessGate component
    - Mode: 'disable' when limit reached
    - Roles: [accountType] (FREE, PRO, ENTERPRISE)
    - Calculate isLimitReached based on accountType and currentStoreCount
    - Tooltip messages:
      - FREE at limit (2): "Upgrade to PRO for more stores"
      - PRO at limit (5): "Upgrade to ENTERPRISE for unlimited stores"
      - ENTERPRISE: never disabled
    - Button opens dialog with CreateStoreForm
    - Use shadcn/ui: Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
  - [ ] 5.6 Create component props types
    - Path: features/stores/types/store.ts
    - Add: CreateStoreFormProps, CreateStoreButtonProps
  - [ ] 5.7 Add UI translation keys
    - Path: locales/en/common.json and locales/es/common.json
    - Add: ui.store.create, ui.store.name, ui.store.description, ui.store.subdomain
    - Add: ui.store.createButton, ui.store.upgradeTooltip.free, ui.store.upgradeTooltip.pro
  - [ ] 5.8 Run UI component tests
    - Execute ONLY the 2-8 tests written in 5.1
    - Verify form validation and AccessGate work correctly
    - Do NOT run entire test suite

**Acceptance Criteria:**
- AccessGate and AccessManagerProvider copied from backup
- CreateStoreForm uses react-hook-form with yup validation
- Form displays inline error messages for each field
- Subdomain input transforms to lowercase automatically
- CreateStoreButton uses AccessGate to enforce store limits
- Button disabled with tooltip when limit reached
- Tooltip messages match account type (FREE/PRO/ENTERPRISE)
- Form submission uses useTransition + toast pattern
- Success shows confirmation, waits 1.5s, then redirects
- All UI text uses translation keys
- UI component tests pass (2-8 tests)

---

### Task Group 6: Private Layout & Navigation Refactor

#### Create Private Layout and Refactor Navigation
**Dependencies:** Task Group 5

- [ ] 6.0 Complete private layout and navigation refactor
  - [ ] 6.1 Write 2-8 focused tests for navigation
    - Test PrivateHeader renders all navigation links
    - Test PrivateHeader includes LanguageSwitcher and ThemeToggle
    - Test profile link (not account)
    - Test navigation visible across private routes
    - Limit to critical navigation behaviors only
  - [ ] 6.2 Create PrivateHeader component
    - Path: features/layout/components/PrivateHeader.tsx
    - Directive: "use client"
    - Reference: features/layout/components/landing-header.tsx for composition pattern
    - Structure: sticky header, backdrop blur, z-50, border-b
    - Container: max-w-7xl mx-auto px-4
    - Layout: flex justify-between items-center h-16
    - Left side: Logo/brand (Link to /[locale]/dashboard)
    - Center: Navigation links (Dashboard, New sale, Stores, Profile)
    - Right side: LanguageSwitcher, ThemeToggle, UserAvatar, LogoutButton
    - Update "account" link to "profile" (href="/[locale]/profile")
    - Use shadcn/ui: Button (variant="ghost" for nav links)
    - Use next-intl for Link and useTranslations
  - [ ] 6.3 Create private layout file
    - Path: src/app/[locale]/(private)/layout.tsx
    - Wrap children with AccessManagerProvider
    - Get user session from Supabase Auth
    - Pass session to AccessManagerProvider with roles: [subscription.accountType]
    - Render PrivateHeader
    - Render children below header
    - Apply to routes: dashboard, stores, profile, new-sale
  - [ ] 6.4 Delete DashboardNavigation component
    - Path: features/dashboard/components/dashboard-navigation.tsx
    - Remove file after confirming PrivateHeader is working
    - Remove any imports of DashboardNavigation from dashboard pages
  - [ ] 6.5 Create PrivateHeader types
    - Path: features/layout/types/layout.ts
    - Add: PrivateHeaderProps (if needed)
  - [ ] 6.6 Add navigation translation keys
    - Path: locales/en/common.json and locales/es/common.json
    - Add: nav.dashboard, nav.newSale, nav.stores, nav.profile
  - [ ] 6.7 Run navigation tests
    - Execute ONLY the 2-8 tests written in 6.1
    - Verify navigation renders correctly across private routes
    - Do NOT run entire test suite

**Acceptance Criteria:**
- PrivateHeader created following landing-header.tsx composition pattern
- Header includes logo, navigation links, LanguageSwitcher, ThemeToggle, UserAvatar, LogoutButton
- "Account" link changed to "Profile" linking to /[locale]/profile
- Private layout created at src/app/[locale]/(private)/layout.tsx
- Layout wraps children with AccessManagerProvider
- User session passed to provider with accountType as role
- DashboardNavigation component deleted
- Navigation visible across all private routes
- All navigation text uses translation keys
- Navigation tests pass (2-8 tests)

---

### Task Group 7: First-Time User Experience & Dashboard Integration

#### Create Your First Store CTA & Dashboard Integration
**Dependencies:** Task Group 6

- [ ] 7.0 Complete first-time user experience
  - [ ] 7.1 Write 2-8 focused tests for dashboard integration
    - Test StoreStats displays CTA when storesCount is 0
    - Test CTA card renders with correct content
    - Test CTA shows CreateStoreButton
    - Test CTA hidden when user has stores
    - Limit to critical dashboard behaviors only
  - [ ] 7.2 Update StoreStats component
    - Path: features/dashboard/components/StoreStats.tsx
    - Add conditional rendering: if storesCount === 0, show FirstStoreCTA
    - Pass currentStoreCount and accountType props to CreateStoreButton
    - Position CTA alongside/below existing StoreStats cards
    - Maintain existing motion.div animation pattern (framer-motion)
  - [ ] 7.3 Create FirstStoreCTA component
    - Path: features/stores/components/FirstStoreCTA.tsx
    - Use shadcn/ui Card component
    - Include: icon (Store icon), heading, description text, CreateStoreButton
    - Follow same styling pattern as existing StoreStats cards
    - Use framer-motion for entrance animation
    - Content: "Create Your First Store" heading, brief description
  - [ ] 7.4 Update dashboard page to fetch subscription
    - Path: src/app/[locale]/(private)/dashboard/page.tsx
    - Fetch user's subscription using getUserSubscriptionData
    - Pass accountType to StoreStats component
    - Default to FREE if no subscription found
  - [ ] 7.5 Create FirstStoreCTA types
    - Path: features/stores/types/store.ts
    - Add: FirstStoreCTAProps
  - [ ] 7.6 Add CTA translation keys
    - Path: locales/en/common.json and locales/es/common.json
    - Add: ui.store.firstStore.heading, ui.store.firstStore.description
  - [ ] 7.7 Run dashboard integration tests
    - Execute ONLY the 2-8 tests written in 7.1
    - Verify CTA displays correctly for users with no stores
    - Do NOT run entire test suite

**Acceptance Criteria:**
- StoreStats component conditionally renders FirstStoreCTA when storesCount is 0
- FirstStoreCTA card includes icon, heading, description, and CreateStoreButton
- CTA follows same styling and animation pattern as existing StoreStats cards
- Dashboard page fetches user subscription and passes accountType
- CTA hidden when user has one or more stores
- All CTA text uses translation keys
- Dashboard integration tests pass (2-8 tests)

---

### Task Group 8: Subdomain Routing Middleware

#### Implement Subdomain Detection and Routing
**Dependencies:** Task Group 7

- [ ] 8.0 Complete subdomain routing middleware
  - [ ] 8.1 Write 2-8 focused tests for middleware
    - Test subdomain extraction from hostname
    - Test rewrite to /s/[subdomain] for valid subdomains
    - Test localhost development pattern (subdomain.localhost:3000)
    - Test exclusion of API routes, _next, static files
    - Test port number stripping from hostname
    - Limit to critical middleware behaviors only
  - [ ] 8.2 Create middleware.ts file
    - Path: middleware.ts (project root)
    - Reference: https://github.com/vercel/platforms/blob/main/middleware.ts
    - Import: NextRequest, NextResponse from 'next/server'
    - Function: middleware(req: NextRequest): NextResponse
    - Export: config object with matcher patterns
  - [ ] 8.3 Implement subdomain extraction logic
    - Get hostname from req.headers.get('host')
    - Strip port number (split by ':' and take first part)
    - Define base domains: ['localhost', 'lanzate.com', 'vercel.app']
    - Extract subdomain by removing base domain
    - Handle localhost pattern: subdomain.localhost
    - Return null if no subdomain or if subdomain matches base domain
  - [ ] 8.4 Implement route rewriting
    - If subdomain exists and is valid, use NextResponse.rewrite()
    - Rewrite to: /s/[subdomain] + original pathname
    - Preserve query parameters and search params
    - Example: store1.localhost:3000/products -> rewrite to /s/store1/products
  - [ ] 8.5 Implement exclusion patterns
    - Exclude paths: /api/*, /_next/*, /favicon.ico, /images/*, /styles/*
    - Check pathname before processing subdomain
    - Return NextResponse.next() for excluded paths
    - Use config.matcher to optimize middleware execution
  - [ ] 8.6 Create placeholder storefront route
    - Path: src/app/s/[subdomain]/page.tsx
    - Simple page displaying: "Storefront for [subdomain]"
    - Fetch store by subdomain to verify it exists
    - Show 404 if store not found
    - Note: Full storefront implementation is OUT OF SCOPE
  - [ ] 8.7 Create findStoreBySubdomain data function
    - Path: features/stores/data/findStoreBySubdomain.data.ts
    - Function: findStoreBySubdomainData(subdomain: string): Promise<Store | null>
    - Query: prisma.store.findUnique({ where: { subdomain } })
  - [ ] 8.8 Add middleware configuration
    - Export config with matcher
    - Matcher should match all paths except excluded ones
    - Example: matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
  - [ ] 8.9 Run middleware tests
    - Execute ONLY the 2-8 tests written in 8.1
    - Verify subdomain routing works in localhost development
    - Do NOT run entire test suite

**Acceptance Criteria:**
- middleware.ts created at project root
- Middleware extracts subdomain from hostname correctly
- Localhost development supported (subdomain.localhost:3000)
- Middleware rewrites requests to /s/[subdomain] route
- API routes, _next paths, and static files excluded from processing
- Port numbers stripped from hostname during extraction
- Placeholder storefront route created at /s/[subdomain]
- findStoreBySubdomainData function retrieves store by subdomain
- Middleware config exports proper matcher patterns
- Middleware tests pass (2-8 tests)

---

## Testing & Final Review

### Task Group 9: Test Coverage Review & Integration Testing

#### Review Tests and Fill Critical Gaps
**Dependencies:** Task Groups 1-8

- [ ] 9.0 Review existing tests and fill critical gaps only
  - [ ] 9.1 Review tests from Task Groups 1-8
    - Review database layer tests (Task 1.1): 2-8 tests
    - Review validation schema tests (Task 2.1): 2-8 tests
    - Review data/service layer tests (Task 3.1): 2-8 tests
    - Review server action tests (Task 4.1): 2-8 tests
    - Review UI component tests (Task 5.1): 2-8 tests
    - Review navigation tests (Task 6.1): 2-8 tests
    - Review dashboard integration tests (Task 7.1): 2-8 tests
    - Review middleware tests (Task 8.1): 2-8 tests
    - Total existing tests: approximately 16-64 tests
  - [ ] 9.2 Analyze test coverage gaps for THIS feature only
    - Identify critical end-to-end workflows lacking coverage:
      - Full store creation flow (form submission → validation → creation → redirect)
      - Store limit enforcement flow (FREE/PRO/ENTERPRISE limits)
      - Subdomain routing flow (subdomain URL → middleware → storefront)
      - First-time user flow (no stores → CTA → create store)
    - Focus ONLY on gaps related to Store Creation & Management feature
    - Do NOT assess entire application test coverage
    - Prioritize integration tests over additional unit tests
  - [ ] 9.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on end-to-end integration tests:
      - Test complete store creation flow from form to database
      - Test store limit enforcement prevents creation at limits
      - Test subdomain routing middleware correctly rewrites URLs
      - Test first-time user sees CTA and can create first store
      - Test AccessGate correctly disables button at account limits
    - Do NOT write comprehensive coverage for all scenarios
    - Skip exhaustive edge cases, performance tests, accessibility tests
  - [ ] 9.4 Run feature-specific tests only
    - Run ONLY tests related to Store Creation & Management feature
    - Expected total: approximately 26-74 tests maximum
    - Do NOT run the entire application test suite
    - Verify all critical workflows pass
    - Fix any failing tests

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 26-74 tests total)
- Critical user workflows for Store Creation & Management are covered:
  - Store creation with account type limits
  - Subdomain routing to storefronts
  - First-time user CTA display
  - Navigation refactor to private layout
- No more than 10 additional tests added when filling gaps
- Testing focused exclusively on this spec's feature requirements
- All tests use proper mocking for external dependencies
- Tests run in reasonable time (under 30 seconds total)

---

## Execution Order

Recommended implementation sequence:

1. **Database Layer** (Task Group 1) - Foundation for all data operations
2. **Types & Validation** (Task Group 2) - Type safety and input validation
3. **Data & Service Layers** (Task Group 3) - Business logic for store creation
4. **Server Actions** (Task Group 4) - API layer for client-server communication
5. **UI Components** (Task Group 5) - User interface for store creation
6. **Navigation Refactor** (Task Group 6) - Private layout and header
7. **Dashboard Integration** (Task Group 7) - First-time user experience
8. **Middleware** (Task Group 8) - Subdomain routing
9. **Test Review** (Task Group 9) - Fill critical testing gaps

---

## Notes

- **i18n Support**: All user-facing strings must use translation keys from locales/en/common.json and locales/es/common.json
- **Prisma Singleton**: Always import prisma from @/features/core/data/prisma, never create new instances
- **shadcn/ui**: Use existing shadcn/ui components (Button, Input, Textarea, Dialog, Card, etc.) - do not create custom UI components
- **Server Components First**: Only add "use client" directive when component needs interactivity (event handlers, hooks)
- **actionWrapper Pattern**: All server actions must use actionWrapper from @/features/core for consistent error handling
- **Testing Strategy**: Each task group writes 2-8 focused tests during development, with final review (Task Group 9) adding up to 10 additional tests for critical gaps
- **Out of Scope**: Store editing, deletion, theming, employee invitations, multi-step onboarding, custom domains, store analytics are NOT included in this implementation
