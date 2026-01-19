# Specification: Product Catalog Foundation

## Goal
Build a complete product management system with variants, flexible pricing, multi-branch inventory tracking, digital products, image uploads, and customer-facing storefront display with post-purchase reviews and bundle support.

## User Stories
- As a merchant, I want to create products with customizable variants (size, color, etc.) so that I can sell items with different options
- As a merchant, I want to manage inventory per variant per branch so that I can track stock accurately across locations
- As a customer, I want to browse products and leave reviews after purchase so that I can share my experience with other buyers

## Specific Requirements

**Product Model Structure**
- Create Product model with: id, name, description, slug, brand, status (ACTIVE/DRAFT/ARCHIVED), is_digital flag, is_featured, is_new, is_on_sale, allow_promotions
- Include SEO fields: seo_title (max 60 chars), seo_description (max 160 chars), url_slug, og_image_url
- Store relation to Store model via store_id foreign key
- Include timestamps (createdAt, updatedAt) following Prisma standards
- Product status enum: ACTIVE, DRAFT, ARCHIVED
- Display "starting at" price calculated from lowest variant price

**Product Attributes and Variants**
- Create ProductAttribute model for custom option types (e.g., Size, Color, Material) with name and type (TEXT/NUMBER/COLOR/IMAGE)
- Create ProductAttributeValue model for values within each attribute
- Create ProductVariant model with: sku, price, promotional_price, cost, and combination of attribute values
- Enforce attribute limits per subscription tier: FREE (5), PRO (50), ENTERPRISE (unlimited)
- Check user's subscription.accountType when creating attributes and return validation error if limit exceeded

**Variant-Level Pricing**
- Price stored on ProductVariant model, not Product model
- Each variant has: price (required), promotional_price (optional), cost (optional)
- Product listing displays minimum variant price as "starting at" price
- Support promotional pricing with is_on_sale flag on Product

**Inventory Tracking**
- Create VariantInventory model with: variant_id, branch_id, quantity, low_stock_threshold
- Track stock per variant per branch (prepare for Multi-Branch Support roadmap item #7)
- Include track_inventory boolean toggle on Product for items that don't need stock tracking
- Derive inventory states: in_stock, low_stock (below threshold), out_of_stock (0)
- Store aggregate total stock at store level (computed field or denormalized)

**Digital Products**
- Create DigitalProduct model with: product_id, download_url, file_name, file_type, file_size, expiration_date, download_count, download_limit
- Only one file per digital product (single download_url)
- Secure URL handling with expiration date validation before allowing downloads
- Track download count and enforce download_limit

**Product Images**
- Create ProductImage model with: product_id, url, alt_text, position (for ordering), is_primary
- Support multiple images per product
- Reuse existing MediaSelector component from backup/features/global/components/media-selector/
- Support image reordering via position field

**Product Bundles**
- Create ProductBundle model linking multiple products together
- Create BundleItem model with: bundle_id, product_id, variant_id (optional), quantity
- Bundle has its own price (can be discount from sum of individual prices)
- Bundles can include specific variants or default product variants

**Product Reviews**
- Create ProductReview model with: product_id, order_id, order_item_id, user_id, rating (1-5), title, body, created_at
- Reviews must be tied to orders - validate that user has purchased the product via order_item before allowing review
- Only allow one review per user per order_item
- Include average_rating computed field on Product

**Merchant Dashboard - Product Listing**
- Use existing DataTable component from backup/components/data-table/
- Implement search by product name and SKU
- Filter by status (active/draft/archived)
- Sorting by name, date, price, stock
- Pagination with configurable page sizes
- Bulk selection for actions: delete, archive, change status, bulk price updates

**Merchant Dashboard - Product Creation Form**
- Use multi-step form pattern from backup/features/products/components/create-form/
- Follow Stepper component pattern from backup/features/shadcn/components/Stepper.tsx
- Steps: Basic Info > Media > Options/Variants > Type-Specific (Physical/Digital) > Configurations
- Validate each step before proceeding using Yup schemas

**Customer Storefront - Product Display**
- Create public product detail page at /products/[slug]
- Display product images gallery, description, pricing, variant selector
- Show inventory status (in stock/out of stock)
- Show reviews with average rating
- Integrate with Next.js metadata API for SEO fields
- Consider ISR (Incremental Static Regeneration) for product pages

**Customer Storefront - Product Listing**
- Public product browsing page with grid layout
- Search functionality by product name
- Filter by status (only show ACTIVE products)
- Sorting options: newest, price low-high, price high-low
- Pagination

## Visual Design
No visual assets provided - follow existing UI patterns in the codebase using shadcn/ui components.

## Existing Code to Leverage

**DataTable Component (backup/components/data-table/)**
- Full-featured table with sorting, filtering, pagination, row selection
- Supports bulk selection, column resizing, keyboard navigation
- Use for merchant product listing dashboard
- Adapt exportConfig and fetchDataFn patterns for products

**Multi-Step Form Pattern (backup/features/products/components/create-form/)**
- CreateProductForm with Stepper integration and step validation
- CreateProductProvider context for managing form state across steps
- Yup schemas for each step (productBasicInfoSchema, productMediaSchema, etc.)
- Replicate this pattern for the new product creation flow

**MediaSelector Component (backup/features/global/components/media-selector/)**
- Handles image upload with cropping, removal, and preset options
- Supports multiple upload types via UPLOAD_TYPES enum
- Reuse for product image uploads

**Auth Utilities (features/auth/utils/)**
- getAuthUser() for retrieving authenticated Supabase user
- Pattern from getStoreDetailAction shows proper auth flow with actionWrapper

**Action Wrapper Pattern (features/global/utils/action-wrapper.ts)**
- Centralized error handling for server actions
- Handles Yup validation errors, Prisma errors, and generic errors
- Use for all product-related server actions

## Out of Scope
- Product categories (Roadmap Item #13 - separate spec)
- Social features (likes, comments on products) - not in roadmap
- Multiple files per digital product - future enhancement
- Advanced SEO (schema markup, canonical URLs) - basic SEO only
- Low stock alerts UI (Roadmap Item #14 - separate spec)
- Multi-branch management UI (Roadmap Item #7 - but schema supports it)
- Product import/export functionality
- Advanced inventory management (transfers, adjustments)
- Wishlist functionality
- Product comparison feature
