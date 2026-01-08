# Specification: Store Creation & Management

## Goal
Enable merchants to create stores with basic information (name, description, subdomain), implement subdomain-based routing for public storefronts, and refactor dashboard navigation into a private layout. Include account-type-based store creation limits (FREE: 2 stores, PRO: 5 stores, ENTERPRISE: unlimited).

## User Stories
- As a merchant, I want to create a new store with a name, description, and custom subdomain so that I can establish my online presence
- As a merchant, I want to see my store limit based on my account type so that I understand when I need to upgrade
- As a visitor, I want to access a store's public storefront via its subdomain so that I can browse products

## Specific Requirements

**Database Schema Additions**
- Add Subscription table with userId (foreign key to User), accountType (enum: FREE, PRO, ENTERPRISE), createdAt, updatedAt
- Add relationship between User and Subscription models (one-to-one)
- Modify Store model to include description field (text, optional)
- Change Store.slug to Store.subdomain (unique text, indexed, required)
- Ensure Store model has name (text, required), subdomain (unique), description (optional), ownerId (foreign key), timestamps
- Add database constraint for subdomain uniqueness to prevent conflicts

**Store Creation Form**
- Create form component with three fields: name (text input), description (textarea), subdomain (text input)
- Use react-hook-form for form state management with yup validation schema
- Create validation schema factory function following schemaFactory.ts pattern for internationalization support
- Validate subdomain format: lowercase alphanumeric characters and hyphens only (regex pattern: /^[a-z0-9-]+$/)
- Transform subdomain input to lowercase automatically before validation
- Display inline error messages for each field using translated validation keys
- Show real-time subdomain availability check (debounced) after format validation passes
- Display confirmation message on successful creation, then redirect to /[locale]/store/[subdomain]

**Store Creation Limits and Access Control**
- Integrate AccessGate component from backup/features/shadcn/components/gate.tsx
- Create AccessManagerProvider wrapper at private layout level to provide user session context
- Pass user session with roles array containing account type (FREE, PRO, or ENTERPRISE)
- Before displaying create store button, check current store count against account type limit
- Use AccessGate with mode='disable' and tooltip to show upgrade message when limit reached
- Display different messages based on account type: "Upgrade to PRO for more stores" (FREE), "Upgrade to ENTERPRISE for unlimited stores" (PRO)
- Server-side validation must also verify store count against account limits before creating store
- Return actionWrapper error with appropriate message if user exceeds their account limit

**Subdomain Routing Middleware**
- Create middleware.ts file at project root following Vercel platforms pattern (reference: https://github.com/vercel/platforms/blob/main/middleware.ts)
- Extract subdomain from request hostname by removing base domain and port
- Support localhost development with pattern: subdomain.localhost:3000
- Use NextResponse.rewrite() to internally route subdomain requests to /s/[subdomain] path
- Exclude middleware processing for: API routes (/api/*), Next.js internals (/_next/*), static files (/favicon.ico, images, etc.)
- Handle edge cases: strip port numbers from hostname, handle preview deployment URLs
- Middleware should NOT block admin/dashboard paths when accessed via subdomain (let route handlers manage access)
- For subdomains, rewrite to storefront route; for main domain, allow normal Next.js routing

**Private Layout and Navigation Refactor**
- Create new file at src/app/[locale]/(private)/layout.tsx
- Move navigation content from DashboardNavigation component to new PrivateHeader component
- Reference landing-header.tsx composition pattern: sticky positioning, backdrop blur, container layout, flexbox arrangement
- Include in PrivateHeader: logo/brand (links to /[locale]/dashboard), navigation links (Dashboard, New sale, Stores, Profile), LanguageSwitcher, ThemeToggle, user avatar, LogoutButton
- Update "account" link to "profile" (change href from "/account" to "/profile")
- Delete features/dashboard/components/dashboard-navigation.tsx file after refactoring
- Apply private layout to all routes under (private) group to show navigation across dashboard, stores, profile pages

**First-Time User Experience**
- Modify StoreStats component to detect when storesCount is 0
- Display prominent "Create Your First Store" CTA card when user has no stores
- Position CTA alongside/below StoreStats component in dashboard
- CTA should include: icon, heading "Create Your First Store", description text, primary action button
- Use same styling pattern as existing "New store" card in StoreStats component
- Multi-step onboarding dialog is explicitly OUT OF SCOPE for this spec

**Server Actions Architecture**
- Create createStoreAction following three-layer pattern: action → service → data
- Action layer: validate input with yup schema, wrap with actionWrapper, revalidate /[locale]/dashboard and /[locale]/stores paths
- Service layer: verify user authentication, check store count against account type limit, transform/normalize input data
- Data layer: pure Prisma query to insert store record with ownerId set to authenticated user's ID
- Return ActionResponse with payload containing created store data (id, name, description, subdomain)
- Handle unique constraint violation for subdomain with user-friendly error message

**Validation Schema for Store Creation**
- Create schema factory function: createStoreSchema(t: TranslationFunction)
- Fields: name (string, required, min 1 char, max 100 chars), description (string, optional, max 500 chars), subdomain (string, required, lowercase, regex /^[a-z0-9-]+$/, min 3 chars, max 63 chars)
- Use next-intl translation keys for all error messages
- Export inferred TypeScript type: CreateStoreInput
- Follow same pattern as createSignupSchema in features/auth/schemas/schemaFactory.ts

**Post-Creation Flow**
- After successful store creation, display on-screen confirmation message
- Message should indicate: "Store created successfully. Redirecting to your store..."
- Use 1-2 second delay before redirect to allow user to see confirmation
- Redirect to /[locale]/store/[subdomain] route
- This route will be the store management page (implementation details OUT OF SCOPE)

## Visual Design
No visual files were found in the visuals folder.

## Existing Code to Leverage

**backup/features/shadcn/components/gate.tsx**
- Reuse AccessGate component for store creation limit enforcement based on account type roles
- Reuse AccessManagerProvider to wrap private layout and provide user session context
- Use hasRole function to check if user's account type (FREE, PRO, ENTERPRISE) allows store creation
- Leverage mode='disable' with tooltip prop to show upgrade message when user reaches store limit
- Apply usePermissionCheck hook in StoreStats component to conditionally disable create button

**features/layout/components/landing-header.tsx**
- Follow sticky header pattern with backdrop blur effect for private layout navigation
- Replicate container + flexbox layout structure for consistent responsive behavior
- Reuse LanguageSwitcher and ThemeToggle component integration pattern
- Apply same z-index (z-50) and border styling (border-b border-border) for visual consistency

**features/auth/schemas/schemaFactory.ts**
- Follow factory function pattern for creating store validation schema with i18n support
- Replicate createEmailField pattern for createSubdomainField with custom validation rules
- Use same translation function type signature: (key: string) => string
- Mirror yup.InferType pattern for automatic TypeScript type generation

**features/dashboard/components/store-stats.tsx**
- Extend existing empty state (storesCount === 0) to show "Create Your First Store" CTA
- Reuse motion.div animation pattern (framer-motion) for smooth card entrance
- Maintain existing Card component styling and structure for visual consistency

**backup/features/stores/actions/create-store.action.ts**
- Follow actionWrapper pattern for consistent error handling and response structure
- Replicate user authentication check: if (!userId) throw error pattern
- Use same revalidatePath calls for /dashboard and /stores after mutation
- Reference insertStoreData pattern for data layer separation and Prisma interaction

## Out of Scope
- Store editing functionality (update store name, description, subdomain)
- Store deletion or archiving features
- Store theming, customization, or branding options
- Employee invitation and management system
- Multi-step onboarding dialog for new users
- Store settings management beyond basic creation fields
- Multiple store switching UI or store selector dropdown
- Custom domain support (only subdomains supported in this spec)
- Store transfer between users or ownership changes
- Store analytics, statistics, or performance metrics
