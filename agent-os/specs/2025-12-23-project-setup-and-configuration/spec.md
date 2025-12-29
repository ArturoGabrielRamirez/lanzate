# Specification: Project Setup & Configuration

## Goal
Establish a fresh Next.js 15+ foundation for the Lanzate e-commerce SaaS platform with TypeScript, Tailwind CSS v4, shadcn/ui, internationalization (Spanish/English), Supabase authentication, Prisma ORM, and all core dependencies configured for development using bun runtime with Turbopack.

## User Stories
- As a developer, I want a clean Next.js project initialized with all necessary dependencies so that I can start building features immediately
- As a developer, I want verification pages demonstrating all integrations (Supabase, Prisma, next-intl, shadcn/ui, framer-motion) so that I can confirm everything is working correctly before building features

## Specific Requirements

**Fresh Next.js Project Initialization**
- Use `bunx create-next-app@latest` with TypeScript, App Router, Tailwind CSS v4, ESLint, and Turbopack enabled
- Configure bun as runtime (not just package manager) with scripts: `bun run dev --turbopack`, `bun run build`, `bun run start`
- Set up path aliases (@/* for root imports) in tsconfig.json
- Use latest stable versions of all dependencies
- Leave existing backup folder untouched at E:/personal-dev/lanzate/backup/

**Core Dependency Installation**
- UI/Animation: framer-motion, lucide-react, sonner for toasts, @radix-ui/* packages via shadcn/ui
- Forms: react-hook-form, yup, @hookform/resolvers
- Data: @supabase/ssr, @supabase/supabase-js, @prisma/client, prisma, @tanstack/react-query
- Routing/State: next-intl, nuqs
- Utilities: clsx, tailwind-merge, @prisma/nextjs-monorepo-workaround-plugin
- Initialize shadcn/ui with New York style using components.json configuration

**Supabase Client Configuration**
- Create server-side client at lib/supabase/server.ts using @supabase/ssr with cookie handling for Server Components
- Create browser client at lib/supabase/client.ts using @supabase/ssr for Client Components
- Set up middleware for auth session refresh and cookie management
- Create .env file with placeholders: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (with descriptive comments)
- Create .env.example template with same variables and explanatory comments

**Prisma Database Setup**
- Initialize Prisma with PostgreSQL datasource pointing to env("PRISMA_DATABASE_URL") for pooled connection
- Configure directUrl pointing to env("PRISMA_DIRECT_URL") for migrations
- Create minimal schema with User model (id, supabaseId unique, email unique, createdAt, updatedAt) and Store model (id, name, slug unique, ownerId, createdAt, updatedAt)
- Add User-Store relation (User has many Stores, Store belongs to User via ownerId)
- Add Prisma client singleton at lib/prisma.ts preventing multiple instances in development
- Include generator with previewFeatures for fullTextSearchPostgres and binaryTargets for deployment

**Internationalization (next-intl)**
- Configure URL path-based routing for locales /es/* and /en/* with Spanish as default
- Create i18n/routing.ts with defineRouting configuration (locales: ['es', 'en'], defaultLocale: 'es')
- Set up middleware integrating next-intl with Supabase auth middleware
- Create folder structure: app/[locale]/(public) for unauthenticated routes and app/[locale]/(private) for authenticated routes
- Create translation files messages/es.json and messages/en.json with basic keys for verification pages (welcome, login, dashboard, etc.)
- Configure next.config.ts with createNextIntlPlugin wrapper

**Feature-Based Architecture**
- Create minimal folder structure: features/global/, features/auth/, lib/
- In features/global/: create utils/, components/, hooks/, types/ subdirectories
- Create example action-wrapper.ts utility for consistent Server Action error handling
- Create example ServerResponse<T> type definitions for action return types
- Create example format-response.ts utility for standardized success/error responses
- In features/auth/: create actions/, data/, types/ subdirectories as template for future features

**Configuration Files Setup**
- next.config.ts: Configure next-intl plugin, Prisma webpack plugin, server actions bodySize limit (3mb), image domains for Supabase storage, transpilePackages for yup
- tailwind.config.ts: Extend with shadcn/ui theme tokens and add primary brand color (orange/coral #FF6B4A)
- components.json: Configure shadcn/ui with New York style, TypeScript, tailwind.config.ts path, CSS variables for theming
- .gitignore: Ensure .env, .env.local, node_modules, .next, .DS_Store are ignored

**Example Template Files**
- Create features/auth/actions/example.action.ts demonstrating 'use server', actionWrapper usage, data layer call, typed response
- Create features/auth/data/example.data.ts demonstrating Prisma client usage and error handling
- Create features/global/types/action-wrapper.types.ts with ServerResponse<T>, ActionFunction<T> types
- Document naming convention: *.action.ts for Server Actions, *.data.ts for data layer, types in /types folders

**Public Landing Page (/[locale]/page.tsx)**
- Display welcome message with next-intl translations (Spanish/English)
- Include shadcn/ui Button and Card components
- Add framer-motion animation on page load (fade in)
- Implement theme toggle (light/dark) using next-themes
- Add language switcher component for ES/EN toggle
- Style with warm orange/coral accent color matching brand (#FF6B4A)
- Include link to protected dashboard page for testing auth

**Protected Dashboard Page (/[locale]/dashboard/page.tsx)**
- Check Supabase authentication status using server-side client
- Redirect to login if not authenticated
- Fetch current user data from Prisma database using supabaseId
- Display user information (email, name if available) with next-intl translations
- Query user's stores from database and display count
- Use shadcn/ui components (Card, Button) and framer-motion animations
- Include logout functionality and link back to landing page

**Environment Variables Documentation**
- .env.example must include comments explaining each variable's purpose
- Document Supabase URL/keys: where to find them in Supabase dashboard
- Document Prisma URLs: explain difference between pooled (DATABASE_URL) and direct (DIRECT_URL) connections
- Note that actual credentials should be copied from backup/.env or entered manually

## Visual Design

**`planning/visuals/landing.png`**
- Dark theme with grid background pattern as default
- Hero section with "You dream it, Lanzate makes it happen" tagline and illustration
- Orange accent colors (#FF6B4A) for CTAs and interactive elements
- Clean horizontal navigation with Home, Access, More Info links
- Language switcher (ES/EN) visible in header
- Modern sans-serif typography with clear hierarchy
- Mobile-responsive layout considerations

**`planning/visuals/general-dashboard-after-login.png`**
- Warm beige/pink background for light theme
- "Hola, [User Name]!" personalized welcome message
- Global search bar prominently placed with placeholder "Products, orders, customers..."
- Store list displayed in card-based layout with rounded corners
- Activity feed section ("Tu feed") with empty state handling
- Help section with "Contact us" functionality easily accessible
- Language switcher (ES/EN) maintained in header

**`planning/visuals/general-dashboard-mobile.png`**
- Mobile-first responsive design approach
- Touch-friendly component sizing for buttons and cards
- Bottom navigation bar for mobile app-like experience
- Metric cards in coral/orange brand color showing key stats
- Empty state designs ("Pedidos no encontrados") with helpful messaging
- Compact header with essential navigation elements

**`planning/visuals/store-dashboard.png`**
- Breadcrumb navigation pattern (Inicio > Tiendas > Store Name)
- Store logo/avatar display with rounded corners
- Balance section prominently displayed
- Three metric cards showing Products, Orders, Alerts counts
- Card-based layout for content organization
- Bottom mobile navigation with store management icons

## Existing Code to Leverage

**Supabase Client Pattern from backup/lib/server.ts and backup/lib/client.ts**
- Server client uses createServerClient with cookies().getAll() and setAll() for session management
- Client uses createBrowserClient with environment variables
- Both use NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY env vars
- Server client handles cookie operations with try-catch for Server Component context

**Action Wrapper Pattern from backup/features/global/utils/action-wrapper.ts**
- Wraps async actions with try-catch for consistent error handling
- Returns standardized ServerResponse<T> with hasError, message, payload structure
- Logs errors to console for debugging
- Uses ActionFunction<T> type for wrapped functions

**Prisma Schema Pattern from backup/prisma/schema.prisma**
- User model structure with supabase_user_id unique field for auth integration
- Store model with owner relation to User via foreign key
- Uses @map for snake_case table names while keeping camelCase in code
- DateTime fields with @default(now()) and @updatedAt decorators
- Connection pooling configuration with url and directUrl

**Middleware Pattern from backup/middleware.ts**
- Uses @rescale/nemo for middleware composition
- Chains intlMiddleware, updateSession (Supabase), and handleSubdomain in sequence
- Matcher config excludes API routes, static files, Next.js internals
- Each middleware passes response to next in chain

**next-intl Routing from backup/i18n/routing.ts**
- Uses defineRouting from next-intl with locales array ['es', 'en']
- DefaultLocale set to 'es' for Spanish
- Type export for Locale ensures type safety across app
- Integrated with Next.js middleware for automatic locale detection

## Out of Scope
- Complete authentication implementation with login/signup forms (deferred to Authentication spec)
- Full database schema with all models like Product, Order, Branch, Employee, Category (deferred to feature-specific specs)
- Docker containerization and deployment configuration
- CI/CD pipeline setup with GitHub Actions or similar
- Monitoring tools integration (Sentry, PostHog, analytics)
- Testing framework setup (Jest, Playwright, Vitest)
- PWA configuration for offline capabilities
- Email service integration (Resend/SendGrid)
- Payment gateway integration (MercadoPago)
- Barcode/QR scanning libraries setup
- Complete shadcn/ui component library installation (only install components as needed)
- Database migration strategy beyond initial schema
- SEO optimization and meta tags configuration
- Rate limiting and security headers
- Full localization coverage for all UI text (only verification page translations)
