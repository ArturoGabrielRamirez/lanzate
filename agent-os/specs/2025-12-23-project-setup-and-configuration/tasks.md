# Task Breakdown: Project Setup & Configuration

## Overview
Total Task Groups: 6
Total Tasks: ~45 sub-tasks
Estimated Effort: Medium (Foundation for entire application)

## Task List

### Infrastructure & Project Initialization

#### Task Group 1: Next.js Project Setup
**Dependencies:** None
**Assigned To:** Infrastructure Engineer

- [x] 1.0 Initialize Next.js project with bun runtime
  - [x] 1.1 Verify backup folder exists at E:/personal-dev/lanzate/backup/
  - [x] 1.2 Run `bunx create-next-app@latest` in project root (SKIPPED - Next.js already installed)
    - Select TypeScript: Yes
    - Select App Router: Yes
    - Select Tailwind CSS: Yes
    - Select ESLint: Yes
    - Enable Turbopack: Yes
    - Customize import alias: @/* (default)
  - [x] 1.3 Update package.json scripts for bun runtime
    - dev: `bun run dev --turbopack`
    - build: `bun run build`
    - start: `bun run start`
    - lint: `bun run lint`
  - [x] 1.4 Configure tsconfig.json with path aliases
    - Verify @/* points to root directory
    - Enable strict mode
    - Configure target: ES2022
  - [x] 1.5 Verify project builds and dev server starts
    - Run `bun run dev --turbopack`
    - Confirm server starts on localhost:3000
    - Verify hot reload works with simple edit

**Acceptance Criteria:**
- ✓ Fresh Next.js 15+ project initialized with TypeScript and App Router
- ✓ Dev server runs with Turbopack using bun runtime
- ✓ ESLint configured and running
- ✓ Path aliases working (@/*)
- ✓ No errors in console or terminal

---

#### Task Group 2: Core Dependencies Installation
**Dependencies:** Task Group 1
**Assigned To:** Infrastructure Engineer

- [x] 2.0 Install and configure core dependencies
  - [x] 2.1 Install UI/Animation dependencies
    - `bun add framer-motion lucide-react sonner`
    - Verify framer-motion works with React 19
  - [x] 2.2 Install form dependencies
    - `bun add react-hook-form yup @hookform/resolvers`
  - [x] 2.3 Install data dependencies
    - `bun add @supabase/ssr @supabase/supabase-js @prisma/client @tanstack/react-query`
    - `bun add -D prisma`
  - [x] 2.4 Install routing/state dependencies
    - `bun add next-intl nuqs`
  - [x] 2.5 Install utility dependencies
    - `bun add clsx tailwind-merge @prisma/nextjs-monorepo-workaround-plugin`
  - [x] 2.6 Initialize shadcn/ui with New York style
    - Run `bunx shadcn@latest init`
    - Select New York style
    - Select CSS variables for colors
    - Configure components.json with proper paths
  - [x] 2.7 Install essential shadcn/ui components
    - `bunx shadcn@latest add button card`
    - Verify components generate in components/ui/
  - [x] 2.8 Verify all dependencies installed correctly
    - Check package.json for version conflicts
    - Run `bun install` to ensure lockfile is up to date
    - Test that project still builds

**Acceptance Criteria:**
- All dependencies installed without version conflicts
- shadcn/ui initialized with New York style
- Button and Card components available in components/ui/
- components.json exists with correct configuration
- Project builds successfully with all new dependencies

---

### Configuration Layer

#### Task Group 3: Environment & Configuration Files
**Dependencies:** Task Group 2
**Assigned To:** Backend Engineer

- [x] 3.0 Configure environment variables and project settings
  - [x] 3.1 Create .env file with placeholder variables
    - NEXT_PUBLIC_SUPABASE_URL (with comment: "Found in Supabase Dashboard > Settings > API")
    - NEXT_PUBLIC_SUPABASE_ANON_KEY (with comment: "Public anon/publishable key from Supabase Dashboard")
    - SUPABASE_SERVICE_ROLE_KEY (with comment: "Secret service role key - never expose to client")
    - PRISMA_DATABASE_URL (with comment: "Pooled database connection URL from Supabase")
    - PRISMA_DIRECT_URL (with comment: "Direct database connection for migrations")
  - [x] 3.2 Create .env.example template
    - Copy structure from .env with placeholder values
    - Add detailed comments explaining where to find each value
    - Include note to copy from backup/.env or get from Supabase dashboard
  - [x] 3.3 Update .gitignore
    - Ensure .env and .env.local are ignored
    - Verify node_modules, .next, .DS_Store are ignored
    - Add .env.*.local patterns
  - [x] 3.4 Configure next.config.ts
    - Wrap config with createNextIntlPlugin (to be added in Task Group 5)
    - Add Prisma webpack plugin: `@prisma/nextjs-monorepo-workaround-plugin`
    - Configure serverActions bodySize limit: 3mb
    - Add image domains for Supabase storage: `[process.env.NEXT_PUBLIC_SUPABASE_URL]`
    - Add transpilePackages: ['yup']
  - [x] 3.5 Configure tailwind @theme and globals.css
    - Extend with shadcn/ui theme tokens
    - Add custom primary brand color: orange/coral (#FF6B4A)
    - Add custom secondary colors for warm beige/pink theme
    - Configure dark mode: class strategy
  - [x] 3.6 Verify configuration files
    - Check next.config.ts syntax
    - Verify Tailwind config with test utility classes
    - Confirm .env.example has all required variables

**Acceptance Criteria:**
- .env file created with descriptive comments for all variables
- .env.example template ready for distribution
- .gitignore properly configured to exclude secrets
- next.config.ts configured with all required plugins and settings
- Tailwind's @theme extended with brand colors and shadcn/ui tokens
- No build errors related to configuration

---

### Database & Authentication Layer

#### Task Group 4: Supabase Client Configuration
**Dependencies:** Task Group 3
**Assigned To:** Backend Engineer

- [x] 4.0 Set up Supabase authentication clients
  - [x] 4.1 Create lib/supabase/server.ts
    - Import createServerClient from @supabase/ssr
    - Implement server-side client with cookie handling
    - Use cookies().getAll() and cookies().set() for session management
    - Add try-catch for Server Component context safety
    - Reference pattern from backup/lib/server.ts
  - [x] 4.2 Create lib/supabase/client.ts
    - Import createBrowserClient from @supabase/ssr
    - Implement browser client for Client Components
    - Use NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
    - Reference pattern from backup/lib/client.ts
  - [x] 4.3 Create proxy.ts for auth session refresh (Note: Next.js 16 uses proxy.ts instead of middleware.ts)
    - Create proxy.ts in project root
    - Create lib/supabase/proxy.ts with updateSession function
    - Implement Supabase session update function
    - Configure matcher to exclude API routes, static files, _next
    - Handle cookie management for auth state
    - Reference pattern from backup/middleware.ts
  - [x] 4.4 Write 2-4 focused tests for Supabase clients
    - Test server client initializes without errors
    - Test browser client initializes without errors
    - Test middleware doesn't break unauthenticated routes
    - Skip comprehensive auth flow testing (deferred to Auth spec)
  - [x] 4.5 Verify Supabase integration
    - Run ONLY the 2-4 tests written in 4.4
    - Test server client in a Server Component
    - Test browser client in a Client Component
    - Verify no TypeScript errors

**Acceptance Criteria:**
- ✓ Server-side Supabase client created with proper cookie handling
- ✓ Browser-side Supabase client created for Client Components
- ✓ Proxy configured for session refresh (using Next.js 16 proxy.ts)
- ✓ 9 tests pass confirming clients initialize correctly
- ✓ No TypeScript errors or runtime errors with Supabase clients
- ✓ Verification components created for testing Server and Client Components

---

#### Task Group 5: Prisma ORM Setup
**Dependencies:** Task Group 3
**Assigned To:** Backend Engineer

- [x] 5.0 Configure Prisma with minimal database schema
  - [x] 5.1 Initialize Prisma
    - Run `bunx prisma init`
    - Verify prisma/ folder created with schema.prisma
  - [x] 5.2 Configure datasource in schema.prisma
    - Set provider: postgresql
    - Set url: env("PRISMA_DATABASE_URL") for pooled connection
    - Set directUrl: env("PRISMA_DIRECT_URL") for migrations
  - [x] 5.3 Configure generator in schema.prisma
    - Set provider: prisma-client-js
    - Add previewFeatures: ["fullTextSearch", "fullTextIndex"]
    - Add binaryTargets for deployment compatibility
  - [x] 5.4 Create minimal User model
    - id: String @id @default(cuid())
    - supabaseId: String @unique @map("supabase_user_id")
    - email: String @unique
    - createdAt: DateTime @default(now()) @map("created_at")
    - updatedAt: DateTime @updatedAt @map("updated_at")
    - stores: Store[] (relation)
    - @@map("users")
  - [x] 5.5 Create minimal Store model
    - id: String @id @default(cuid())
    - name: String
    - slug: String @unique
    - ownerId: String @map("owner_id")
    - owner: User @relation (fields: [ownerId], references: [id])
    - createdAt: DateTime @default(now()) @map("created_at")
    - updatedAt: DateTime @updatedAt @map("updated_at")
    - @@map("stores")
  - [x] 5.6 Create Prisma client singleton at lib/prisma.ts
    - Implement singleton pattern to prevent multiple instances
    - Export prisma client instance
    - Add globalThis caching for development
    - Reference pattern from backup
  - [x] 5.7 Generate Prisma client
    - Run `bunx prisma generate`
    - Verify @prisma/client types are available
  - [x] 5.8 Write 2-4 focused tests for Prisma setup
    - Test Prisma client initializes without errors
    - Test database connection (if env vars are available)
    - Test basic User model query structure
    - Skip comprehensive CRUD testing (no database seeding yet)
  - [x] 5.9 Verify Prisma integration
    - Run ONLY the 2-4 tests written in 5.8
    - Import prisma client in a test file
    - Verify TypeScript autocomplete works for models
    - Check no TypeScript errors

**Acceptance Criteria:**
- Prisma initialized with PostgreSQL datasource
- User and Store models created with proper relations
- Prisma client singleton created at lib/prisma.ts
- 2-4 tests pass confirming Prisma setup is correct
- TypeScript autocomplete working for Prisma models
- No migration run yet (deferred until database is ready)

---

### Internationalization & Routing

#### Task Group 6: next-intl Configuration
**Dependencies:** Task Group 1, Task Group 2
**Assigned To:** Frontend Engineer

- [x] 6.0 Configure internationalization with next-intl
  - [x] 6.1 Create i18n/routing.ts
    - Import defineRouting from next-intl/routing
    - Configure locales: ['es', 'en']
    - Set defaultLocale: 'es'
    - Export Locale type for type safety
  - [x] 6.2 Create i18n/request.ts
    - Set up getRequestConfig for next-intl
    - Load translation messages dynamically based on locale
    - Configure for server-side usage
  - [x] 6.3 Update next.config.ts with next-intl plugin
    - Import createNextIntlPlugin
    - Wrap Next.js config with plugin
    - Point to i18n/request.ts
  - [x] 6.4 Create translation files
    - Create messages/es.json with Spanish translations
      - Keys: welcome, description, getStarted, login, dashboard, stores, logout, language, theme, light, dark
    - Create messages/en.json with English translations
      - Same keys with English values
  - [x] 6.5 Update middleware for next-intl integration
    - Import createMiddleware from next-intl/middleware
    - Configure locale detection
    - Chain with Supabase middleware from Task Group 4
    - Set up matcher to handle locale routes
  - [x] 6.6 Create locale-based folder structure
    - Create app/[locale]/ directory
    - Create app/[locale]/(public)/ for unauthenticated routes
    - Create app/[locale]/(private)/ for authenticated routes
    - Move default page.tsx content to app/[locale]/(public)/page.tsx
  - [x] 6.7 Create app/[locale]/layout.tsx
    - Set up root layout with locale parameter
    - Configure lang attribute dynamically
    - Import and use translation messages
  - [x] 6.8 Verify next-intl integration
    - Navigate to /es and /en routes
    - Confirm locale detection works
    - Check translations load correctly
    - Verify middleware redirects properly

**Acceptance Criteria:**
- next-intl configured with Spanish and English locales
- Proxy handles locale routing correctly (Note: using proxy.ts in Next.js 16)
- Translation files created for both languages
- Middleware handles locale routing correctly
- Folder structure created: app/[locale]/(public) and app/[locale]/(private)
- Default route redirects to /es (Spanish default)
- Both /es and /en routes accessible and display correct translations

---

### Feature Architecture & Templates

#### Task Group 7: Project Structure & Example Templates
**Dependencies:** Task Group 5 (Prisma), Task Group 4 (Supabase)
**Assigned To:** Backend Engineer

- [x] 7.0 Create feature-based architecture and example templates
  - [x] 7.1 Create minimal folder structure
    - Create features/global/utils/ directory
    - Create features/global/components/ directory
    - Create features/global/hooks/ directory
    - Create features/global/types/ directory
    - Create features/auth/actions/ directory
    - Create features/auth/data/ directory
    - Create features/auth/types/ directory
  - [x] 7.2 Create features/global/types/action-wrapper.types.ts
    - Define ServerResponse<T> type with hasError, message, payload
    - Define ActionFunction<T> type for Server Actions
    - Export types for reuse across features
  - [x] 7.3 Create features/global/utils/action-wrapper.ts
    - Implement actionWrapper utility for error handling
    - Accept ActionFunction<T> and return wrapped function
    - Use try-catch with standardized error response
    - Log errors to console for debugging
    - Reference pattern from backup/features/global/utils/action-wrapper.ts
  - [x] 7.4 Create features/global/utils/format-response.ts
    - Implement formatSuccess<T> function returning ServerResponse<T>
    - Implement formatError function returning ServerResponse with error
    - Export utilities for consistent response formatting
  - [x] 7.5 Create features/auth/actions/example.action.ts
    - Add 'use server' directive
    - Import actionWrapper and format-response utilities
    - Create example Server Action that fetches user data
    - Call data layer function from features/auth/data/
    - Return typed ServerResponse
    - Add JSDoc comments explaining pattern
  - [x] 7.6 Create features/auth/data/example.data.ts
    - Import prisma client from lib/prisma
    - Create example data layer function that queries User model
    - Implement error handling with try-catch
    - Return data or throw error
    - Add JSDoc comments explaining data layer pattern
  - [x] 7.7 Create features/auth/types/types.ts
    - Define example UserData type
    - Define example AuthResponse type
    - Export types for use in actions and components
  - [x] 7.8 Write 2-4 focused tests for example templates
    - Test action-wrapper handles success case
    - Test action-wrapper handles error case
    - Test format-response utilities return correct structure
    - Skip testing actual database queries (no seeding yet)
  - [x] 7.9 Verify template patterns
    - Run ONLY the 2-4 tests written in 7.8
    - Import and use example action in a test file
    - Verify TypeScript types are working
    - Check no linting errors

**Acceptance Criteria:**
- Feature-based folder structure created (features/global/, features/auth/)
- action-wrapper.ts utility created for consistent error handling
- format-response.ts utility created for standardized responses
- Example Server Action created demonstrating pattern
- Example data layer function created demonstrating Prisma usage
- Type definitions created and exported
- 2-4 tests pass confirming utilities work correctly
- JSDoc comments added to example files for documentation

---

### Frontend Components & Verification Pages

#### Task Group 8: Theme & Layout Setup
**Dependencies:** Task Group 6 (next-intl), Task Group 2 (shadcn/ui)
**Assigned To:** UI Designer

- [x] 8.0 Set up theme system and layout components
  - [x] 8.1 Install next-themes
    - `bun add next-themes`
  - [x] 8.2 Create features/layout/components/theme-provider.tsx
    - Wrap next-themes ThemeProvider
    - Configure attribute: 'class'
    - Set defaultTheme: 'dark' (matching landing.png)
    - Enable system theme detection
  - [x] 8.3 Update app/[locale]/layout.tsx
    - Wrap children with ThemeProvider
    - Add suppressHydrationWarning to html tag
    - Configure metadata with app name and description
  - [x] 8.4 Create features/layout/components/theme-toggle.tsx
    - Use shadcn/ui Button component
    - Use lucide-react icons (Sun, Moon)
    - Implement theme switching logic with next-themes
    - Add framer-motion animations for icon transitions
  - [x] 8.5 Create features/layout/components/language-switcher.tsx
    - Create toggle between ES/EN
    - Use useRouter and usePathname from next/navigation
    - Implement locale switching with next-intl
    - Style with shadcn/ui components
  - [x] 8.6 Install additional shadcn/ui components
    - `bunx shadcn@latest add dropdown-menu`
    - Install any other components needed for layout
  - [x] 8.7 Write 2-4 focused tests for theme components
    - Test ThemeProvider renders children
    - Test theme toggle changes theme
    - Test language switcher changes locale
    - Skip comprehensive interaction testing
  - [x] 8.8 Verify theme system
    - Run ONLY the 2-4 tests written in 8.7
    - Toggle theme and verify class changes on html element
    - Switch language and verify URL changes
    - Test components render without errors

**Acceptance Criteria:**
- next-themes installed and configured
- ThemeProvider wrapping app with dark mode as default
- Theme toggle component working with animations
- Language switcher component working between ES/EN
- 2-4 tests pass confirming theme system works
- No hydration errors or console warnings

---

#### Task Group 9: Public Landing Page
**Dependencies:** Task Group 8 (Theme), Task Group 6 (next-intl)
**Assigned To:** UI Designer

- [x] 9.0 Create public landing page demonstrating all integrations
  - [x] 9.1 Create app/[locale]/(public)/page.tsx
    - Make it a Server Component
    - Use useTranslations from next-intl
    - Fetch translations for landing page
  - [x] 9.2 Install additional shadcn/ui components
    - `bunx shadcn@latest add separator`
    - Install any other components needed for landing
  - [x] 9.3 Build hero section
    - Add welcome message with translation key 'welcome'
    - Add description with translation key 'description'
    - Use framer-motion for fade-in animation
    - Style with Tailwind CSS using warm orange brand color (#FF6B4A)
    - Match dark theme grid background from landing.png
  - [x] 9.4 Add interactive elements
    - Import ThemeToggle component
    - Import LanguageSwitcher component
    - Add Button component linking to /dashboard
    - Use lucide-react icons where appropriate
  - [x] 9.5 Create features/landing/components/hero-section.tsx (Client Component)
    - Extract hero content to separate component
    - Add 'use client' directive
    - Implement framer-motion animations (fade in, slide up)
    - Use Card component from shadcn/ui
  - [x] 9.6 Style landing page to match visuals
    - Apply dark background with grid pattern
    - Use orange accent color (#FF6B4A) for CTAs
    - Implement responsive design (mobile, tablet, desktop)
    - Add proper spacing and typography hierarchy
  - [x] 9.7 Write 2-4 focused tests for landing page
    - Test landing page renders without errors
    - Test translations load for both ES and EN
    - Test framer-motion animations initialize
    - Skip comprehensive E2E testing
  - [x] 9.8 Verify landing page
    - Run ONLY the 2-4 tests written in 9.7
    - Visit /es and /en routes
    - Test theme toggle works
    - Test language switcher works
    - Verify animations play on page load
    - Check responsive design on different screen sizes

**Acceptance Criteria:**
- Public landing page created at app/[locale]/(public)/page.tsx
- Hero section displays translated welcome message
- Theme toggle and language switcher functional
- framer-motion animations working
- shadcn/ui components (Button, Card) integrated
- Orange brand color (#FF6B4A) applied to CTAs
- Dark theme with grid background matching landing.png
- 2-4 tests pass confirming landing page works
- Responsive design working on mobile, tablet, desktop

---

#### Task Group 10: Protected Dashboard Page
**Dependencies:** Task Group 4 (Supabase), Task Group 5 (Prisma), Task Group 9 (Landing)
**Assigned To:** Full-Stack Engineer

- [ ] 10.0 Create protected dashboard page demonstrating auth and database
  - [ ] 10.1 Create app/[locale]/(private)/dashboard/page.tsx
    - Make it a Server Component
    - Import createClient from lib/supabase/server
    - Check Supabase authentication status
    - Redirect to /login if not authenticated (use redirect from next/navigation)
  - [ ] 10.2 Fetch user data from Prisma
    - Import prisma client from lib/prisma
    - Get authenticated user's supabaseId from Supabase
    - Query User model by supabaseId
    - Query related stores count
    - Handle case where user doesn't exist in database
  - [ ] 10.3 Create features/dashboard/components/dashboard-header.tsx
    - Display personalized greeting: "Hola, [User Name]!"
    - Show user email if name not available
    - Match design from general-dashboard-after-login.png
    - Use shadcn/ui Card component
  - [ ] 10.4 Create features/dashboard/components/store-stats.tsx
    - Display stores count in Card component
    - Style with warm beige/pink background (light theme)
    - Use orange accent color for emphasis
    - Show empty state if no stores
  - [ ] 10.5 Add dashboard navigation
    - Create logout button (Client Component)
    - Link back to landing page
    - Use LanguageSwitcher and ThemeToggle components
  - [ ] 10.6 Create features/auth/actions/logout.action.ts
    - Implement Server Action for sign out
    - Use Supabase server client to sign out
    - Redirect to landing page after logout
  - [ ] 10.7 Style dashboard to match visuals
    - Apply warm beige/pink background for light theme
    - Use card-based layout matching general-dashboard-after-login.png
    - Implement responsive design
    - Add framer-motion animations for cards
  - [ ] 10.8 Write 2-4 focused tests for dashboard
    - Test dashboard redirects when not authenticated
    - Test dashboard renders when authenticated (mock Supabase)
    - Test user data fetched from Prisma (mock database)
    - Skip E2E authentication flow testing
  - [ ] 10.9 Verify dashboard page
    - Run ONLY the 2-4 tests written in 10.8
    - Test authentication redirect (should redirect to /login)
    - Verify layout matches general-dashboard-after-login.png
    - Test logout functionality
    - Check responsive design

**Acceptance Criteria:**
- Protected dashboard page created at app/[locale]/(private)/dashboard/page.tsx
- Authentication check redirects unauthenticated users
- User data fetched from Prisma database using supabaseId
- Personalized greeting displayed with user information
- Store count displayed from database query
- Logout functionality working
- Design matches general-dashboard-after-login.png
- 2-4 tests pass confirming dashboard auth and data fetching
- Responsive design working

---

### Testing & Documentation

#### Task Group 11: Final Verification & Documentation
**Dependencies:** All previous task groups
**Assigned To:** QA Engineer / Tech Lead

- [ ] 11.0 Verify complete setup and create documentation
  - [ ] 11.1 Review all tests from previous task groups
    - Verify approximately 16-24 tests exist across all groups
    - Ensure tests cover critical setup verification:
      - Project initialization (Group 1)
      - Supabase clients (Group 4)
      - Prisma setup (Group 5)
      - Action wrapper utilities (Group 7)
      - Theme system (Group 8)
      - Landing page (Group 9)
      - Dashboard page (Group 10)
  - [ ] 11.2 Run full test suite
    - Execute all tests written across task groups
    - Verify all ~16-24 tests pass
    - Fix any failing tests
    - Do NOT write additional tests unless critical gaps found
  - [ ] 11.3 Perform manual integration testing
    - Start dev server: `bun run dev --turbopack`
    - Navigate to /es route → verify landing page loads
    - Navigate to /en route → verify English translations
    - Toggle theme → verify dark/light mode switch
    - Switch language → verify locale changes
    - Click dashboard link → verify redirect to /login (not implemented yet)
    - Check browser console for errors
    - Test responsive design on mobile viewport
  - [ ] 11.4 Verify environment variable setup
    - Check .env.example exists with all required variables
    - Confirm .env file has placeholders with comments
    - Verify .gitignore excludes .env files
    - Document where to find Supabase credentials
  - [ ] 11.5 Create setup documentation
    - Create README.md in project root (if not exists)
    - Document installation steps:
      1. Clone repository
      2. Install dependencies: `bun install`
      3. Copy .env.example to .env
      4. Fill in Supabase credentials from dashboard
      5. Run migrations (when database is ready)
      6. Start dev server: `bun run dev --turbopack`
    - Document project structure and folder organization
    - Explain naming conventions (*.action.ts, *.data.ts, types/)
  - [ ] 11.6 Verify build for production
    - Run `bun run build`
    - Ensure build completes without errors
    - Check for any TypeScript errors
    - Verify bundle size is reasonable
  - [ ] 11.7 Create feature checklist summary
    - Document what's implemented:
      - Next.js 15+ with TypeScript and App Router
      - Bun runtime with Turbopack
      - Supabase client configuration
      - Prisma ORM setup
      - next-intl internationalization
      - shadcn/ui components
      - Theme system (light/dark)
      - Example templates for Server Actions and data layer
      - Public landing page
      - Protected dashboard page (auth check only)
    - Document what's NOT implemented (deferred to future specs):
      - Complete authentication (login/signup forms)
      - Full database schema
      - Testing framework setup
      - CI/CD pipeline
      - Monitoring tools
      - Email service integration

**Acceptance Criteria:**
- All ~16-24 tests from previous groups pass
- Manual testing confirms all integrations working:
  - Landing page loads with translations
  - Theme toggle works
  - Language switcher works
  - Dashboard redirects when not authenticated
  - No console errors or warnings
- Production build completes successfully
- README.md created with setup instructions
- .env.example documented with all variables
- Feature checklist documented showing what's implemented and what's deferred

---

## Execution Order

Recommended implementation sequence:

1. **Infrastructure Setup** (Task Groups 1-2)
   - Initialize Next.js project
   - Install all dependencies
   - Estimated time: 1-2 hours

2. **Configuration Layer** (Task Group 3)
   - Set up environment variables
   - Configure Next.js, Tailwind, and other config files
   - Estimated time: 1-2 hours

3. **Backend Services** (Task Groups 4-5)
   - Configure Supabase clients
   - Set up Prisma ORM
   - Estimated time: 2-3 hours

4. **Internationalization** (Task Group 6)
   - Configure next-intl
   - Set up locale routing
   - Create translation files
   - Estimated time: 1-2 hours

5. **Architecture & Templates** (Task Group 7)
   - Create feature folder structure
   - Build example templates
   - Estimated time: 2-3 hours

6. **Frontend Layer** (Task Groups 8-10)
   - Set up theme system
   - Build landing page
   - Build dashboard page
   - Estimated time: 4-6 hours

7. **Verification & Documentation** (Task Group 11)
   - Run all tests
   - Perform manual testing
   - Create documentation
   - Estimated time: 2-3 hours

**Total Estimated Time:** 13-22 hours

---

## Dependencies Graph

```
Group 1 (Next.js Init)
  ↓
Group 2 (Dependencies)
  ↓
Group 3 (Configuration)
  ├─→ Group 4 (Supabase)
  ├─→ Group 5 (Prisma)
  └─→ Group 6 (next-intl)
        ↓
Group 4 + Group 5
  ↓
Group 7 (Templates)
  ↓
Group 6 + Group 2
  ↓
Group 8 (Theme)
  ↓
Group 9 (Landing)
  ↓
Group 4 + Group 5 + Group 9
  ↓
Group 10 (Dashboard)
  ↓
All Groups
  ↓
Group 11 (Verification)
```

---

## Notes

- **Testing Philosophy**: Each task group includes 2-4 focused tests maximum to verify critical functionality. Tests should confirm setup is correct, not provide comprehensive coverage. Detailed testing will be addressed in dedicated testing specs.

- **No Database Migration Yet**: Task Group 5 sets up Prisma schema but does NOT run migrations. Migrations should be run manually once database credentials are confirmed and added to .env file.

- **Login Page Not Implemented**: The dashboard page will redirect to /login when not authenticated, but the login page itself is deferred to the Authentication spec. For now, the redirect serves as verification that auth checking works.

- **Minimal Scope**: This spec establishes foundation only. Features like complete auth flows, full database schema, product management, order processing, etc. are deferred to their respective specs.

- **Backup Folder**: Leave E:/personal-dev/lanzate/backup/ untouched. Reference it for patterns but do not move or modify files.

- **Environment Variables**: Actual Supabase credentials should be copied from backup/.env or entered manually after reviewing .env.example template.

- **Visual Design Reference**: Landing page should match landing.png (dark theme with grid), dashboard should match general-dashboard-after-login.png (warm beige/pink theme). Use visual assets as design guidance.

- **Next.js 16 Update**: This project uses Next.js 16, which renamed "middleware" to "proxy". All middleware-related tasks now use `proxy.ts` instead of `middleware.ts`.
