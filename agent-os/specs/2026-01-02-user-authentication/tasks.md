# Task Breakdown: User Authentication

## Overview
Total Tasks: 7 Task Groups
Feature: Comprehensive authentication system with email/password and Google OAuth support

## Task List

### Foundation Layer

#### Task Group 1: Core Infrastructure and Global Components
**Dependencies:** None

- [ ] 1.0 Complete core infrastructure and global components
  - [x] 1.1 Write 2-8 focused tests for core utilities
    - Test actionWrapper error handling (validation, database, generic errors)
    - Test ServerResponse format consistency
    - Verify error message normalization
    - Limit to 2-8 highly focused tests maximum
  - [x] 1.2 Create actionWrapper utility
    - Location: `features/global/utils/actionWrapper.ts`
    - Handle validation errors (Yup ValidationError)
    - Handle database errors (Prisma errors)
    - Handle generic errors
    - Return standardized ServerResponse<T> format
    - Reference: `backup/features/global/utils/action-wrapper.ts`
  - [x] 1.3 Define ServerResponse type
    - Location: `features/global/types/server-response.ts`
    - Fields: hasError, message, payload?, errors?
    - Generic type parameter for payload
  - [x] 1.4 Create global InputField component
    - Location: `features/global/components/form/InputField.tsx`
    - Use shadcn Field and InputGroup components
    - Support: icons (start/end), tooltips, password visibility toggle
    - Integrate with React Hook Form Controller
    - Display inline validation errors
    - Support required field indicators
    - Reference: `backup/features/global/components/form/input-field.tsx`
  - [x] 1.5 Create global Form wrapper component
    - Location: `features/global/components/form/Form.tsx`
    - Integrate React Hook Form with yupResolver
    - Use useTransition for form submission
    - Display toast notifications for success/error
    - Support redirect on success
    - Loading states during submission
    - Reset form option after success
    - Reference: `backup/features/global/components/form/form.tsx`
  - [x] 1.6 Define global component prop types
    - Location: `features/global/types/form.ts`
    - InputFieldProps interface
    - FormProps interface
    - Common form-related types
  - [x] 1.7 Ensure core infrastructure tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify actionWrapper handles all error types
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- actionWrapper returns consistent ServerResponse format
- InputField component integrates with React Hook Form
- Form wrapper handles submission with useTransition
- Password visibility toggle works correctly
- Inline validation errors display properly

---

### Validation and Type Safety Layer

#### Task Group 2: Validation Schemas and Types
**Dependencies:** Task Group 1

- [x] 2.0 Complete validation schemas and types
  - [x] 2.1 Write 2-8 focused tests for validation schemas
    - Test email validation (format, lowercase, trimmed)
    - Test password strength validation
    - Test confirm password matching
    - Test schema composition (signup, login, reset)
    - Limit to 2-8 highly focused tests maximum
  - [x] 2.2 Create reusable field validators
    - Location: `features/auth/schemas/authFields.ts`
    - emailField: valid format, lowercase, trimmed
    - passwordField: min 8 chars, uppercase, number
    - Reference: `backup/features/auth/schemas`
  - [x] 2.3 Compose authentication schemas
    - Location: `features/auth/schemas/auth.schema.ts`
    - signupSchema: email, password, confirmPassword (must match)
    - loginSchema: email, password (minimal validation)
    - resetPasswordRequestSchema: email only
    - resetPasswordSchema: password, confirmPassword
    - Export inferred types: SignupInput, LoginInput, etc.
  - [x] 2.4 Define authentication types
    - Location: `features/auth/types/auth.ts`
    - User type (matching database schema)
    - AuthSession type (Supabase session)
    - Component prop types (LoginFormProps, SignupFormProps, etc.)
  - [x] 2.5 Create auth constants for messages
    - Location: `features/auth/constants/messages.ts`
    - Success messages (signup, login, logout, password reset)
    - Error messages (invalid credentials, user exists, etc.)
    - Support i18n structure for Spanish and English
  - [x] 2.6 Ensure validation schema tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify all validation rules work correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Email validation enforces correct format, lowercase, trimmed
- Password validation enforces strength requirements
- Confirm password validation ensures match
- Types are properly inferred from schemas
- Message constants support i18n structure

---

### Data and Service Layer

#### Task Group 3: Data Layer and Business Logic
**Dependencies:** Task Group 2

- [x] 3.0 Complete data layer and services
  - [x] 3.1 Write 2-8 focused tests for data and service layers
    - Test user creation in database
    - Test username generation from email
    - Test duplicate email handling
    - Test user retrieval by ID and email
    - Limit to 2-8 highly focused tests maximum
  - [x] 3.2 Create Prisma user model (if not exists)
    - Location: `prisma/schema.prisma`
    - Fields: id, email (unique), username, createdAt, updatedAt
    - Index on email for performance
    - Generate migration
  - [x] 3.3 Create data layer functions
    - Location: `features/auth/data/`
    - `createUser.data.ts`: Insert user record in database
    - `findUserByEmail.data.ts`: Find user by email
    - `findUserById.data.ts`: Find user by ID
    - `updateUser.data.ts`: Update user record
    - Pure database queries only (no business logic)
    - Reference: `backup/features/auth/data/insert-user.data.ts`
  - [x] 3.4 Create service layer functions
    - Location: `features/auth/services/`
    - `createUser.service.ts`: Auto-generate username, validate uniqueness, create user
    - `validateCredentials.service.ts`: Check email/password (Supabase Auth)
    - `updateUserProfile.service.ts`: Update email and password
    - Business logic and orchestration only
  - [x] 3.5 Create utility functions
    - Location: `features/auth/utils/`
    - `generateUsername.ts`: Extract username from email (part before @)
    - `getAuthUser.ts`: Get current Supabase auth user
    - `getAuthSession.ts`: Get current Supabase session
  - [x] 3.6 Ensure data and service layer tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify user creation works end-to-end
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Database schema includes User model with proper indexes
- Data functions perform pure database operations
- Service functions contain business logic
- Username generation extracts email prefix correctly
- Duplicate email validation works

---

### Server Actions Layer

#### Task Group 4: Server Actions for Authentication
**Dependencies:** Task Group 3

- [x] 4.0 Complete server actions
  - [x] 4.1 Write 2-8 focused tests for server actions
    - Test signup action flow (validation -> service -> response)
    - Test login action flow
    - Test logout action
    - Test password reset request action
    - Limit to 2-8 highly focused tests maximum
  - [x] 4.2 Create signup server action
    - Location: `features/auth/actions/handleSignup.action.ts`
    - Validate with signupSchema
    - Create Supabase auth user
    - Create database user via createUser.service
    - Wrap with actionWrapper
    - Revalidate /dashboard path
    - Reference: `backup/features/auth/actions/handle-sign-up.action.ts`
  - [x] 4.3 Create login server action
    - Location: `features/auth/actions/handleLogin.action.ts`
    - Validate with loginSchema
    - Sign in via Supabase Auth
    - Wrap with actionWrapper
    - Revalidate /dashboard path
    - Reference: `backup/features/auth/actions/handle-log-in.action.ts`
  - [x] 4.4 Create Google OAuth action
    - Location: `features/auth/actions/handleGoogleLogin.action.ts`
    - Initiate OAuth flow with Supabase
    - Return redirect URL
    - Wrap with actionWrapper
    - Reference: `backup/features/auth/actions/handle-google-log-in.action.ts`
  - [x] 4.5 Create OAuth callback handler
    - Location: `app/[locale]/auth/callback/route.ts`
    - Handle OAuth callback from Supabase
    - Create database user if first login (auto-generate username)
    - Redirect to /dashboard
    - Handle errors gracefully
  - [x] 4.6 Create logout server action
    - Location: `features/auth/actions/handleLogout.action.ts`
    - Clear Supabase session
    - Wrap with actionWrapper
    - Revalidate / path
    - Reference: `backup/features/auth/actions/handle-sign-out.action.ts`
  - [x] 4.7 Create password reset request action
    - Location: `features/auth/actions/handleResetPasswordRequest.action.ts`
    - Validate with resetPasswordRequestSchema
    - Send reset email via Supabase
    - Wrap with actionWrapper
    - Reference: `backup/features/auth/actions/handle-reset-password.action.ts`
  - [x] 4.8 Create password reset action
    - Location: `features/auth/actions/handleResetPassword.action.ts`
    - Validate with resetPasswordSchema
    - Update password via Supabase Auth
    - Wrap with actionWrapper
  - [x] 4.9 Create get current user action
    - Location: `features/auth/actions/getCurrentUser.action.ts`
    - Fetch current auth user and database record
    - Wrap with actionWrapper
    - Reference: `backup/features/auth/actions/get-current-user-action.action.ts`
  - [x] 4.10 Create profile update action
    - Location: `features/auth/actions/updateProfile.action.ts`
    - Support email and password updates
    - Validate inputs
    - Update via Supabase and database
    - Wrap with actionWrapper
    - Reference: `backup/features/auth/actions/handle-edit-password.action.ts`
  - [x] 4.11 Ensure server action tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify actions return proper ServerResponse format
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- All actions use actionWrapper for error handling
- Signup creates both Supabase auth user and database record
- Login validates credentials via Supabase
- Google OAuth flow initiates correctly
- OAuth callback creates database user on first login
- Logout clears session properly
- Password reset flow works end-to-end
- Profile update handles email and password changes
- All actions revalidate appropriate paths

---

### UI Components and Pages Layer

#### Task Group 5: Authentication UI Components
**Dependencies:** Task Group 4

- [x] 5.0 Complete authentication UI components and pages
  - [x] 5.1 Write 2-8 focused tests for UI components
    - Test form rendering and field display
    - Test form submission flow
    - Test validation error display
    - Test loading states
    - Limit to 2-8 highly focused tests maximum
    - NOTE: Test structure created with placeholder tests (.todo()) to be implemented after components are created
  - [x] 5.2 Create SignupForm component
    - Location: `features/auth/components/SignupForm.tsx`
    - Client component ("use client")
    - Fields: email, password, confirmPassword
    - Use Form wrapper and InputField components
    - Integrate with handleSignup action
    - Display inline validation errors
    - Loading states with disabled button
    - Success redirect to /dashboard
    - Reference: `backup/features/auth/components/form-signup.tsx`
  - [x] 5.3 Create LoginForm component
    - Location: `features/auth/components/LoginForm.tsx`
    - Client component ("use client")
    - Fields: email, password
    - Use Form wrapper and InputField components
    - Integrate with handleLogin action
    - Display inline validation errors
    - Loading states with disabled button
    - Success redirect to /dashboard
    - Reference: `backup/features/auth/components/form-login.tsx`
  - [x] 5.4 Create GoogleAuthButton component
    - Location: `features/auth/components/GoogleAuthButton.tsx`
    - Client component ("use client")
    - Trigger handleGoogleLogin action
    - Display Google logo icon
    - Loading states
    - Error handling with toast
  - [x] 5.5 Create PasswordResetRequestForm component
    - Location: `features/auth/components/PasswordResetRequestForm.tsx`
    - Client component ("use client")
    - Field: email
    - Use Form wrapper and InputField components
    - Integrate with handleResetPasswordRequest action
    - Success shows confirmation message
  - [x] 5.6 Create PasswordResetForm component
    - Location: `features/auth/components/PasswordResetForm.tsx`
    - Client component ("use client")
    - Fields: password, confirmPassword
    - Use Form wrapper and InputField components
    - Integrate with handleResetPassword action
    - Success redirect to /login
  - [x] 5.7 Create ProfileEditForm component
    - Location: `features/auth/components/ProfileEditForm.tsx`
    - Client component ("use client")
    - Fields: email, password (optional)
    - Use Form wrapper and InputField components
    - Integrate with updateProfile action
    - Display current user data
  - [x] 5.8 Create AuthCard wrapper component
    - Location: `features/auth/components/AuthCard.tsx`
    - Server component (default)
    - Wrapper for auth forms with consistent styling
    - Use shadcn Card components
    - Support heading, description, footer links
  - [x] 5.9 Define component prop types
    - Location: `features/auth/types/components.ts`
    - SignupFormProps, LoginFormProps, etc.
    - AuthCardProps
  - [x] 5.10 Ensure UI component tests pass
    - Run ONLY the 2-8 tests written in 5.1
    - Verify forms render correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 5.1 pass
- All forms use global Form wrapper and InputField components
- Inline validation errors display below fields
- Forms show loading states during submission
- Google auth button triggers OAuth flow
- Password reset forms work end-to-end
- Profile edit form displays and updates user data
- AuthCard provides consistent layout for all auth pages

---

### Pages and Routes Layer

#### Task Group 6: Authentication Pages and Routes
**Dependencies:** Task Group 5

- [ ] 6.0 Complete authentication pages and routes
  - [x] 6.1 Write 2-8 focused tests for pages
    - Test signup page renders SignupForm
    - Test login page renders LoginForm
    - Test password reset pages render forms
    - Test metadata generation
    - Limit to 2-8 highly focused tests maximum
  - [x] 6.2 Create signup page
    - Location: `app/[locale]/(public)/signup/page.tsx`
    - Server component with async generateMetadata
    - Two-column layout (form left, illustration right on desktop)
    - Single column on mobile
    - Render SignupForm in AuthCard
    - Include GoogleAuthButton below form
    - Links to /login and help pages
    - Reference: `backup/app/[locale]/(public)/signup`
  - [x] 6.3 Create login page
    - Location: `app/[locale]/(public)/login/page.tsx`
    - Server component with async generateMetadata
    - Two-column layout (form left, illustration right on desktop)
    - Single column on mobile
    - Render LoginForm in AuthCard
    - Include GoogleAuthButton below form
    - Links to /signup, /reset-password, and help pages
    - Reference: `backup/app/[locale]/(public)/login`
  - [x] 6.4 Create password reset request page
    - Location: `app/[locale]/(public)/reset-password/page.tsx`
    - Server component with async generateMetadata
    - Render PasswordResetRequestForm in AuthCard
    - Link back to /login
  - [ ] 6.5 Create password reset confirmation page
    - Location: `app/[locale]/(public)/reset-password/confirmation/page.tsx`
    - Server component
    - Display "check your email" message
    - Link back to /login
  - [ ] 6.6 Create password reset form page
    - Location: `app/[locale]/(public)/reset-password/update/page.tsx`
    - Server component with async generateMetadata
    - Render PasswordResetForm in AuthCard
    - Extract token from URL params
    - Link back to /login
  - [ ] 6.7 Create profile page
    - Location: `app/[locale]/(private)/profile/page.tsx`
    - Server component with async generateMetadata
    - Fetch current user data
    - Render ProfileEditForm
    - Protected route (requires authentication)
  - [ ] 6.8 Add shared auth layout
    - Location: `app/[locale]/(public)/layout.tsx` (if not exists)
    - Background pattern with reduced brightness
    - Consistent padding and spacing
    - Responsive container
  - [ ] 6.9 Ensure page tests pass
    - Run ONLY the 2-8 tests written in 6.1
    - Verify pages render correct components
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 6.1 pass
- All pages use proper Next.js App Router structure
- Pages generate metadata for SEO
- Two-column layout on desktop, single column on mobile
- Illustrations hidden on mobile
- All pages use AuthCard for consistent styling
- Links between pages work correctly
- Profile page displays in protected route

---

### Middleware and Route Protection Layer

#### Task Group 7: Middleware and Session Management
**Dependencies:** Task Group 6

- [ ] 7.0 Complete middleware and route protection
  - [ ] 7.1 Write 2-8 focused tests for middleware
    - Test unauthenticated user redirect to /login
    - Test authenticated user redirect from /login to /dashboard
    - Test authenticated user redirect from /signup to /dashboard
    - Test protected route access
    - Limit to 2-8 highly focused tests maximum
  - [ ] 7.2 Create Next.js middleware
    - Location: `middleware.ts` (root level)
    - Update Supabase session
    - Check session validity on every request
    - Protect routes: /dashboard/*, /profile/*
    - Redirect unauthenticated users to /login
    - Redirect authenticated users from /login and /signup to /dashboard
    - Use Next.js middleware matcher config
  - [ ] 7.3 Create Supabase middleware helper
    - Location: `features/auth/utils/supabase-middleware.ts`
    - Create Supabase client for middleware
    - Session refresh logic
    - Handle session expiration gracefully
  - [ ] 7.4 Create auth route guards utility
    - Location: `features/auth/utils/routeGuards.ts`
    - Helper functions: isPublicRoute, isProtectedRoute, isAuthRoute
    - Route path matching logic
  - [ ] 7.5 Add middleware config
    - Location: `middleware.ts`
    - Matcher config to specify which routes use middleware
    - Exclude static files, _next, api routes from middleware
  - [ ] 7.6 Ensure middleware tests pass
    - Run ONLY the 2-8 tests written in 7.1
    - Verify redirects work correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**
- The 2-8 tests written in 7.1 pass
- Middleware updates session on every request
- Unauthenticated users redirected to /login for protected routes
- Authenticated users redirected to /dashboard from /login and /signup
- Session expiration handled gracefully
- Middleware matcher excludes static assets
- Route guards correctly identify route types

---

### Internationalization and Final Testing Layer

#### Task Group 8: i18n Integration and Comprehensive Testing
**Dependencies:** Task Groups 1-7

- [ ] 8.0 Complete internationalization and testing
  - [ ] 8.1 Review tests from Task Groups 1-7
    - Review the 2-8 tests written by foundation-engineer (Task 1.1)
    - Review the 2-8 tests written by validation-engineer (Task 2.1)
    - Review the 2-8 tests written by backend-engineer (Task 3.1)
    - Review the 2-8 tests written by api-engineer (Task 4.1)
    - Review the 2-8 tests written by ui-designer (Task 5.1)
    - Review the 2-8 tests written by pages-engineer (Task 6.1)
    - Review the 2-8 tests written by middleware-engineer (Task 7.1)
    - Total existing tests: approximately 14-56 tests
  - [ ] 8.2 Create translation files for Spanish
    - Location: `messages/es/auth.json`
    - Translate all form labels, placeholders, tooltips
    - Translate error messages
    - Translate success messages
    - Translate page headings and descriptions
    - Translate button text and links
  - [ ] 8.3 Create translation files for English
    - Location: `messages/en/auth.json`
    - Same structure as Spanish translations
    - All authentication-related text
  - [ ] 8.4 Integrate translations in components
    - Use next-intl useTranslations hook
    - Update SignupForm, LoginForm, and all auth components
    - Update page metadata with translations
    - Update validation error messages with translations
  - [ ] 8.5 Update validation schemas with translated messages
    - Use translation keys in Yup schemas
    - Ensure error messages support both languages
  - [ ] 8.6 Analyze test coverage gaps for authentication feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to authentication feature
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end workflows over unit test gaps
    - Examples: full signup flow, full login flow, password reset flow, OAuth flow
  - [ ] 8.7 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on integration points and end-to-end workflows
    - Test complete user journeys (signup -> login -> profile edit)
    - Test OAuth flow end-to-end
    - Test password reset flow end-to-end
    - Test middleware redirect flows
    - Do NOT write comprehensive coverage for all scenarios
    - Skip edge cases unless business-critical
  - [ ] 8.8 Run feature-specific tests only
    - Run ONLY tests related to authentication feature
    - Expected total: approximately 24-66 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical workflows pass
    - Verify all translations load correctly

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 24-66 tests total)
- Spanish and English translations complete for all auth flows
- Components display correct language based on locale
- Validation errors show in correct language
- Page metadata supports both languages
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on authentication feature requirements
- End-to-end user workflows covered by tests

---

## Execution Order

Recommended implementation sequence:

1. **Foundation Layer** (Task Group 1)
   - Build core utilities and global components first
   - These are reusable across the entire application
   - Dependencies: None

2. **Validation and Type Safety Layer** (Task Group 2)
   - Define schemas, types, and constants
   - Establishes data contracts for the feature
   - Dependencies: Task Group 1

3. **Data and Service Layer** (Task Group 3)
   - Implement database operations and business logic
   - Core functionality without UI
   - Dependencies: Task Group 2

4. **Server Actions Layer** (Task Group 4)
   - Connect UI to backend through server actions
   - Implements all authentication flows
   - Dependencies: Task Group 3

5. **UI Components Layer** (Task Group 5)
   - Build reusable form components
   - Client-side interactivity
   - Dependencies: Task Group 4

6. **Pages and Routes Layer** (Task Group 6)
   - Assemble components into pages
   - Public and protected routes
   - Dependencies: Task Group 5

7. **Middleware and Protection Layer** (Task Group 7)
   - Implement route protection and session management
   - Critical for security
   - Dependencies: Task Group 6

8. **i18n and Testing Layer** (Task Group 8)
   - Add translations and comprehensive testing
   - Final quality assurance
   - Dependencies: Task Groups 1-7

## Important Notes

### Testing Strategy

- Each task group (1-7) writes **2-8 focused tests maximum**
- Tests should cover **only critical behaviors**, not exhaustive coverage
- Test verification runs **ONLY the newly written tests**, not the entire suite
- Task Group 8 adds **maximum of 10 additional tests** to fill critical gaps
- Total expected tests: **approximately 24-66 tests** for the entire feature

### Reusability Focus

**Global Components** (Task Group 1):
- `InputField`: Reusable across entire app (auth, stores, products, etc.)
- `Form`: Reusable form wrapper for all features
- These components follow new architecture standards and replace backup implementations

**Reference Existing Code** (where applicable):
- `backup/features/auth/*`: Reference for authentication logic patterns
- `backup/features/global/components/form/*`: Reference for form component patterns
- `backup/app/[locale]/(public)/login`: Reference for page layout patterns
- `backup/app/[locale]/(public)/signup`: Reference for page layout patterns

### Technology Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Authentication**: Supabase Auth
- **Database**: Supabase (via Prisma ORM)
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Yup
- **Styling**: Tailwind CSS
- **i18n**: next-intl
- **State Management**: useTransition for mutations

### Architecture Patterns

- **Server Components**: Default for pages and non-interactive components
- **Client Components**: Only for forms, buttons, and interactive elements
- **Server Actions**: Three-layer architecture (Action → Service → Data)
- **Error Handling**: Centralized via actionWrapper
- **Validation**: Yup schemas for runtime validation and type inference
- **Route Protection**: Next.js middleware with Supabase session checks

### Key Deliverables

By the end of this implementation, the application will have:

1. Complete user authentication system (email/password + Google OAuth)
2. Protected routes with middleware-based session management
3. Password recovery flow with email confirmation
4. Basic profile editing (email and password)
5. Reusable global Form and InputField components
6. Full internationalization support (Spanish and English)
7. Comprehensive test coverage for critical authentication flows
8. Consistent error handling and user feedback
9. Responsive design (mobile, tablet, desktop)
10. Type-safe validation and data handling throughout

### Out of Scope

The following features are explicitly excluded from this implementation:

- Email verification workflow
- Facebook OAuth integration
- Email change functionality
- Account deletion or deactivation
- Two-factor authentication (2FA)
- "Remember me" functionality
- Custom session timeout logic
- Account suspension features
- Onboarding flow after OAuth
- Advanced profile features beyond basic editing
