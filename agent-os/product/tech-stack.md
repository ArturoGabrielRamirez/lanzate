# Tech Stack

This document outlines the complete technical stack for the Lanzate e-commerce platform. All technology choices are optimized for rapid development, scalability, and modern web standards.

## Framework & Runtime

- **Application Framework:** Next.js (App Router)
- **Language/Runtime:** TypeScript / Node.js
- **Package Manager:** npm (or bun, based on lock file present)

## Frontend

- **JavaScript Framework:** React 18+ (via Next.js)
- **CSS Framework:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** framer-motion
- **Icons:** iconify
- **Form Management:** react-hook-form
- **Validation:** yup
- **State Management:** React Context API + URL state (nuqs)

## Database & Storage

- **Database:** PostgreSQL (via Supabase)
- **ORM/Query Builder:** Prisma
- **File Storage:** Supabase Storage (for product images, store assets, user uploads)
- **Caching:** Supabase built-in caching + Next.js ISR

## Authentication & Authorization

- **Authentication:** Supabase Auth
- **Session Management:** Supabase client-side sessions
- **Authorization:** Role-based access control (RBAC) with custom permission system

## Internationalization

- **i18n Framework:** next-intl
- **Supported Languages:** Spanish, English
- **Locale Management:** URL-based locale routing

## Payment Processing

- **Payment Gateway:** MercadoPago
- **Supported Methods:** Credit/debit cards, local payment methods (Latin America)

## Development Tools

- **Linting:** ESLint
- **Code Formatting:** Prettier (assumed based on best practices)
- **TypeScript Config:** Strict mode enabled
- **Git Hooks:** (to be configured for pre-commit checks)

## Deployment & Infrastructure

- **Hosting:** Vercel (recommended for Next.js)
- **Database Hosting:** Supabase Cloud
- **CDN:** Vercel Edge Network
- **Environment Variables:** .env.local for development, Vercel environment variables for production

## Third-Party Services

- **Backend as a Service:** Supabase (auth, database, storage, real-time)
- **Payment Processing:** MercadoPago
- **Email:** Supabase email templates (or to be configured with SendGrid/Resend)
- **Monitoring:** (to be configured - Sentry recommended)
- **Analytics:** (to be configured - Vercel Analytics or PostHog recommended)

## Key Libraries & Dependencies

### Data Fetching & State
- **nuqs:** URL state management for filters, pagination, and search
- **TanStack Query (React Query):** Server state management and caching (if used)

### UI & Styling
- **clsx / tailwind-merge:** Utility for conditional CSS classes
- **lucide-react:** Icon library (part of shadcn/ui ecosystem)
- **@radix-ui/*:** Headless UI primitives (foundation for shadcn/ui)

### Forms & Validation
- **react-hook-form:** Form state management and validation
- **yup:** Schema validation for forms and API inputs
- **@hookform/resolvers:** Integrates yup with react-hook-form

### Developer Experience
- **TypeScript:** Type safety across entire codebase
- **ESLint:** Code quality and consistency
- **Prettier:** Code formatting (recommended)

## Mobile & PWA

- **Mobile Optimization:** Responsive design with Tailwind CSS breakpoints
- **Camera Access:** Browser Web APIs for barcode/QR scanning
- **Offline Capability:** Service Workers + IndexedDB for offline POS functionality (to be implemented)
- **PWA Support:** Progressive Web App features for installable mobile experience

## Architecture Patterns

- **Server Components:** Next.js App Router with React Server Components
- **API Routes:** Next.js API routes for backend endpoints
- **Server Actions:** Next.js Server Actions for mutations
- **Feature-Based Structure:** Organized by features (auth, products, orders, etc.)
- **Component Co-location:** Components, actions, and data queries grouped by feature

## Performance Optimization

- **Image Optimization:** Next.js Image component with automatic optimization
- **Code Splitting:** Automatic with Next.js App Router
- **Incremental Static Regeneration (ISR):** For public store pages
- **Edge Functions:** Middleware for subdomain routing and auth checks

## Security

- **Environment Variables:** Sensitive data in environment variables, never committed
- **HTTPS Only:** Enforced in production
- **CORS:** Configured for API routes
- **Rate Limiting:** (to be implemented for API protection)
- **Input Validation:** yup schemas on all user inputs
- **SQL Injection Prevention:** Prisma ORM with parameterized queries
