# Spec Requirements: Project Setup & Configuration

## Initial Description

Initialize Next.js project with TypeScript, install all dependencies (Tailwind, shadcn/ui, framer-motion, iconify, react-hook-form, yup, next-intl, nuqs, etc.), configure Supabase client and environment variables, set up Prisma with database schema, configure next-intl for internationalization, and verify all integrations are working.

This is the foundational setup spec (Roadmap Item 0, Priority: Must Have) that establishes the development environment and core infrastructure for the Lanzate e-commerce SaaS platform.

## Requirements Discussion

### First Round Questions

**Q1:** I assume we're starting completely fresh (initializing with `npx create-next-app@latest`) since I see the project files have been backed up. Should I proceed with a clean initialization, or do you want to preserve any specific configuration files?

**Answer:** Yes, proceed with a fresh install using **bun/bun x** commands (important: always use bun, not npm/npx). Leave the backup folder but start a new app in the root folder.

**Q2:** For the Next.js initialization, I'm planning to use TypeScript, App Router, Tailwind CSS, and ESLint by default (as specified in the tech stack). Should I enable Turbopack for development, or stick with the standard webpack configuration?

**Answer:** Yes, use Turbopack for development.

**Q3:** For shadcn/ui setup, I assume you want to initialize it with the New York style (more modern) rather than the Default style. Is that correct, or do you prefer the Default style?

**Answer:** Use New York style.

**Q4:** Regarding Supabase configuration, I'm assuming you already have a Supabase project created with credentials ready. Should I create placeholder environment variables in a `.env.example` file, or do you have the actual credentials to populate `.env.local` immediately?

**Answer:** I have a Supabase project with credentials ready (they're in the .env in the backup folder). Create an .env with dummy variable placeholders with comments, then either migrate them from backup or I'll do it manually.

**Q5:** For the Prisma schema, should I create the complete database schema based on the product requirements (users, stores, products, orders, branches, employees, categories, etc.) all at once, or start with a minimal schema (just users and stores) that can be extended in later specs?

**Answer:** Start with minimal schemas (users and stores) to extend later.

**Q6:** For next-intl configuration, I assume we need Spanish and English as the supported locales with Spanish as the default. Should the locale routing be in the URL path (e.g., `/es/dashboard`, `/en/dashboard`) or subdomain-based?

**Answer:** Use URL path routing (e.g., `/es/dashboard`, `/en/dashboard`). Spanish and English only for now.

**Q7:** I'm planning to set up the project structure following a feature-based architecture (as seen in your current standards) with folders like `features/auth`, `features/products`, etc. Should I create the basic folder structure for all anticipated features from the roadmap, or only create the minimal structure needed for this setup phase?

**Answer:** Only minimal folder structure. Other folders should be created when needed.

**Q8:** For the verification step, what level of integration testing do you want? Should I create a simple "hello world" page that demonstrates all integrations working (Supabase connection, Prisma query, next-intl translation, shadcn/ui component, framer-motion animation), or is a successful build and dev server start sufficient?

**Answer:** A "hello world" page demonstrating all integrations (Supabase, Prisma, next-intl, shadcn/ui, framer-motion) would be nice.

**Q9:** Are there any specific additional dependencies beyond the ones mentioned (Tailwind, shadcn/ui, framer-motion, iconify, react-hook-form, yup, next-intl, nuqs) that you know you'll need right away? For example: TanStack Query for data fetching, date-fns/dayjs for dates, or specific libraries for barcode scanning?

**Answer:** Check the package.json in the backup folder for reference, but only install what's needed for this stage.

**Q10:** Is there anything you explicitly want to exclude from this setup phase? For example: PWA configuration, Docker setup, testing framework setup, CI/CD pipeline, or monitoring tools?

**Answer:** Exclude Docker, CI/CD, and monitoring tools.

### Follow-up Questions

**Follow-up 1:** For the bun installation, should I configure the project to use **bun as the runtime** (with `bun run dev`, `bun run build`) or just use bun as the package manager but keep Node.js as the runtime? I ask because Next.js has specific considerations for bun runtime vs bun as a package manager.

**Answer:** Use bun as the runtime (`bun run dev`, `bun run build`).

**Follow-up 2:** Regarding the backup folder's package.json - should I examine it now to identify the **exact versions** of key dependencies (Next.js, React, Tailwind, etc.) to maintain version compatibility, or should I go with the latest stable versions of everything?

**Answer:** Go with the latest stable versions of everything.

**Follow-up 3:** For the Prisma schema, you mentioned starting with users and stores. Should the users table include fields for **Supabase auth integration** (supabaseId, email_confirmed, etc.) and basic profile fields (name, avatar, etc.), or keep it absolutely minimal (just id and supabaseId)?

**Answer:** Keep it minimal (just essential fields like id and supabaseId).

**Follow-up 4:** For the "hello world" verification page, should it be:
   - A **public page** (e.g., `/en/test` or `/es/test`) that anyone can access, or
   - A **protected page** that requires authentication (to also verify the Supabase auth flow), or
   - Both (a public landing page + a protected dashboard page)?

**Answer:** Both - a public landing page and a protected dashboard page to verify all integrations including auth flow.

**Follow-up 5:** For the feature-based folder structure, should I create the initial structure following the exact pattern from the backup (with `/features/auth`, `/features/global`, etc.) or would you prefer a slightly different organization?

**Answer:** If you think there's a better organization that can be implemented, go ahead. Otherwise, use the old pattern from the backup.

**Follow-up 6:** The backup shows extensive use of Server Actions (`.action.ts` files), data layer functions (`.data.ts` files), and type definitions. Should I create **example templates** for these patterns as part of the setup (like a starter auth action + data function), or just document the structure and leave implementation for later specs?

**Answer:** Yes, create example templates for Server Actions (`.action.ts`), data layer functions (`.data.ts`), and type definitions.

## Existing Code to Reference

**Similar Features Identified:**

The entire backup folder (`E:/personal-dev/lanzate/backup/`) contains the previous implementation of the Lanzate application with complete examples of:

- **Package.json reference**: `backup/package.json` - Contains all dependencies and scripts used in the previous version (v0.46.0)
- **Environment variables**: `backup/.env` - Contains actual Supabase credentials, Prisma database URLs, and third-party service keys
- **Prisma schema**: `backup/prisma/schema.prisma` - Complete database schema with all models (User, Store, Product, Order, etc.)
- **Next.js configuration**: Files in backup root for Next.js config patterns
- **Feature structure**: `backup/features/*` - Complete feature-based architecture examples including:
  - `features/auth/` - Authentication patterns with Server Actions, data layer, and Supabase integration
  - `features/global/` - Global utilities, components, and patterns
  - Server Actions pattern (`.action.ts` files)
  - Data layer pattern (`.data.ts` files)
  - Type definitions pattern (types in `/types` folders)

Key dependencies from backup to reference for this setup phase:
- Next.js 15.3.4 with App Router
- React 19.2.0
- Prisma 6.11.1 with @prisma/client
- Supabase (@supabase/ssr 0.6.1, @supabase/supabase-js 2.86.2)
- Tailwind CSS 4
- shadcn/ui components (via @radix-ui/*)
- framer-motion 12.23.24
- react-hook-form 7.68.0
- yup 1.6.1
- next-intl 4.3.4
- nuqs 2.4.3
- lucide-react 0.555.0 (for icons)
- @tanstack/react-query 5.90.11
- sonner 2.0.7 (for toasts)

## Visual Assets

### Files Provided:

- `general-dashboard-after-login.png`: Shows the authenticated user dashboard with a warm beige/pink color scheme, featuring "Hola, Horacio Gutierrez!" welcome message, global search bar ("Products, orders, customers..."), store list with card-based layout, activity feed ("Tu feed" showing "No activity"), and help section with "Contact us" functionality. Language switcher (ES/EN) visible in header.

- `general-dashboard-mobile.png`: Mobile version of store dashboard showing "Lo de mauri" store with balance display ($0,00), three summary cards (Productos: 10 artículos, Ordenes: 4 hoy, Alertas: 2 nuevos) in coral/orange color, orders section showing "Pedidos no encontrados", help section, and bottom navigation bar with icons.

- `landing.png`: Dark-themed landing page with grid background pattern, featuring hero section with "You dream it, Lanzate makes it happen" tagline, illustration of person working on laptop, navigation menu (Home, Access, More Info), language switcher, and orange accent colors matching the brand.

- `store-dashboard.png`: Mobile store management view showing store logo, breadcrumb navigation (Inicio > Tiendas > Lo De Mauri), balance section, three metric cards, orders list (empty state: "Pedidos no encontrados"), contact section, and bottom navigation with store management icons.

### Visual Insights:

**Design Patterns Identified:**
- **Color Scheme**: Warm orange/coral (#FF6B4A or similar) as primary brand color, beige/pink backgrounds for light theme, dark backgrounds with grid patterns for landing
- **Typography**: Clean, modern sans-serif with clear hierarchy
- **Card-based Layouts**: Extensive use of cards with rounded corners for stores, metrics, and content sections
- **Navigation**: Top horizontal nav for desktop, bottom tab bar for mobile
- **Language Support**: Visible language switcher (ES/EN toggle) in header
- **Empty States**: Thoughtful empty state designs with icons and helpful messages
- **Responsive Design**: Clear mobile-first approach with touch-friendly components

**User Flow Implications:**
- Landing page → Login/Signup → Dashboard (shows stores) → Store details
- Dashboard displays user's stores in card format
- Global search prominently placed for quick access
- Activity feed integration for real-time updates
- Help/contact easily accessible from main views

**UI Components Shown:**
- Navigation bars (horizontal + mobile bottom nav)
- Card components (store cards, metric cards)
- Search input with icon
- Button variants (primary, secondary, outlined)
- Avatar components
- Language toggle switch
- Empty state illustrations
- Breadcrumb navigation
- Tab/segmented controls

**Fidelity Level:** High-fidelity mockups - These appear to be actual screenshots from the working application (from backup), showing real UI implementation with actual styling, not wireframes.

## Requirements Summary

### Functional Requirements

**Core Setup:**
- Initialize Next.js 15+ project using `bunx create-next-app@latest` with TypeScript, App Router, Tailwind CSS v4, ESLint, and Turbopack enabled
- Configure bun as the runtime (not just package manager) with scripts: `bun run dev --turbopack`, `bun run build`, `bun run start`
- Set up project with latest stable versions of all dependencies

**Dependency Installation:**
- Install core dependencies: react-hook-form, yup, @hookform/resolvers, next-intl, nuqs
- Install UI dependencies: framer-motion, lucide-react, @radix-ui/* (as needed for shadcn/ui)
- Install data dependencies: @supabase/ssr, @supabase/supabase-js, @prisma/client, prisma
- Install utility dependencies: clsx, tailwind-merge, sonner (toasts), @tanstack/react-query
- Initialize shadcn/ui with New York style

**Supabase Configuration:**
- Create `.env` file with placeholder environment variables and descriptive comments
- Set up Supabase client utility for both server-side and client-side usage following @supabase/ssr patterns
- Configure middleware for auth state management
- Environment variables needed:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for server-side admin operations)

**Prisma Setup:**
- Initialize Prisma with PostgreSQL datasource
- Configure connection pooling and direct URL for migrations
- Create minimal schema with:
  - User model (id, supabaseId, email, createdAt, updatedAt)
  - Store model (id, name, slug, ownerId, createdAt, updatedAt)
  - Basic relations between User and Store
- Environment variables:
  - `PRISMA_DATABASE_URL` (pooled connection)
  - `PRISMA_DIRECT_URL` (direct connection for migrations)

**Internationalization (next-intl):**
- Configure URL path-based routing for locales: `/es/*` and `/en/*`
- Set Spanish (es) as default locale
- Create translation JSON files for both locales
- Set up middleware for locale detection and routing
- Create folder structure: `app/[locale]/(public)` and `app/[locale]/(private)`

**Project Structure:**
- Implement minimal feature-based architecture:
  - `/features/global/` - Global utilities, components, hooks, types
  - `/features/auth/` - Authentication-related code (for demo pages)
  - `/lib/` - Shared utilities (Supabase client, Prisma client, etc.)
  - `/app/[locale]/` - Next.js App Router pages with locale support
- Create example templates for:
  - Server Actions (`.action.ts` files)
  - Data layer functions (`.data.ts` files)
  - Type definitions (in feature `/types` folders)

**Verification Pages:**
- Create public landing page (`/[locale]/page.tsx`) demonstrating:
  - next-intl translations (Spanish/English)
  - shadcn/ui components (Button, Card)
  - framer-motion animations
  - Theme toggle (light/dark)
  - Language switcher
- Create protected dashboard page (`/[locale]/dashboard/page.tsx`) demonstrating:
  - Supabase authentication check
  - Prisma database query (fetch user data)
  - Server Component data fetching
  - All UI integrations from landing page

**Configuration Files:**
- `next.config.js` - Configure next-intl plugin, image domains for Supabase storage
- `tailwind.config.ts` - Extend with shadcn/ui theme tokens, custom colors from brand
- `tsconfig.json` - Path aliases (@/* for root imports)
- `components.json` - shadcn/ui configuration (New York style)
- `.env.example` - Template with all required environment variables and comments
- `.gitignore` - Ensure .env, node_modules, .next are ignored

### Reusability Opportunities

**Components that might exist already:**
- Authentication wrapper components in `backup/features/auth/`
- Supabase client setup patterns in `backup/lib/` or `backup/features/middleware/`
- Prisma client singleton pattern
- Theme provider components in `backup/features/layout/`
- Header/navigation components with language switcher
- Global search patterns in `backup/features/global-search/`

**Backend patterns to investigate:**
- Server Actions pattern: `backup/features/auth/actions/*.action.ts`
- Data layer pattern: `backup/features/auth/data/*.data.ts`
- Validation schemas: `backup/features/auth/schemas/*.ts`
- Type definitions organization: `backup/features/auth/types/*.ts`

**Similar features to model after:**
- Authentication flow setup from `backup/features/auth/`
- Global utilities and hooks from `backup/features/global/`
- Layout and theme management from `backup/features/layout/`
- Middleware patterns from `backup/features/middleware/`

### Scope Boundaries

**In Scope:**
- Fresh Next.js project initialization with bun runtime
- Installation of core dependencies for this setup phase only
- Supabase client configuration (not full auth implementation)
- Minimal Prisma schema (User and Store models only)
- Basic next-intl setup for Spanish and English
- Minimal feature-based folder structure
- Example template files for Server Actions, data layer, and types
- Two verification pages (public landing + protected dashboard)
- Environment variable configuration with .env.example
- Theme system setup (light/dark mode)
- Basic UI component setup via shadcn/ui

**Out of Scope:**
- Complete authentication implementation (login/signup forms, password reset, etc.) - deferred to Spec #1
- Full database schema with all models (products, orders, branches, etc.) - deferred to later specs
- Complete feature implementations (only templates and structure)
- Docker containerization
- CI/CD pipeline setup
- Monitoring and analytics tools (Sentry, PostHog, etc.)
- Testing framework setup (Jest, Playwright, etc.)
- PWA configuration and offline capabilities
- Email service integration (Resend/SendGrid setup)
- Payment gateway integration (MercadoPago)
- Barcode/QR scanning libraries
- Complete component library (only basic shadcn/ui setup)
- Production deployment configuration
- Database migrations strategy (just initial schema)
- SEO optimization and meta tags

**Future Enhancements:**
- Complete testing suite setup
- Storybook for component documentation
- Performance monitoring
- Error tracking and logging
- Database seeding scripts
- API rate limiting
- Security headers and CORS configuration
- Full localization coverage for all features
- Additional languages beyond Spanish and English

### Technical Considerations

**Integration Points:**
- Next.js 15+ with React 19+ and App Router architecture
- Bun runtime for improved performance and developer experience
- Supabase for authentication, database (PostgreSQL), and file storage
- Prisma ORM for type-safe database queries and migrations
- next-intl for locale-based routing and translations
- shadcn/ui (New York style) for UI component foundation
- Tailwind CSS v4 for styling
- framer-motion for animations and transitions

**Existing System Constraints:**
- Must use bun runtime (not npm or yarn)
- Must use Turbopack for development
- Must use URL path-based locale routing (not subdomain or cookie-based)
- Must follow Server Components first approach (default to server, only use client when needed)
- Must use feature-based folder structure
- Must separate concerns with Server Actions (.action.ts), data layer (.data.ts), and types
- Must use shadcn/ui components instead of creating custom UI components
- Props interfaces must be defined in /types directories, not component files

**Technology Preferences:**
- React Server Components as default (minimize client-side JavaScript)
- useTransition pattern for mutations in Client Components
- Direct async/await data fetching in Server Components (no useEffect for data)
- Prisma for all database interactions (no raw SQL unless necessary)
- Supabase SSR package for proper server-side auth handling
- lucide-react for icons (part of shadcn/ui ecosystem)
- sonner for toast notifications
- TanStack Query for client-side data fetching when needed
- yup for validation schemas (not zod, despite it being in backup dependencies)

**Similar Code Patterns to Follow:**
- Server Actions pattern from `backup/features/auth/actions/`
- Data access layer from `backup/features/auth/data/`
- Type definitions from `backup/features/auth/types/`
- Component organization from `backup/features/` structure
- Supabase client setup patterns
- Middleware for auth and locale handling
- Environment variable management from backup/.env

**Brand/Design Constraints:**
- Primary brand color: Warm orange/coral (#FF6B4A or similar)
- Light theme: Beige/pink warm backgrounds
- Dark theme: Dark backgrounds with grid patterns
- Modern, clean sans-serif typography
- Card-based layouts with rounded corners
- Mobile-first responsive design approach
- Touch-friendly component sizing
