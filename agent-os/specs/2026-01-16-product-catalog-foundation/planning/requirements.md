# Spec Requirements: Product Catalog Foundation

## Initial Description
Product Catalog Foundation — Build product creation with variants, pricing, inventory tracking, and image uploads. Include basic product listing and search functionality.

**Source:** Roadmap Item #4
**Complexity Estimate:** Large (L)
**Date Initiated:** 2026-01-16

## Requirements Discussion

### First Round Questions

**Q1:** I assume products will support variants like size/color combinations (e.g., a T-shirt in multiple sizes and colors), where each variant has its own SKU, price, and inventory. Is that correct, or do you need a simpler structure where products don't have variants?
**Answer:** Yes, products should support variants and combinations.

**Q2:** I'm thinking variant options would be flexible (merchants define their own option types like "Size", "Color", "Material") rather than predefined. Should we allow unlimited option types per product, or limit to 2-3 options for simplicity?
**Answer:** Limit of 5 addable attributes per product for free accounts, 50 for pro, and unlimited for enterprise.

**Q3:** I assume pricing will be at the variant level (each size/color has its own price), with the main product showing a "starting at" price. Is that correct, or should all variants share the same price?
**Answer:** Yes, pricing is managed at the variant level.

**Q4:** For inventory tracking, I assume we'll track stock quantity per variant per branch (since multi-branch support comes in a later roadmap item). Should we implement branch-level inventory now, or start with a single global inventory count that we expand later?
**Answer:** Yes, stock is managed per variant and per branch. At the same time, there should be a single place to store the total stock of the store.

**Q5:** I'm thinking we'll include basic inventory states: in stock, low stock (configurable threshold), and out of stock. Should we also support "track inventory" toggle (for products where merchants don't want to track stock, like digital goods or services)?
**Answer:** For digital products they want an "is_digital" flag and a model that stores: download URL, expiration date, download count, download limit, and any other useful properties. They also want the "track inventory" toggle for generating alerts about low stock levels in the future.

**Q6:** For the merchant dashboard product list, I assume we need: search by name/SKU, filtering by status (active/draft/archived), sorting (name, date, price, stock), and pagination. Is there anything else you'd want to filter or sort by?
**Answer:** The mentioned filters are sufficient.

**Q7:** Should merchants be able to bulk-select products for actions like bulk delete, bulk archive, or bulk price updates? Or is single-product management sufficient for the foundation?
**Answer:** Bulk selection would be a good asset to have.

**Q8:** What should explicitly NOT be part of this foundation that we might be tempted to include? For example: product categories (roadmap #13), customer-facing storefront display, product reviews, product bundles, digital products, or product SEO settings?
**Answer:** Categories should be excluded (already in roadmap). Everything else mentioned should be included: customer-facing storefront display, product reviews, product bundles, digital products, product SEO settings.

### Existing Code to Reference

**Similar Features Identified:**
- Feature: Auth/Global Functions - Path: `auth/global functions for checking if user is logged in or user info`
- Feature: Global Table Components - Path: `Global table components`
- Feature: Multi-Step Form Example - Path: `Backup folder with create-product-form.tsx that implements a multi-step form`

**Notes for Spec Writer:**
- Reference the auth functions for user authentication checks
- Use the existing global table components for the product listing dashboard
- The multi-step form pattern in the backup folder should be used as a reference for the product creation form

### Follow-up Questions

**Follow-up 1:** Digital Products Model - You mentioned storing download URL, expiration date, download count, and download limit. Should the download URL support multiple files per digital product (e.g., a course with multiple PDFs), or is a single file per product sufficient for now?
**Answer:** Single file per digital product for now.

**Follow-up 2:** Scope Clarification on "Product Reviews" - You mentioned product reviews should be included. Are these post-purchase reviews only (customers who bought the product can review it), or can any visitor leave a review? This affects whether we need to tie reviews to orders.
**Answer:** Only customers who purchased can leave a review (post-purchase reviews tied to orders).

**Follow-up 3:** SEO Settings Scope - For product SEO settings, I assume this means: custom meta title, meta description, URL slug, and potentially Open Graph image. Is that the scope you have in mind, or do you need more advanced SEO features like schema markup or canonical URLs?
**Answer:** The 4 fields are sufficient for now: meta title, meta description, URL slug, and Open Graph image.

**Follow-up 4:** Social Features Question - User asked if social features (likes, comments on products in the storefront) should be included now or done later according to the roadmap.
**Answer:** Based on roadmap analysis, social features are NOT included in any existing roadmap item. Recommendation accepted to exclude social features from this spec. They add significant complexity (moderation, spam prevention, notifications) and are not critical for core e-commerce flow. Can be added as a separate roadmap item in the future.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
N/A - No visual files were found in the planning/visuals folder.

## Requirements Summary

### Functional Requirements

**Product Structure:**
- Products support variants with combinations (e.g., size + color)
- Merchants define custom attribute types (flexible, not predefined)
- Attribute limits per subscription tier:
  - FREE: 5 attributes per product
  - PRO: 50 attributes per product
  - ENTERPRISE: Unlimited attributes

**Pricing:**
- Pricing managed at the variant level
- Each variant can have its own price
- Main product displays "starting at" price based on lowest variant price

**Inventory Tracking:**
- Stock tracked per variant per branch
- Aggregate total stock visible at store level
- "Track inventory" toggle for products where stock tracking is not needed
- Inventory states: in stock, low stock (configurable threshold), out of stock

**Digital Products:**
- "is_digital" flag on products
- Digital product model with:
  - Download URL (single file per product)
  - Expiration date
  - Download count
  - Download limit

**Product Listing & Search (Merchant Dashboard):**
- Search by product name and SKU
- Filter by status (active/draft/archived)
- Sorting by name, date, price, stock
- Pagination
- Bulk selection for actions (delete, archive, price updates)

**Customer-Facing Storefront:**
- Product display pages
- Product listing/browsing
- Product search functionality

**Product Reviews:**
- Post-purchase reviews only
- Only customers who purchased can leave a review
- Reviews tied to orders

**Product Bundles:**
- Ability to create product bundles
- Bundle pricing

**Product SEO Settings:**
- Meta title
- Meta description
- URL slug (custom permalink)
- Open Graph image

**Image Uploads:**
- Product image uploads
- Multiple images per product
- Image management

### Reusability Opportunities

- Auth/global functions for user authentication and authorization checks
- Global table components for product listing dashboard
- Multi-step form pattern from backup folder (create-product-form.tsx) for product creation wizard

### Scope Boundaries

**In Scope:**
- Product creation with variants and combinations
- Variant-level pricing
- Inventory tracking per variant per branch
- Track inventory toggle
- Digital products with download management
- Product listing with search, filters, sorting, pagination
- Bulk selection and actions
- Customer-facing storefront product display
- Post-purchase product reviews (tied to orders)
- Product bundles
- Product SEO settings (4 fields)
- Image uploads and management

**Out of Scope:**
- Product categories (Roadmap Item #13)
- Social features (likes, comments) - not in current roadmap
- Multiple files per digital product (future enhancement)
- Advanced SEO (schema markup, canonical URLs)
- Low stock alerts UI (future - Roadmap Item #14)

### Technical Considerations

- Multi-branch inventory architecture needs to be designed now even though Multi-Branch Support is Roadmap Item #7
- Subscription tier limits (FREE/PRO/ENTERPRISE) need to be enforced at attribute creation
- Reviews must be tied to Order model for post-purchase validation
- Digital product downloads need secure URL handling with expiration
- SEO fields need to integrate with Next.js metadata API
- Consider ISR (Incremental Static Regeneration) for public storefront product pages
- Use existing patterns: global table components, multi-step form, auth functions
