/**
 * Product Messages Constants
 *
 * This file contains all user-facing message keys used across
 * the product catalog feature. Values are next-intl translation keys
 * so the client can call t(result.message) to display the translated string.
 *
 * These constants ensure consistent messaging across all product flows
 * and make it easier to update messages in a single location.
 */

/**
 * Success Message Keys
 *
 * Translation keys for successful product operations.
 */
export const PRODUCT_SUCCESS_MESSAGES = {
  // Product CRUD
  CREATE: 'products.success.create',
  UPDATE: 'products.success.update',
  DELETE: 'products.success.delete',

  // Bulk operations
  BULK_DELETE: 'products.success.bulkDelete',
  BULK_ARCHIVE: 'products.success.bulkArchive',
  BULK_ACTIVATE: 'products.success.bulkActivate',
  BULK_DRAFT: 'products.success.bulkDraft',
  BULK_STATUS_UPDATE: 'products.success.bulkStatusUpdate',

  // Status changes
  STATUS_ACTIVATED: 'products.success.statusActivated',
  STATUS_ARCHIVED: 'products.success.statusArchived',
  STATUS_DRAFTED: 'products.success.statusDrafted',

  // Inventory
  INVENTORY_UPDATED: 'products.success.inventoryUpdated',
  STOCK_ADDED: 'products.success.stockAdded',
  STOCK_ADJUSTED: 'products.success.stockAdjusted',

  // Reviews
  REVIEW_CREATED: 'products.success.reviewCreated',
  REVIEW_UPDATED: 'products.success.reviewUpdated',
  REVIEW_DELETED: 'products.success.reviewDeleted',

  // Bundles
  BUNDLE_CREATED: 'products.success.bundleCreated',
  BUNDLE_UPDATED: 'products.success.bundleUpdated',
  BUNDLE_DELETED: 'products.success.bundleDeleted',

  // Digital products
  DOWNLOAD_STARTED: 'products.success.downloadStarted',
  DOWNLOAD_URL_GENERATED: 'products.success.downloadUrlGenerated',

  // Images
  IMAGE_UPLOADED: 'products.success.imageUploaded',
  IMAGE_DELETED: 'products.success.imageDeleted',
  IMAGES_REORDERED: 'products.success.imagesReordered',

  // Variants
  VARIANT_CREATED: 'products.success.variantCreated',
  VARIANT_UPDATED: 'products.success.variantUpdated',
  VARIANT_DELETED: 'products.success.variantDeleted',

  // Attributes
  ATTRIBUTE_CREATED: 'products.success.attributeCreated',
  ATTRIBUTE_UPDATED: 'products.success.attributeUpdated',
  ATTRIBUTE_DELETED: 'products.success.attributeDeleted',

  // Fetch operations
  FETCHED: 'products.success.fetched',
  REVIEWS_FETCHED: 'products.success.reviewsFetched',
  BUNDLES_FETCHED: 'products.success.bundlesFetched',
  INVENTORY_FETCHED: 'products.success.inventoryFetched',
  DOWNLOAD_URL_FETCHED: 'products.success.downloadUrlFetched',
} as const;

/**
 * Error Message Keys
 *
 * Translation keys for failed product operations.
 */
export const PRODUCT_ERROR_MESSAGES = {
  // General
  GENERIC_ERROR: 'products.errors.genericError',
  NOT_FOUND: 'products.errors.notFound',
  UNAUTHORIZED: 'products.errors.unauthorized',
  NOT_AUTHENTICATED: 'products.errors.notAuthenticated',
  STORE_NOT_FOUND: 'products.errors.storeNotFound',
  ORDER_ITEM_NOT_FOUND: 'products.errors.orderItemNotFound',
  ORDER_ITEM_MISMATCH: 'products.errors.orderItemMismatch',

  // Product operations
  CREATE_FAILED: 'products.errors.createFailed',
  UPDATE_FAILED: 'products.errors.updateFailed',
  DELETE_FAILED: 'products.errors.deleteFailed',
  DELETE_PERMISSION_DENIED: 'products.errors.deletePermissionDenied',

  // Bulk operations
  BULK_NO_SELECTION: 'products.errors.bulkNoSelection',
  BULK_OPERATION_INVALID: 'products.errors.bulkOperationInvalid',
  BULK_OPERATION_FAILED: 'products.errors.bulkOperationFailed',

  // Subscription limits
  ATTRIBUTE_LIMIT_FREE: 'products.errors.attributeLimitFree',
  ATTRIBUTE_LIMIT_PRO: 'products.errors.attributeLimitPro',
  ATTRIBUTE_LIMIT_EXCEEDED: 'products.errors.attributeLimitExceeded',

  // Inventory
  INVENTORY_UPDATE_FAILED: 'products.errors.inventoryUpdateFailed',
  INVENTORY_NOT_FOUND: 'products.errors.inventoryNotFound',
  NEGATIVE_QUANTITY: 'products.errors.negativeQuantity',

  // Reviews
  REVIEW_CREATE_FAILED: 'products.errors.reviewCreateFailed',
  REVIEW_NOT_FOUND: 'products.errors.reviewNotFound',
  REVIEW_ALREADY_EXISTS: 'products.errors.reviewAlreadyExists',
  REVIEW_PURCHASE_REQUIRED: 'products.errors.reviewPurchaseRequired',
  REVIEW_UNAUTHORIZED: 'products.errors.reviewUnauthorized',

  // Bundles
  BUNDLE_CREATE_FAILED: 'products.errors.bundleCreateFailed',
  BUNDLE_NOT_FOUND: 'products.errors.bundleNotFound',
  BUNDLE_MIN_PRODUCTS: 'products.errors.bundleMinProducts',
  BUNDLE_PRODUCT_NOT_FOUND: 'products.errors.bundleProductNotFound',

  // Digital products
  DOWNLOAD_EXPIRED: 'products.errors.downloadExpired',
  DOWNLOAD_LIMIT_REACHED: 'products.errors.downloadLimitReached',
  DOWNLOAD_NOT_AVAILABLE: 'products.errors.downloadNotAvailable',
  DIGITAL_PRODUCT_NOT_FOUND: 'products.errors.digitalProductNotFound',

  // Images
  IMAGE_UPLOAD_FAILED: 'products.errors.imageUploadFailed',
  IMAGE_DELETE_FAILED: 'products.errors.imageDeleteFailed',
  IMAGE_NOT_FOUND: 'products.errors.imageNotFound',
  SINGLE_PRIMARY_IMAGE: 'products.errors.singlePrimaryImage',

  // Variants
  VARIANT_CREATE_FAILED: 'products.errors.variantCreateFailed',
  VARIANT_NOT_FOUND: 'products.errors.variantNotFound',
  VARIANT_SKU_EXISTS: 'products.errors.variantSkuExists',
  VARIANT_IN_ORDER: 'products.errors.variantInOrder',

  // Attributes
  ATTRIBUTE_CREATE_FAILED: 'products.errors.attributeCreateFailed',
  ATTRIBUTE_NOT_FOUND: 'products.errors.attributeNotFound',
  ATTRIBUTE_IN_USE: 'products.errors.attributeInUse',

  // Slug
  SLUG_EXISTS: 'products.errors.slugExists',
} as const;

/**
 * Validation Message Keys
 *
 * Translation keys for form validation.
 */
export const PRODUCT_VALIDATION_MESSAGES = {
  // Required fields
  NAME_REQUIRED: 'products.validation.nameRequired',
  SLUG_REQUIRED: 'products.validation.slugRequired',
  SKU_REQUIRED: 'products.validation.skuRequired',
  PRICE_REQUIRED: 'products.validation.priceRequired',
  RATING_REQUIRED: 'products.validation.ratingRequired',
  REVIEW_TITLE_REQUIRED: 'products.validation.reviewTitleRequired',

  // Name validation
  NAME_MIN_LENGTH: 'products.validation.nameMinLength',
  NAME_MAX_LENGTH: 'products.validation.nameMaxLength',

  // Description validation
  DESCRIPTION_MAX_LENGTH: 'products.validation.descriptionMaxLength',

  // Slug validation
  SLUG_FORMAT: 'products.validation.slugFormat',
  SLUG_MAX_LENGTH: 'products.validation.slugMaxLength',

  // Brand validation
  BRAND_MAX_LENGTH: 'products.validation.brandMaxLength',

  // SEO validation
  SEO_TITLE_MAX_LENGTH: 'products.validation.seoTitleMaxLength',
  SEO_DESCRIPTION_MAX_LENGTH: 'products.validation.seoDescriptionMaxLength',

  // Price validation
  PRICE_TYPE_ERROR: 'products.validation.priceTypeError',
  PRICE_POSITIVE: 'products.validation.pricePositive',
  PRICE_MAX: 'products.validation.priceMax',
  PROMOTIONAL_PRICE_LESS_THAN_REGULAR: 'products.validation.promotionalPriceLessThanRegular',

  // SKU validation
  SKU_FORMAT: 'products.validation.skuFormat',
  SKU_MAX_LENGTH: 'products.validation.skuMaxLength',

  // Quantity validation
  QUANTITY_TYPE_ERROR: 'products.validation.quantityTypeError',
  QUANTITY_INTEGER: 'products.validation.quantityInteger',
  QUANTITY_MIN: 'products.validation.quantityMin',

  // Threshold validation
  THRESHOLD_TYPE_ERROR: 'products.validation.thresholdTypeError',
  THRESHOLD_INTEGER: 'products.validation.thresholdInteger',
  THRESHOLD_MIN: 'products.validation.thresholdMin',

  // Rating validation
  RATING_TYPE_ERROR: 'products.validation.ratingTypeError',
  RATING_INTEGER: 'products.validation.ratingInteger',
  RATING_MIN: 'products.validation.ratingMin',
  RATING_MAX: 'products.validation.ratingMax',

  // Review validation
  REVIEW_TITLE_MAX_LENGTH: 'products.validation.reviewTitleMaxLength',
  REVIEW_BODY_MAX_LENGTH: 'products.validation.reviewBodyMaxLength',

  // URL validation
  URL_INVALID: 'products.validation.urlInvalid',
  IMAGE_URL_REQUIRED: 'products.validation.imageUrlRequired',
  DOWNLOAD_URL_REQUIRED: 'products.validation.downloadUrlRequired',

  // Image validation
  IMAGE_ALT_MAX_LENGTH: 'products.validation.imageAltMaxLength',
  IMAGE_MIN_REQUIRED: 'products.validation.imageMinRequired',

  // Variant validation
  VARIANT_ATTRIBUTE_REQUIRED: 'products.validation.variantAttributeRequired',
  ATTRIBUTE_VALUE_REQUIRED: 'products.validation.attributeValueRequired',

  // Attribute validation
  ATTRIBUTE_NAME_REQUIRED: 'products.validation.attributeNameRequired',
  ATTRIBUTE_TYPE_REQUIRED: 'products.validation.attributeTypeRequired',
  ATTRIBUTE_TYPE_INVALID: 'products.validation.attributeTypeInvalid',
  ATTRIBUTE_VALUE_MIN: 'products.validation.attributeValueMin',
  ATTRIBUTE_VALUE_EMPTY: 'products.validation.attributeValueEmpty',

  // Digital product validation
  DIGITAL_FIELDS_REQUIRED: 'products.validation.digitalFieldsRequired',
  FILE_SIZE_REQUIRED: 'products.validation.fileSizeRequired',
  FILE_TYPE_INVALID: 'products.validation.fileTypeInvalid',

  // Bundle validation
  BUNDLE_NAME_REQUIRED: 'products.validation.bundleNameRequired',
  BUNDLE_PRICE_REQUIRED: 'products.validation.bundlePriceRequired',
  BUNDLE_MIN_ITEMS: 'products.validation.bundleMinItems',
  BUNDLE_PRODUCT_ID_REQUIRED: 'products.validation.bundleProductIdRequired',

  // Status validation
  STATUS_INVALID: 'products.validation.statusInvalid',
} as const;

/**
 * Inventory Status Message Keys
 *
 * Translation keys for inventory state display.
 */
export const INVENTORY_STATUS_MESSAGES = {
  IN_STOCK: 'products.inventoryStatus.inStock',
  LOW_STOCK: 'products.inventoryStatus.lowStock',
  OUT_OF_STOCK: 'products.inventoryStatus.outOfStock',
  UNITS_AVAILABLE: 'products.inventoryStatus.unitsAvailable',
  UNITS_REMAINING: 'products.inventoryStatus.unitsRemaining',
} as const;

/**
 * Product Status Message Keys
 *
 * Translation keys for product status display.
 */
export const PRODUCT_STATUS_MESSAGES = {
  ACTIVE: 'products.status.active',
  DRAFT: 'products.status.draft',
  ARCHIVED: 'products.status.archived',
} as const;

/**
 * UI Message Keys
 *
 * Translation keys for product-related UI elements.
 */
export const PRODUCT_UI_MESSAGES = {
  // Pricing
  STARTING_AT: 'products.ui.startingAt',
  REGULAR_PRICE: 'products.ui.regularPrice',
  PROMOTIONAL_PRICE: 'products.ui.promotionalPrice',
  SAVE: 'products.ui.save',

  // Product badges
  FEATURED: 'products.ui.featured',
  NEW: 'products.ui.new',
  ON_SALE: 'products.ui.onSale',
  DIGITAL: 'products.ui.digital',

  // Reviews
  NO_REVIEWS: 'products.ui.noReviews',
  REVIEWS_COUNT: 'products.ui.reviewsCount',
  AVERAGE_RATING: 'products.ui.averageRating',
  WRITE_REVIEW: 'products.ui.writeReview',

  // Actions
  ADD_TO_CART: 'products.ui.addToCart',
  BUY_NOW: 'products.ui.buyNow',
  VIEW_DETAILS: 'products.ui.viewDetails',
  DOWNLOAD: 'products.ui.download',

  // Variants
  SELECT_OPTIONS: 'products.ui.selectOptions',
  SELECT_VARIANT: 'products.ui.selectVariant',

  // Form steps
  STEP_BASIC_INFO: 'products.ui.stepBasicInfo',
  STEP_MEDIA: 'products.ui.stepMedia',
  STEP_OPTIONS_VARIANTS: 'products.ui.stepOptionsVariants',
  STEP_TYPE_SPECIFIC: 'products.ui.stepTypeSpecific',
  STEP_CONFIGURATIONS: 'products.ui.stepConfigurations',

  // Empty states
  NO_PRODUCTS: 'products.ui.noProducts',
  NO_PRODUCTS_DESCRIPTION: 'products.ui.noProductsDescription',
  NO_VARIANTS: 'products.ui.noVariants',
  NO_IMAGES: 'products.ui.noImages',

  // Confirmations
  CONFIRM_DELETE: 'products.ui.confirmDelete',
  CONFIRM_DELETE_BULK: 'products.ui.confirmDeleteBulk',
  CONFIRM_ARCHIVE: 'products.ui.confirmArchive',
  DELETE_WARNING: 'products.ui.deleteWarning',
} as const;

/**
 * Combined PRODUCT_MESSAGES export
 *
 * Single object containing all product-related messages for easy import.
 */
export const PRODUCT_MESSAGES = {
  SUCCESS: PRODUCT_SUCCESS_MESSAGES,
  ERROR: PRODUCT_ERROR_MESSAGES,
  VALIDATION: PRODUCT_VALIDATION_MESSAGES,
  INVENTORY_STATUS: INVENTORY_STATUS_MESSAGES,
  PRODUCT_STATUS: PRODUCT_STATUS_MESSAGES,
  UI: PRODUCT_UI_MESSAGES,
} as const;
