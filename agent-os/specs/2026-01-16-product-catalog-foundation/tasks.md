# Task Breakdown: Product Catalog Foundation

## Overview
Total Tasks: 10 Task Groups

This spec implements a complete product management system including:
- Product model with variants, attributes, and flexible pricing
- Inventory tracking per variant per branch
- Digital products with secure downloads
- Product images, bundles, and reviews
- Merchant dashboard with product listing and creation forms
- Customer storefront with product display and browsing

## Task List

### Database Layer

#### Task Group 1: Core Product Models and Migrations
**Dependencies:** None

- [x] 1.0 Complete core product database layer
  - [x] 1.1 Write 2-8 focused tests for Product and ProductAttribute models
    - Test Product model creation with required fields (name, slug, store_id)
    - Test ProductStatus enum values (ACTIVE, DRAFT, ARCHIVED)
    - Test ProductAttribute model with AttributeType enum (TEXT, NUMBER, COLOR, IMAGE)
    - Test ProductAttributeValue model association with ProductAttribute
    - Test unique slug constraint per store
  - [x] 1.2 Create Product model in Prisma schema
    - Fields: id (cuid), name, description, slug, brand, status (enum), is_digital, is_featured, is_new, is_on_sale, allow_promotions, track_inventory
    - SEO fields: seo_title (max 60 chars), seo_description (max 160 chars), url_slug, og_image_url
    - Timestamps: createdAt, updatedAt
    - Foreign key: store_id
    - Indexes on: store_id, slug, status
    - @@map("products")
  - [x] 1.3 Create ProductStatus enum
    - Values: ACTIVE, DRAFT, ARCHIVED
  - [x] 1.4 Create ProductAttribute model
    - Fields: id, name, type (AttributeType enum), product_id
    - AttributeType enum: TEXT, NUMBER, COLOR, IMAGE
    - @@map("product_attributes")
  - [x] 1.5 Create ProductAttributeValue model
    - Fields: id, value, attribute_id
    - Association: belongs_to ProductAttribute
    - @@map("product_attribute_values")
  - [x] 1.6 Set up associations
    - Product belongs_to Store
    - Product has_many ProductAttribute
    - ProductAttribute has_many ProductAttributeValue
  - [x] 1.7 Run migration for core product models
  - [x] 1.8 Ensure core product model tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify migrations run successfully

**Acceptance Criteria:**
- Product model with all specified fields exists
- ProductStatus enum works correctly
- ProductAttribute and ProductAttributeValue models created
- All associations configured properly
- Indexes added for performance
- Tests from 1.1 pass

---

#### Task Group 2: Variant and Pricing Models
**Dependencies:** Task Group 1

- [ ] 2.0 Complete variant and pricing database layer
  - [ ] 2.1 Write 2-8 focused tests for ProductVariant model
    - Test ProductVariant creation with sku, price, promotional_price, cost
    - Test variant association with attribute values
    - Test price is required, promotional_price and cost are optional
    - Test unique sku constraint
  - [x] 2.2 Create ProductVariant model in Prisma schema
    - Fields: id, sku (unique), price (Decimal), promotional_price (Decimal, optional), cost (Decimal, optional), product_id
    - Timestamps: createdAt, updatedAt
    - @@map("product_variants")
  - [x] 2.3 Create VariantAttributeValue junction model
    - Fields: variant_id, attribute_value_id
    - Many-to-many relationship between ProductVariant and ProductAttributeValue
    - @@map("variant_attribute_values")
  - [x] 2.4 Set up associations
    - ProductVariant belongs_to Product
    - ProductVariant many-to-many ProductAttributeValue
    - Product has_many ProductVariant
  - [x] 2.5 Run migration for variant models
  - [ ] 2.6 Ensure variant model tests pass
    - Run ONLY the 2-8 tests written in 2.1

**Acceptance Criteria:**
- ProductVariant model with pricing fields exists
- Variant can be associated with multiple attribute values
- Price stored at variant level, not product level
- Tests from 2.1 pass

---

#### Task Group 3: Inventory, Images, and Digital Product Models
**Dependencies:** Task Group 2

- [ ] 3.0 Complete inventory, images, and digital product database layer
  - [ ] 3.1 Write 2-8 focused tests for inventory and media models
    - Test VariantInventory creation with quantity and low_stock_threshold
    - Test inventory association with variant and branch
    - Test ProductImage ordering via position field
    - Test DigitalProduct download tracking fields
  - [x] 3.2 Create VariantInventory model
    - Fields: id, variant_id, branch_id, quantity (Int), low_stock_threshold (Int, default 10)
    - Unique constraint on [variant_id, branch_id]
    - @@map("variant_inventory")
  - [x] 3.3 Create ProductImage model
    - Fields: id, product_id, url, alt_text, position (Int), is_primary (Boolean)
    - @@map("product_images")
  - [x] 3.4 Create DigitalProduct model
    - Fields: id, product_id (unique), download_url, file_name, file_type, file_size (Int), expiration_date (DateTime, optional), download_count (Int, default 0), download_limit (Int, optional)
    - One-to-one with Product (only for digital products)
    - @@map("digital_products")
  - [x] 3.5 Set up associations
    - VariantInventory belongs_to ProductVariant and Branch
    - ProductImage belongs_to Product
    - DigitalProduct belongs_to Product (one-to-one)
  - [ ] 3.6 Run migration for inventory, images, and digital products
  - [ ] 3.7 Ensure inventory and media model tests pass
    - Run ONLY the 2-8 tests written in 3.1

**Acceptance Criteria:**
- VariantInventory tracks stock per variant per branch
- ProductImage supports multiple images with ordering
- DigitalProduct model stores download management fields
- Tests from 3.1 pass

---

#### Task Group 4: Bundle and Review Models
**Dependencies:** Task Group 3

- [ ] 4.0 Complete bundle and review database layer
  - [ ] 4.1 Write 2-8 focused tests for bundle and review models
    - Test ProductBundle creation with own price
    - Test BundleItem association with products and optional variants
    - Test ProductReview with rating validation (1-5)
    - Test review unique constraint on [user_id, order_item_id]
  - [ ] 4.2 Create ProductBundle model
    - Fields: id, name, description, price (Decimal), is_active (Boolean), store_id
    - @@map("product_bundles")
  - [ ] 4.3 Create BundleItem model
    - Fields: id, bundle_id, product_id, variant_id (optional), quantity (Int)
    - @@map("bundle_items")
  - [ ] 4.4 Create ProductReview model
    - Fields: id, product_id, order_id, order_item_id, user_id, rating (Int 1-5), title, body, createdAt
    - Unique constraint on [user_id, order_item_id] (one review per purchase)
    - @@map("product_reviews")
  - [ ] 4.5 Set up associations
    - ProductBundle has_many BundleItem
    - BundleItem belongs_to ProductBundle, Product, and optionally ProductVariant
    - ProductReview belongs_to Product, Order, OrderItem, and User
  - [ ] 4.6 Run migration for bundle and review models
  - [ ] 4.7 Ensure bundle and review model tests pass
    - Run ONLY the 2-8 tests written in 4.1

**Acceptance Criteria:**
- ProductBundle and BundleItem models support product bundling
- ProductReview model enforces one review per order item per user
- Rating field validated to 1-5 range
- Tests from 4.1 pass

---

### API Layer

#### Task Group 5: Product CRUD Server Actions
**Dependencies:** Task Groups 1-4

- [ ] 5.0 Complete product CRUD API layer
  - [ ] 5.1 Write 2-8 focused tests for product server actions
    - Test createProduct action with validation
    - Test getProducts action with pagination
    - Test updateProduct action
    - Test deleteProduct action with authorization
    - Test attribute limit enforcement per subscription tier
  - [ ] 5.2 Create Yup validation schemas
    - productBasicInfoSchema (name, description, slug, brand, status, SEO fields)
    - productMediaSchema (images array validation)
    - productVariantSchema (sku, price, attribute values)
    - productConfigSchema (is_digital, track_inventory, etc.)
  - [ ] 5.3 Create product data layer functions
    - createProductData, getProductsData, getProductByIdData, updateProductData, deleteProductData
    - Follow pattern: pure Prisma queries, no business logic
    - Import prisma from @/features/core
  - [ ] 5.4 Create product service layer
    - createProductService: validate attribute limits per subscription tier (FREE: 5, PRO: 50, ENTERPRISE: unlimited)
    - Calculate "starting at" price from lowest variant price
    - Handle digital product creation when is_digital flag is set
    - Orchestrate product with variants, images, and inventory
  - [ ] 5.5 Create product server actions
    - createProductAction: use actionWrapper, validate with Yup, call service, revalidatePath
    - getProductsAction: support search, filter by status, sorting, pagination
    - updateProductAction: validate ownership, update product and related models
    - deleteProductAction: cascade delete variants, images, inventory
    - bulkUpdateProductsAction: handle bulk status changes, bulk archive, bulk delete
  - [ ] 5.6 Create messages constants file
    - PRODUCT_MESSAGES for all user-facing strings (Spanish)
  - [ ] 5.7 Ensure product CRUD tests pass
    - Run ONLY the 2-8 tests written in 5.1

**Acceptance Criteria:**
- All CRUD operations work with proper validation
- Subscription tier attribute limits enforced
- Server actions use actionWrapper pattern
- Tests from 5.1 pass

---

#### Task Group 6: Inventory, Reviews, and Bundle Server Actions
**Dependencies:** Task Group 5

- [ ] 6.0 Complete inventory, reviews, and bundle API layer
  - [ ] 6.1 Write 2-8 focused tests for supporting server actions
    - Test inventory update action
    - Test review creation with order validation
    - Test bundle CRUD operations
    - Test digital product download URL validation
  - [ ] 6.2 Create inventory server actions
    - updateInventoryAction: update quantity for variant/branch combination
    - getInventoryStatusAction: return in_stock/low_stock/out_of_stock states
  - [ ] 6.3 Create review server actions
    - createReviewAction: validate user purchased product via order_item_id
    - getProductReviewsAction: fetch reviews with pagination, calculate average rating
  - [ ] 6.4 Create bundle server actions
    - createBundleAction: create bundle with items
    - updateBundleAction, deleteBundleAction
    - getBundlesAction: list store bundles
  - [ ] 6.5 Create digital product server actions
    - getDownloadUrlAction: validate expiration, increment download_count, check download_limit
  - [ ] 6.6 Create additional Yup schemas
    - inventoryUpdateSchema, reviewSchema, bundleSchema
  - [ ] 6.7 Ensure supporting action tests pass
    - Run ONLY the 2-8 tests written in 6.1

**Acceptance Criteria:**
- Inventory can be updated per variant per branch
- Reviews require valid order item ownership
- Bundles can be created with multiple products
- Digital downloads respect limits and expiration
- Tests from 6.1 pass

---

### Frontend - Merchant Dashboard

#### Task Group 7: Product Listing Dashboard
**Dependencies:** Task Group 5

- [ ] 7.0 Complete merchant product listing dashboard
  - [ ] 7.1 Write 2-8 focused tests for product listing components
    - Test ProductListPage renders product data table
    - Test search by name/SKU functionality
    - Test filter by status (active/draft/archived)
    - Test bulk selection actions
  - [ ] 7.2 Create ProductListPage server component
    - Fetch products using getProductsAction
    - Pass data to DataTable component
    - Route: /dashboard/[storeSlug]/products
  - [ ] 7.3 Adapt DataTable for products
    - Reuse from backup/components/data-table/
    - Configure columns: image, name, SKU, status, price, stock, actions
    - Implement fetchDataFn for product pagination
    - Add exportConfig for product data export
  - [ ] 7.4 Implement search and filters
    - Search input for name and SKU
    - Status filter dropdown (ACTIVE, DRAFT, ARCHIVED)
    - Sorting by name, date, price, stock
  - [ ] 7.5 Implement bulk actions
    - Bulk selection checkboxes
    - Bulk delete, archive, change status actions
    - Bulk price update modal
  - [ ] 7.6 Create product list types
    - ProductListPageProps, ProductTableColumn types in features/products/types/
  - [ ] 7.7 Ensure product listing tests pass
    - Run ONLY the 2-8 tests written in 7.1

**Acceptance Criteria:**
- Product listing displays in DataTable with all columns
- Search, filter, and sort work correctly
- Bulk actions function properly
- Tests from 7.1 pass

---

#### Task Group 8: Product Creation Multi-Step Form
**Dependencies:** Task Group 7

- [ ] 8.0 Complete product creation form
  - [ ] 8.1 Write 2-8 focused tests for product creation form
    - Test multi-step form navigation
    - Test step validation before proceeding
    - Test form submission creates product with variants
    - Test media upload integration
  - [ ] 8.2 Create CreateProductProvider context
    - Manage form state across all steps
    - Follow pattern from backup/features/products/components/create-form/
    - Store: basicInfo, media, variants, configurations
  - [ ] 8.3 Create step components using Stepper pattern
    - Follow Stepper component pattern from backup/features/shadcn/components/Stepper.tsx
    - Step 1: BasicInfoStep (name, description, slug, brand, status, SEO fields)
    - Step 2: MediaStep (image uploads using MediaSelector)
    - Step 3: OptionsVariantsStep (attributes, attribute values, variant generation)
    - Step 4: TypeSpecificStep (physical vs digital product settings)
    - Step 5: ConfigurationsStep (inventory settings, pricing, promotions)
  - [ ] 8.4 Integrate MediaSelector for image uploads
    - Reuse from backup/features/global/components/media-selector/
    - Support multiple images with drag-to-reorder
    - Set primary image
  - [ ] 8.5 Implement variant generation UI
    - Add custom attributes (Size, Color, etc.)
    - Add values for each attribute
    - Auto-generate variant combinations
    - Set price, promotional_price, cost, sku per variant
  - [ ] 8.6 Implement digital product configuration
    - Show digital product fields when is_digital is true
    - Upload download file, set expiration, download limit
  - [ ] 8.7 Create form submission handler
    - Validate all steps before submission
    - Call createProductAction with complete product data
    - Show success/error toast feedback
    - Redirect to product list on success
  - [ ] 8.8 Ensure product creation form tests pass
    - Run ONLY the 2-8 tests written in 8.1

**Acceptance Criteria:**
- Multi-step form navigates correctly
- Each step validates before proceeding
- Media uploads work with reordering
- Variants auto-generate from attribute combinations
- Digital product fields appear conditionally
- Form submits and creates complete product
- Tests from 8.1 pass

---

### Frontend - Customer Storefront

#### Task Group 9: Public Product Display and Listing
**Dependencies:** Task Group 6

- [ ] 9.0 Complete customer storefront product pages
  - [ ] 9.1 Write 2-8 focused tests for storefront components
    - Test product detail page renders product data
    - Test variant selector updates price display
    - Test product listing page with grid layout
    - Test search and filter functionality
  - [ ] 9.2 Create public product detail page
    - Route: /products/[slug]
    - Server component fetching product data
    - Display: image gallery, description, pricing, variant selector
    - Show inventory status (in stock/out of stock)
    - Display reviews with average rating
  - [ ] 9.3 Integrate Next.js metadata API for SEO
    - Generate metadata from product SEO fields
    - Set og:image from og_image_url
    - Consider ISR for product pages (revalidate option)
  - [ ] 9.4 Create product image gallery component
    - Main image display with thumbnails
    - Click to change main image
    - Support for multiple product images
  - [ ] 9.5 Create variant selector component (Client Component)
    - "use client" directive
    - Display attribute options (size, color, etc.)
    - Update price display when variant selected
    - Show variant availability
  - [ ] 9.6 Create public product listing page
    - Route: /products
    - Grid layout with product cards
    - Only show ACTIVE products
    - Search by product name
    - Sort: newest, price low-high, price high-low
    - Pagination
  - [ ] 9.7 Create product card component
    - Display: image, name, "starting at" price
    - Link to product detail page
    - Show is_featured, is_new, is_on_sale badges
  - [ ] 9.8 Create review display component
    - List reviews with rating stars
    - Show average rating summary
    - Pagination for reviews
  - [ ] 9.9 Ensure storefront tests pass
    - Run ONLY the 2-8 tests written in 9.1

**Acceptance Criteria:**
- Product detail page displays all product information
- Variant selector updates pricing dynamically
- SEO metadata generated correctly
- Product listing shows grid with search/sort/pagination
- Reviews display with average rating
- Tests from 9.1 pass

---

### Integration & Testing

#### Task Group 10: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-9

- [ ] 10.0 Review existing tests and fill critical gaps only
  - [ ] 10.1 Review tests from Task Groups 1-9
    - Review the 2-8 tests written by database layer (Tasks 1.1, 2.1, 3.1, 4.1)
    - Review the 2-8 tests written by API layer (Tasks 5.1, 6.1)
    - Review the 2-8 tests written by frontend layer (Tasks 7.1, 8.1, 9.1)
    - Total existing tests: approximately 18-72 tests
  - [ ] 10.2 Analyze test coverage gaps for product catalog feature only
    - Identify critical user workflows lacking test coverage
    - Focus ONLY on gaps related to product catalog functionality
    - Prioritize end-to-end workflows:
      - Complete product creation flow (merchant)
      - Product browsing and variant selection (customer)
      - Review submission after purchase
      - Digital product download flow
  - [ ] 10.3 Write up to 10 additional strategic tests maximum
    - Focus on integration points between layers
    - Test subscription tier attribute limits enforcement
    - Test review creation requires valid order ownership
    - Test inventory state calculation (in_stock/low_stock/out_of_stock)
    - Test bundle pricing calculation
  - [ ] 10.4 Run feature-specific tests only
    - Run ONLY tests related to product catalog feature
    - Expected total: approximately 28-82 tests maximum
    - Verify critical workflows pass

**Acceptance Criteria:**
- All feature-specific tests pass
- Critical user workflows for product catalog are covered
- No more than 10 additional tests added
- Testing focused exclusively on product catalog functionality

---

## Execution Order

Recommended implementation sequence:

1. **Task Group 1: Core Product Models** - Foundation models (Product, ProductAttribute, ProductAttributeValue)
2. **Task Group 2: Variant and Pricing Models** - ProductVariant with pricing at variant level
3. **Task Group 3: Inventory, Images, Digital Products** - Supporting models for inventory tracking, media, and digital downloads
4. **Task Group 4: Bundle and Review Models** - ProductBundle, BundleItem, ProductReview
5. **Task Group 5: Product CRUD Server Actions** - Core API layer for product management
6. **Task Group 6: Supporting Server Actions** - Inventory, reviews, bundles, digital downloads
7. **Task Group 7: Product Listing Dashboard** - Merchant dashboard with DataTable
8. **Task Group 8: Product Creation Form** - Multi-step form for product creation
9. **Task Group 9: Customer Storefront** - Public product display and listing pages
10. **Task Group 10: Test Review & Gap Analysis** - Final testing phase

## Key Technical Notes

- **Prisma Schema**: Use cuid() for IDs, include createdAt/updatedAt, add indexes on foreign keys
- **Server Actions**: Always use actionWrapper from @/features/core, validate with Yup schemas
- **Components**: Server Components by default, Client Components only for interactivity
- **UI Components**: Use shadcn/ui components, follow existing patterns
- **Types**: Define props interfaces in features/[feature]/types/, never in component files
- **Subscription Tiers**: Enforce attribute limits (FREE: 5, PRO: 50, ENTERPRISE: unlimited)
- **Reviews**: Must be tied to orders - validate order_item ownership before allowing review
- **Digital Products**: Secure URL handling with expiration and download limit enforcement
