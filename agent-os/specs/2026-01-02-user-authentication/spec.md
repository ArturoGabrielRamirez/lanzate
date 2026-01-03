# Specification: User Authentication

## Goal
Implement a comprehensive authentication system using Supabase Auth that supports email/password and Google OAuth authentication, with protected routes, session management, password recovery, and basic profile editing capabilities.

## User Stories
- As a user, I want to sign up with my email and password so that I can create an account and access the platform
- As a user, I want to log in with Google OAuth so that I can access the platform without creating a new password
- As a user, I want to reset my password if I forget it so that I can regain access to my account

## Specific Requirements

**User Registration (Email/Password)**
- Collect only email and password during registration
- Auto-generate username from email prefix (part before @)
- Validate email format and password strength using Yup schemas
- Create Supabase auth user first, then database user record via server action
- Redirect to /dashboard after successful registration
- Display inline validation errors using shadcn Field and Input Group components
- No email verification required
- Support Spanish and English translations

**Login System**
- Support email/password login via Supabase Auth
- Support Google OAuth login (no Facebook)
- Redirect authenticated users from /login and /signup to /dashboard automatically
- Redirect to /dashboard after successful authentication
- Use Supabase default session management (no custom timeout)
- Display inline validation errors for invalid credentials
- Validate inputs with Yup schemas before submission

**Google OAuth Flow**
- Implement Google OAuth using Supabase Auth provider
- Handle OAuth callback at /auth/callback route
- Create database user record automatically after first OAuth login
- Auto-generate username from Google email
- Redirect to /dashboard after successful OAuth
- Handle OAuth errors gracefully with user-friendly messages

**Password Recovery**
- Password reset request form with email input
- Validate email exists before sending reset link
- Display "check your email" confirmation page after request
- Password reset form accessible via email link
- Validate new password strength
- Update password via Supabase Auth
- Redirect to login page after successful password reset

**Logout Functionality**
- Clear Supabase session on logout
- Redirect to landing page (/) after logout
- Handle logout errors gracefully
- Available from protected routes

**Route Protection**
- Implement middleware to protect authenticated-only routes
- Redirect unauthenticated users to /login
- Redirect authenticated users from /login and /signup to /dashboard
- Check session validity on protected route access
- Use Next.js middleware for route protection

**Profile Management**
- Basic profile viewing capability
- Profile editing for email and password
- No email change or account deletion features
- Use server actions for profile updates
- Revalidate cache after profile updates

**Global Input Field Component**
- Create reusable InputField component based on shadcn Field and Input Group
- Support icons (start/end), tooltips, validation errors
- Password visibility toggle for password fields
- Integrate with React Hook Form
- Support all standard HTML input types
- Display inline validation errors below field
- Support required field indicators
- Configurable placeholder, label, description

**Form Component**
- Reusable Form wrapper using React Hook Form
- Integrate with Yup validation schemas via yupResolver
- Use useTransition pattern for form submission
- Display toast notifications for success/error
- Support redirect on success
- Loading states during submission
- Reset form option after success

**Validation Schemas**
- Create reusable field validators (emailField, passwordField)
- Compose schemas for different use cases (signup, login, password reset)
- Email validation: valid format, lowercase, trimmed
- Password validation: minimum 8 characters, uppercase letter, number
- Signup schema: email, password, confirm password match
- Login schema: email and password (minimal validation)
- Password reset schema: email validation only

**Internationalization**
- Support Spanish and English using next-intl
- Translate all form labels, placeholders, tooltips
- Translate error messages and success messages
- Translate page headings and descriptions
- Store translations in JSON files per feature

**Error Handling**
- Use actionWrapper for all server actions
- Return standardized ServerResponse<T> format
- Display validation errors inline below fields
- Show generic errors in toast notifications
- Log authentication errors for debugging
- Handle Supabase API errors gracefully

**Session Management**
- Use Supabase session management
- Update session in middleware
- Check session validity on protected routes
- Handle session expiration gracefully
- No custom timeout implementation

## Visual Design

No visual assets provided. Follow existing design patterns from landing page and dashboard.

**Authentication Pages Layout**
- Two-column layout on desktop (form left, illustration right)
- Single column on mobile
- Background pattern with reduced brightness
- Form in card-like container
- Social login buttons below form
- Links to related pages (signup/login, password reset, help)

**Form Design**
- Use shadcn Card components for containers
- InputField components with icons
- Clear labels with required indicators
- Inline validation errors in red text
- Primary button for form submission
- Loading states with disabled buttons and loading text

**Responsive Behavior**
- Stack form vertically on mobile
- Hide illustrations on mobile
- Full-width buttons on mobile
- Adequate spacing and padding
- Touch-friendly input sizes

## Existing Code to Leverage

**backup/features/auth Components**
- Reference form-login.tsx and form-signup.tsx for form structure patterns
- Adapt schemas from backup/features/auth/schemas to new architecture
- Reference handle-sign-up.action.ts and handle-log-in.action.ts for business logic flow
- Use backup/features/auth/data functions as reference for Supabase integration patterns
- Adapt backup/features/auth/components structure to new component standards

**backup/features/global/components/form**
- Reference input-field.tsx for InputField implementation with Field and InputGroup
- Adapt form.tsx wrapper pattern to new architecture
- Use React Hook Form integration patterns
- Reference password visibility toggle implementation
- Adapt tooltip and icon integration patterns

**backup/app/[locale]/(public)/login and signup pages**
- Reference page layout structure and two-column design
- Use metadata generation pattern
- Reference error display handling via search params
- Adapt social login button positioning

**Supabase Integration Patterns**
- Reference backup/features/auth/data/get-sign-up-permission.data.ts for signup flow
- Use backup/features/auth/data/insert-user.data.ts for database user creation pattern
- Reference backup/features/auth/data/get-current-user.data.ts for session checking
- Adapt backup/features/auth/data/get-google-data.data.ts for OAuth implementation

**Action Wrapper Pattern**
- Use backup/features/global/utils/action-wrapper.ts as reference
- Implement consistent error handling across all actions
- Return ServerResponse<T> format for all actions
- Wrap all server actions with actionWrapper

## Out of Scope
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
