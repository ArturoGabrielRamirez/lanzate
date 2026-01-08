# Spec Requirements: Store Creation & Management

## Initial Description

Enable merchants to create their first store with basic information (name, description, subdomain). Implement subdomain routing and store ownership assignment. Also refactor dashboard navigation to private layout.

## Requirements Discussion

### First Round Questions

**Q1: How should we handle store creation limits?**
**Answer:** Users can create multiple stores from the start. Implement account types: FREE, PRO, ENTERPRISE. FREE accounts can create up to 2 stores, PRO accounts up to 5 stores, ENTERPRISE accounts have unlimited stores. Use the gate.tsx component from backup for UI access control based on account type.

**Q2: What validation rules should apply to store names and subdomains?**
**Answer:** Store name can be anything. Subdomain must be lowercase alphanumeric with hyphens only.

**Q3: What fields should the store creation form include?**
**Answer:** Keep it simple with three fields: name, description, and subdomain.

**Q4: How should subdomain routing work?**
**Answer:** Use proxy.ts Next.js middleware to detect and redirect. Subdomain always shows public storefront for any user. Store owners manage stores through private pages.

**Q5: Where should the dashboard navigation refactor be implemented?**
**Answer:** Move dashboard navigation to `src/app/[locale]/(private)/layout.tsx`. Reference `features/layout/components/landing-header.tsx` for composition patterns. Extract reusable components to avoid repetition.

**Q6: What happens after a store is successfully created?**
**Answer:** Show confirmation message on screen saying to wait for redirection, then redirect to `localhost:3000/[locale]/store/[subdomain]`.

**Q7: What should first-time users see?**
**Answer:** Show a call to action section on the dashboard for new users (users with no stores). Multi-step dialog onboarding will be implemented later (OUT OF SCOPE).

**Q8: What features should be excluded from this spec?**
**Answer:** Store editing, deletion, theming/customization, and employee invitations are all OUT OF SCOPE.

### Follow-up Questions

**Follow-up 1: Where should the account type (FREE, PRO, ENTERPRISE) be stored?**
**Answer:** Store account type in a separate Subscription table/model. This requires a new database model/table addition.

**Follow-up 2: How should the Gate component be used with account types?**
**Answer:** Treat account types as roles (FREE, PRO, ENTERPRISE as role strings). Use the roles-based approach from gate.tsx.

**Follow-up 3: Any specific subdomain middleware implementation to reference?**
**Answer:** Mimic the implementation from https://github.com/vercel/platforms/blob/main/middleware.ts as a reference pattern for subdomain detection and routing.

**Follow-up 4: Which "account" links need updating to "profile"?**
**Answer:** Only one "account" link needs updating in dashboard-navigation.tsx (lines 71-77). Change "/account" to "/profile".

**Follow-up 5: Where should the "Create Store" CTA be placed for users with no stores?**
**Answer:** Display "Create Store" CTA alongside/below the StoreStats component.

**Follow-up 6: What needs to happen with the DashboardNavigation component?**
**Answer:** Delete the DashboardNavigation component. Move refactored content to a new component. The private layout file needs to be created (doesn't exist currently).

### Existing Code to Reference

**Similar Features Identified:**

- **Access Control Component:** `backup/features/shadcn/components/gate.tsx`
  - Implements role-based access control with AccessGate component
  - Uses AccessManagerProvider to manage user sessions and roles
  - Supports role checking, permission checking, and session validation
  - Provides mode options: 'hide', 'disable', 'show-fallback'
  - Can be used to gate store creation based on account type (FREE, PRO, ENTERPRISE)

- **Header Composition Pattern:** `features/layout/components/landing-header.tsx`
  - Shows simple header structure with logo, navigation, and utility components
  - Uses container layout with flexbox for responsive arrangement
  - Includes LanguageSwitcher and ThemeToggle components
  - Demonstrates sticky positioning and backdrop blur effects
  - Can be referenced for private layout navigation composition

- **Subdomain Routing Reference:** https://github.com/vercel/platforms/blob/main/middleware.ts
  - Detects subdomains using hostname comparison and regex patterns
  - Handles localhost development with `.localhost` pattern matching
  - Uses NextResponse.rewrite() for transparent internal routing to `/s/${subdomain}`
  - Uses NextResponse.redirect() for security (blocking admin paths on subdomains)
  - Excludes API routes, Next.js internals, and public files from middleware processing
  - Strips port numbers from hostnames for accurate subdomain extraction
  - Handles Vercel preview deployment URLs with special `tenant---branch` format

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual files were found in the visuals folder.

## Requirements Summary

### Functional Requirements

**Store Creation:**
- Merchant can create a new store with three fields: name, description, subdomain
- Store name accepts any text input
- Subdomain must be validated as lowercase alphanumeric with hyphens only
- Subdomain must be unique across all stores (database constraint)
- Store creation is limited based on account type:
  - FREE: up to 2 stores
  - PRO: up to 5 stores
  - ENTERPRISE: unlimited stores
- Store creation form should be gated using AccessGate component based on current store count and account type
- Upon successful creation, show confirmation message and redirect to `localhost:3000/[locale]/store/[subdomain]`
- Store ownership is automatically assigned to the authenticated user who creates it

**Account Type Management:**
- New Subscription model/table to store account type per user
- Account types: FREE, PRO, ENTERPRISE (treated as role strings)
- Account type determines store creation limits
- Use AccessGate component with roles-based approach to control UI access

**Subdomain Routing:**
- Implement Next.js middleware (proxy.ts or similar) for subdomain detection
- Follow Vercel platforms pattern: detect subdomain from hostname, rewrite to internal route
- Subdomain URLs always display public storefront (for any visitor)
- Store owners manage their stores via private dashboard pages (not via subdomain)
- Middleware should:
  - Extract subdomain from hostname
  - Support localhost development (e.g., `storename.localhost:3000`)
  - Rewrite requests to appropriate internal routes
  - Exclude API routes, Next.js internals, and static files from processing
  - Handle edge cases (port numbers, preview deployments)

**Dashboard Navigation Refactor:**
- Create new private layout at `src/app/[locale]/(private)/layout.tsx`
- Delete existing DashboardNavigation component
- Move navigation content to new reusable component
- Apply navigation to all private pages (visible across entire private section)
- Update "account" link to "profile" (dashboard-navigation.tsx lines 71-77)
- Reference landing-header.tsx for composition patterns (container, flexbox, sticky positioning, backdrop blur)

**First-Time User Experience:**
- Display "Create Store" CTA on dashboard for users with no stores
- CTA should appear alongside/below StoreStats component
- Multi-step dialog onboarding is OUT OF SCOPE for this spec

### Reusability Opportunities

**Components to Reuse:**
- `backup/features/shadcn/components/gate.tsx` - AccessGate and AccessManagerProvider for role-based access control
- Pattern from `features/layout/components/landing-header.tsx` - Header composition, layout structure, utility component placement
- Existing form patterns from authentication flows - Form structure, validation, error handling

**Backend Patterns to Reference:**
- Subdomain middleware: https://github.com/vercel/platforms/blob/main/middleware.ts
- Hostname parsing, rewrite logic, edge case handling
- User authentication and session management from existing auth implementation
- Database model creation patterns from Prisma schema

**Technical Patterns:**
- Roles-based access control treating account types as roles (FREE, PRO, ENTERPRISE)
- Next.js middleware for request interception and routing
- Client-side form validation with yup schemas
- Server actions for data mutations

### Scope Boundaries

**In Scope:**
- Store creation form with name, description, subdomain fields
- Subdomain validation (lowercase alphanumeric with hyphens)
- Store creation limits based on account type (FREE: 2, PRO: 5, ENTERPRISE: unlimited)
- New Subscription model/table for account type storage
- Subdomain routing middleware for public storefront display
- Store ownership assignment on creation
- Post-creation confirmation and redirect to store subdomain
- Private layout creation with navigation
- Dashboard navigation refactor to private layout
- "Account" to "Profile" link update
- "Create Store" CTA for users with no stores
- AccessGate component integration for store creation limits

**Out of Scope:**
- Store editing functionality
- Store deletion functionality
- Store theming and customization
- Employee invitation system
- Multi-step onboarding dialog
- Store settings management
- Store analytics or statistics
- Multiple store switching UI
- Store archiving or soft delete
- Custom domain support (only subdomains)
- Store transfer between users

### Technical Considerations

**Database Schema:**
- New Subscription table/model required with fields:
  - userId (foreign key to User)
  - accountType (enum: FREE, PRO, ENTERPRISE)
  - Relationship to User model
- Store model needs:
  - name (text)
  - description (text)
  - subdomain (unique text, indexed)
  - ownerId (foreign key to User)
  - timestamps (createdAt, updatedAt)
  - Relationship to User model

**Middleware Implementation:**
- Follow Vercel platforms middleware pattern
- Subdomain extraction from hostname
- Localhost development support (`.localhost` pattern)
- NextResponse.rewrite() for internal routing
- Exclude `/api`, `/_next`, static files from processing
- Handle port numbers in hostname parsing
- Edge case handling for preview deployments

**Form Validation:**
- Client-side validation with yup schema
- Subdomain format: lowercase alphanumeric + hyphens regex
- Subdomain uniqueness check (server-side)
- Required field validation for all three fields
- Error message display per field

**Access Control:**
- Use AccessGate component with roles prop
- Roles: FREE, PRO, ENTERPRISE
- Check current store count against account type limit
- Disable/hide store creation button when limit reached
- Display upgrade message for users at limit

**Routing:**
- Private layout path: `src/app/[locale]/(private)/layout.tsx`
- Store management: `/[locale]/dashboard` (private)
- Public storefront: `storename.localhost:3000` or `storename.lanzate.com` (public)
- Post-creation redirect: `/[locale]/store/[subdomain]`

**Component Architecture:**
- Extract navigation to reusable component
- Composition pattern from landing-header.tsx
- Delete DashboardNavigation component
- StoreStats component placement for CTA

**Integration Points:**
- Supabase Auth for user session
- Prisma ORM for database operations
- Next.js middleware for subdomain routing
- next-intl for internationalized routes and messages
- AccessManagerProvider context for role checking

**Existing Tech Stack Alignment:**
- Next.js App Router with Server Components
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui components (including reused Gate component)
- Supabase for authentication and database
- Prisma ORM for data modeling
- next-intl for internationalization
- yup for validation schemas
- react-hook-form for form management

**Performance:**
- Middleware should have minimal performance impact
- Use database indexes on subdomain field for quick lookups
- Server-side validation to prevent duplicate subdomains
- Optimistic UI updates where possible

**Security:**
- Subdomain validation to prevent injection attacks
- Store ownership verification for all store operations
- Role-based access control for store creation limits
- Server-side validation of all user inputs
- Prevent subdomain conflicts and takeover attempts
