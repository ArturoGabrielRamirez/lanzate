# Product Roadmap

0. [x] Project Setup & Configuration — Initialize Next.js project with TypeScript, install all dependencies (Tailwind, shadcn/ui, framer-motion, etc.), configure Supabase client and environment variables, set up Prisma with database schema, configure next-intl for internationalization, and verify all integrations are working. `M`

1. [x] User Authentication & Authorization — Complete user registration, login, password reset flows with Supabase auth. Include email verification and basic profile management. `M`

2. [ ] Store Creation & Management — Enable merchants to create their first store with basic information (name, description, subdomain). Implement subdomain routing and store ownership assignment. `L`

3. [ ] Subscription Billing & Payment History — Implement MercadoPago webhook integration to automatically track subscription payment transactions. Build payment history dashboard where users can view all subscription charges with status (successful, failed, pending, refunded), download invoices/receipts in PDF format, and track account plan changes (upgrades/downgrades between FREE, PRO, ENTERPRISE). Include webhook endpoint to receive MercadoPago IPN notifications and synchronize payment status. Generate simple invoices with basic billing information, designed with extensible data structure to support future integration with fiscal electronic invoicing systems (AFIP for Argentina, potentially other Latin American countries). `M`

4. [ ] Product Catalog Foundation — Build product creation with variants, pricing, inventory tracking, and image uploads. Include basic product listing and search functionality. `L`

5. [ ] Shopping Cart & Checkout — Implement customer-facing cart functionality, checkout flow with shipping/billing forms, and order creation. Integrate MercadoPago for payment processing. `L`

6. [ ] Order Management Dashboard — Create merchant dashboard to view, filter, and manage orders. Include order status updates, customer information display, and basic order timeline. `M`

7. [ ] Multi-Branch Support — Add branch creation and management, assign inventory to specific branches, enable branch-specific order processing and routing. `M`

8. [ ] Employee Management & Permissions — Implement employee invitation system, role-based access control, and permission management for different store functions. `M`

9. [ ] Mobile POS with Camera Scanning — Build mobile-optimized POS interface for walk-in sales with camera-based barcode/QR code scanning. Include offline capability and order synchronization. `L`

10. [ ] Store Customization & Branding — Enable merchants to customize store appearance with colors, logos, banners, and layout preferences. Implement theme system for public storefronts. `M`

11. [ ] Customer Order Tracking — Create customer-facing order status page with tracking timeline, shipping updates, and order history. Add order chat for customer-merchant communication. `M`

12. [ ] Analytics & Reporting — Build analytics dashboard with sales trends, top products, category performance, and branch comparisons. Include date range filtering and export functionality. `L`

13. [ ] Category Management — Implement dynamic product categories, category filtering for customers, and category-based analytics. `S`

14. [ ] Inventory Management System — Add stock level tracking, low-stock alerts, inventory adjustments, and multi-branch inventory synchronization. `M`

15. [ ] Customer Profiles & History — Create customer management system with purchase history, order tracking, and saved addresses. Enable merchants to view customer analytics. `M`

16. [ ] Media Library & Management — Build centralized media management system for product images, store assets, and user uploads with organization and search capabilities. `S`

17. [ ] Internationalization (i18n) — Implement multi-language support using next-intl for Spanish and English. Include language switcher and localized content management. `M`

18. [ ] Activity Feed & Audit Log — Create activity tracking system to log all store actions (orders, inventory changes, employee actions) with filterable timeline view. `S`

19. [ ] Advanced Search & Filtering — Implement global search across products, orders, and customers with filters, sorting, and URL state management using nuqs. `M`

20. [ ] Email Notifications — Set up transactional email system for order confirmations, status updates, password resets, and employee invitations. `S`

21. [ ] Performance Optimization & SEO — Optimize image loading, implement ISR for product pages, add meta tags and structured data for public storefronts. `M`

> Notes
> - Order items by technical dependencies and product architecture
> - Each item represents an end-to-end (frontend + backend) functional and testable feature
> - Setup phase (0) establishes development environment and core infrastructure
> - Foundation features (1-6) establish core e-commerce functionality
> - Growth features (7-12) enable multi-location and advanced operations
> - Enhancement features (13-21) add polish and scalability
