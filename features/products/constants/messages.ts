/**
 * Product Messages Constants
 *
 * This file contains all user-facing strings used across
 * the product catalog feature. Messages are structured to support
 * internationalization (i18n) with Spanish and English translations.
 *
 * These constants ensure consistent messaging across all product flows
 * and make it easier to update messages in a single location.
 */

/**
 * Success Messages
 *
 * Messages displayed when product operations complete successfully
 */
export const PRODUCT_SUCCESS_MESSAGES = {
  // Product CRUD
  CREATE: {
    es: 'Producto creado exitosamente',
    en: 'Product created successfully',
  },
  UPDATE: {
    es: 'Producto actualizado exitosamente',
    en: 'Product updated successfully',
  },
  DELETE: {
    es: 'Producto eliminado exitosamente',
    en: 'Product deleted successfully',
  },

  // Bulk operations
  BULK_DELETE: {
    es: 'producto(s) eliminado(s) exitosamente',
    en: 'product(s) deleted successfully',
  },
  BULK_ARCHIVE: {
    es: 'producto(s) archivado(s) exitosamente',
    en: 'product(s) archived successfully',
  },
  BULK_ACTIVATE: {
    es: 'producto(s) activado(s) exitosamente',
    en: 'product(s) activated successfully',
  },
  BULK_DRAFT: {
    es: 'producto(s) marcado(s) como borrador',
    en: 'product(s) marked as draft',
  },
  BULK_STATUS_UPDATE: {
    es: 'producto(s) actualizado(s) exitosamente',
    en: 'product(s) updated successfully',
  },

  // Status changes
  STATUS_ACTIVATED: {
    es: 'Producto activado exitosamente',
    en: 'Product activated successfully',
  },
  STATUS_ARCHIVED: {
    es: 'Producto archivado exitosamente',
    en: 'Product archived successfully',
  },
  STATUS_DRAFTED: {
    es: 'Producto marcado como borrador',
    en: 'Product marked as draft',
  },

  // Inventory
  INVENTORY_UPDATED: {
    es: 'Inventario actualizado exitosamente',
    en: 'Inventory updated successfully',
  },
  STOCK_ADDED: {
    es: 'Stock agregado exitosamente',
    en: 'Stock added successfully',
  },
  STOCK_ADJUSTED: {
    es: 'Stock ajustado exitosamente',
    en: 'Stock adjusted successfully',
  },

  // Reviews
  REVIEW_CREATED: {
    es: 'Resena publicada exitosamente',
    en: 'Review published successfully',
  },
  REVIEW_UPDATED: {
    es: 'Resena actualizada exitosamente',
    en: 'Review updated successfully',
  },
  REVIEW_DELETED: {
    es: 'Resena eliminada exitosamente',
    en: 'Review deleted successfully',
  },

  // Bundles
  BUNDLE_CREATED: {
    es: 'Bundle creado exitosamente',
    en: 'Bundle created successfully',
  },
  BUNDLE_UPDATED: {
    es: 'Bundle actualizado exitosamente',
    en: 'Bundle updated successfully',
  },
  BUNDLE_DELETED: {
    es: 'Bundle eliminado exitosamente',
    en: 'Bundle deleted successfully',
  },

  // Digital products
  DOWNLOAD_STARTED: {
    es: 'Descarga iniciada',
    en: 'Download started',
  },
  DOWNLOAD_URL_GENERATED: {
    es: 'URL de descarga generada exitosamente',
    en: 'Download URL generated successfully',
  },

  // Images
  IMAGE_UPLOADED: {
    es: 'Imagen subida exitosamente',
    en: 'Image uploaded successfully',
  },
  IMAGE_DELETED: {
    es: 'Imagen eliminada exitosamente',
    en: 'Image deleted successfully',
  },
  IMAGES_REORDERED: {
    es: 'Imagenes reordenadas exitosamente',
    en: 'Images reordered successfully',
  },

  // Variants
  VARIANT_CREATED: {
    es: 'Variante creada exitosamente',
    en: 'Variant created successfully',
  },
  VARIANT_UPDATED: {
    es: 'Variante actualizada exitosamente',
    en: 'Variant updated successfully',
  },
  VARIANT_DELETED: {
    es: 'Variante eliminada exitosamente',
    en: 'Variant deleted successfully',
  },

  // Attributes
  ATTRIBUTE_CREATED: {
    es: 'Atributo creado exitosamente',
    en: 'Attribute created successfully',
  },
  ATTRIBUTE_UPDATED: {
    es: 'Atributo actualizado exitosamente',
    en: 'Attribute updated successfully',
  },
  ATTRIBUTE_DELETED: {
    es: 'Atributo eliminado exitosamente',
    en: 'Attribute deleted successfully',
  },
} as const;

/**
 * Error Messages
 *
 * Messages displayed when product operations fail
 */
export const PRODUCT_ERROR_MESSAGES = {
  // General
  GENERIC_ERROR: {
    es: 'Ocurrio un error. Por favor intenta nuevamente',
    en: 'An error occurred. Please try again',
  },
  NOT_FOUND: {
    es: 'Producto no encontrado',
    en: 'Product not found',
  },
  UNAUTHORIZED: {
    es: 'No tienes permiso para realizar esta accion',
    en: 'You do not have permission to perform this action',
  },
  NOT_AUTHENTICATED: {
    es: 'Usuario no autenticado',
    en: 'User not authenticated',
  },

  // Product operations
  CREATE_FAILED: {
    es: 'Error al crear el producto',
    en: 'Failed to create product',
  },
  UPDATE_FAILED: {
    es: 'Error al actualizar el producto',
    en: 'Failed to update product',
  },
  DELETE_FAILED: {
    es: 'Error al eliminar el producto',
    en: 'Failed to delete product',
  },
  DELETE_PERMISSION_DENIED: {
    es: 'Producto no encontrado o no tienes permiso para eliminarlo',
    en: 'Product not found or you do not have permission to delete it',
  },

  // Bulk operations
  BULK_NO_SELECTION: {
    es: 'Debes seleccionar al menos un producto',
    en: 'You must select at least one product',
  },
  BULK_OPERATION_INVALID: {
    es: 'Operacion no valida',
    en: 'Invalid operation',
  },
  BULK_OPERATION_FAILED: {
    es: 'Error al procesar la operacion en lote',
    en: 'Failed to process bulk operation',
  },

  // Subscription limits
  ATTRIBUTE_LIMIT_FREE: {
    es: 'Has alcanzado el limite de 5 atributos para cuentas FREE. Actualiza a PRO para hasta 50 atributos.',
    en: 'You have reached the 5 attribute limit for FREE accounts. Upgrade to PRO for up to 50 attributes.',
  },
  ATTRIBUTE_LIMIT_PRO: {
    es: 'Has alcanzado el limite de 50 atributos para cuentas PRO. Actualiza a ENTERPRISE para atributos ilimitados.',
    en: 'You have reached the 50 attribute limit for PRO accounts. Upgrade to ENTERPRISE for unlimited attributes.',
  },
  ATTRIBUTE_LIMIT_EXCEEDED: {
    es: 'Has excedido el limite de atributos',
    en: 'You have exceeded the attribute limit',
  },

  // Inventory
  INVENTORY_UPDATE_FAILED: {
    es: 'Error al actualizar el inventario',
    en: 'Failed to update inventory',
  },
  INVENTORY_NOT_FOUND: {
    es: 'Registro de inventario no encontrado',
    en: 'Inventory record not found',
  },
  NEGATIVE_QUANTITY: {
    es: 'La cantidad no puede ser negativa',
    en: 'Quantity cannot be negative',
  },

  // Reviews
  REVIEW_CREATE_FAILED: {
    es: 'Error al publicar la resena',
    en: 'Failed to publish review',
  },
  REVIEW_NOT_FOUND: {
    es: 'Resena no encontrada',
    en: 'Review not found',
  },
  REVIEW_ALREADY_EXISTS: {
    es: 'Ya has dejado una resena para este producto en esta orden',
    en: 'You have already left a review for this product in this order',
  },
  REVIEW_PURCHASE_REQUIRED: {
    es: 'Debes comprar este producto para dejar una resena',
    en: 'You must purchase this product to leave a review',
  },
  REVIEW_UNAUTHORIZED: {
    es: 'No tienes permiso para modificar esta resena',
    en: 'You do not have permission to modify this review',
  },

  // Bundles
  BUNDLE_CREATE_FAILED: {
    es: 'Error al crear el bundle',
    en: 'Failed to create bundle',
  },
  BUNDLE_NOT_FOUND: {
    es: 'Bundle no encontrado',
    en: 'Bundle not found',
  },
  BUNDLE_MIN_PRODUCTS: {
    es: 'El bundle debe tener al menos 2 productos',
    en: 'Bundle must have at least 2 products',
  },
  BUNDLE_PRODUCT_NOT_FOUND: {
    es: 'Uno o mas productos del bundle no fueron encontrados',
    en: 'One or more products in the bundle were not found',
  },

  // Digital products
  DOWNLOAD_EXPIRED: {
    es: 'El enlace de descarga ha expirado',
    en: 'The download link has expired',
  },
  DOWNLOAD_LIMIT_REACHED: {
    es: 'Has alcanzado el limite de descargas para este producto',
    en: 'You have reached the download limit for this product',
  },
  DOWNLOAD_NOT_AVAILABLE: {
    es: 'La descarga no esta disponible',
    en: 'Download is not available',
  },
  DIGITAL_PRODUCT_NOT_FOUND: {
    es: 'Producto digital no encontrado',
    en: 'Digital product not found',
  },

  // Images
  IMAGE_UPLOAD_FAILED: {
    es: 'Error al subir la imagen',
    en: 'Failed to upload image',
  },
  IMAGE_DELETE_FAILED: {
    es: 'Error al eliminar la imagen',
    en: 'Failed to delete image',
  },
  IMAGE_NOT_FOUND: {
    es: 'Imagen no encontrada',
    en: 'Image not found',
  },
  SINGLE_PRIMARY_IMAGE: {
    es: 'Solo puede haber una imagen primaria',
    en: 'There can only be one primary image',
  },

  // Variants
  VARIANT_CREATE_FAILED: {
    es: 'Error al crear la variante',
    en: 'Failed to create variant',
  },
  VARIANT_NOT_FOUND: {
    es: 'Variante no encontrada',
    en: 'Variant not found',
  },
  VARIANT_SKU_EXISTS: {
    es: 'Ya existe una variante con este SKU',
    en: 'A variant with this SKU already exists',
  },
  VARIANT_IN_ORDER: {
    es: 'No se puede eliminar la variante porque esta en una orden activa',
    en: 'Cannot delete variant because it is in an active order',
  },

  // Attributes
  ATTRIBUTE_CREATE_FAILED: {
    es: 'Error al crear el atributo',
    en: 'Failed to create attribute',
  },
  ATTRIBUTE_NOT_FOUND: {
    es: 'Atributo no encontrado',
    en: 'Attribute not found',
  },
  ATTRIBUTE_IN_USE: {
    es: 'No se puede eliminar el atributo porque esta en uso por variantes',
    en: 'Cannot delete attribute because it is in use by variants',
  },

  // Slug
  SLUG_EXISTS: {
    es: 'Ya existe un producto con este slug en tu tienda',
    en: 'A product with this slug already exists in your store',
  },
} as const;

/**
 * Validation Messages
 *
 * Messages used in form validation
 * These complement the Yup schema messages and can be referenced
 * for consistency across the application
 */
export const PRODUCT_VALIDATION_MESSAGES = {
  // Required fields
  NAME_REQUIRED: {
    es: 'El nombre del producto es obligatorio',
    en: 'Product name is required',
  },
  SLUG_REQUIRED: {
    es: 'El slug es obligatorio',
    en: 'Slug is required',
  },
  SKU_REQUIRED: {
    es: 'El SKU es obligatorio',
    en: 'SKU is required',
  },
  PRICE_REQUIRED: {
    es: 'El precio es obligatorio',
    en: 'Price is required',
  },
  RATING_REQUIRED: {
    es: 'La calificacion es obligatoria',
    en: 'Rating is required',
  },
  REVIEW_TITLE_REQUIRED: {
    es: 'El titulo es obligatorio',
    en: 'Title is required',
  },

  // Name validation
  NAME_MIN_LENGTH: {
    es: 'El nombre es obligatorio',
    en: 'Name is required',
  },
  NAME_MAX_LENGTH: {
    es: 'El nombre no puede exceder 200 caracteres',
    en: 'Name cannot exceed 200 characters',
  },

  // Description validation
  DESCRIPTION_MAX_LENGTH: {
    es: 'La descripcion no puede exceder 2000 caracteres',
    en: 'Description cannot exceed 2000 characters',
  },

  // Slug validation
  SLUG_FORMAT: {
    es: 'El slug solo puede contener letras minusculas, numeros y guiones',
    en: 'Slug can only contain lowercase letters, numbers, and hyphens',
  },
  SLUG_MAX_LENGTH: {
    es: 'El slug no puede exceder 100 caracteres',
    en: 'Slug cannot exceed 100 characters',
  },

  // Brand validation
  BRAND_MAX_LENGTH: {
    es: 'La marca no puede exceder 100 caracteres',
    en: 'Brand cannot exceed 100 characters',
  },

  // SEO validation
  SEO_TITLE_MAX_LENGTH: {
    es: 'El titulo SEO no puede exceder 60 caracteres',
    en: 'SEO title cannot exceed 60 characters',
  },
  SEO_DESCRIPTION_MAX_LENGTH: {
    es: 'La descripcion SEO no puede exceder 160 caracteres',
    en: 'SEO description cannot exceed 160 characters',
  },

  // Price validation
  PRICE_TYPE_ERROR: {
    es: 'El precio debe ser un numero',
    en: 'Price must be a number',
  },
  PRICE_POSITIVE: {
    es: 'El precio debe ser mayor a 0',
    en: 'Price must be greater than 0',
  },
  PRICE_MAX: {
    es: 'El precio no puede exceder 999,999.99',
    en: 'Price cannot exceed 999,999.99',
  },
  PROMOTIONAL_PRICE_LESS_THAN_REGULAR: {
    es: 'El precio promocional debe ser menor al precio regular',
    en: 'Promotional price must be less than regular price',
  },

  // SKU validation
  SKU_FORMAT: {
    es: 'El SKU solo puede contener mayusculas, numeros y guiones',
    en: 'SKU can only contain uppercase letters, numbers, and hyphens',
  },
  SKU_MAX_LENGTH: {
    es: 'El SKU no puede exceder 50 caracteres',
    en: 'SKU cannot exceed 50 characters',
  },

  // Quantity validation
  QUANTITY_TYPE_ERROR: {
    es: 'La cantidad debe ser un numero',
    en: 'Quantity must be a number',
  },
  QUANTITY_INTEGER: {
    es: 'La cantidad debe ser un numero entero',
    en: 'Quantity must be a whole number',
  },
  QUANTITY_MIN: {
    es: 'La cantidad no puede ser negativa',
    en: 'Quantity cannot be negative',
  },

  // Threshold validation
  THRESHOLD_TYPE_ERROR: {
    es: 'El umbral debe ser un numero',
    en: 'Threshold must be a number',
  },
  THRESHOLD_INTEGER: {
    es: 'El umbral debe ser un numero entero',
    en: 'Threshold must be a whole number',
  },
  THRESHOLD_MIN: {
    es: 'El umbral no puede ser negativo',
    en: 'Threshold cannot be negative',
  },

  // Rating validation
  RATING_TYPE_ERROR: {
    es: 'La calificacion debe ser un numero',
    en: 'Rating must be a number',
  },
  RATING_INTEGER: {
    es: 'La calificacion debe ser un numero entero',
    en: 'Rating must be a whole number',
  },
  RATING_MIN: {
    es: 'La calificacion minima es 1',
    en: 'Minimum rating is 1',
  },
  RATING_MAX: {
    es: 'La calificacion maxima es 5',
    en: 'Maximum rating is 5',
  },

  // Review validation
  REVIEW_TITLE_MAX_LENGTH: {
    es: 'El titulo no puede exceder 100 caracteres',
    en: 'Title cannot exceed 100 characters',
  },
  REVIEW_BODY_MAX_LENGTH: {
    es: 'El comentario no puede exceder 2000 caracteres',
    en: 'Review body cannot exceed 2000 characters',
  },

  // URL validation
  URL_INVALID: {
    es: 'URL invalida',
    en: 'Invalid URL',
  },
  IMAGE_URL_REQUIRED: {
    es: 'La URL de la imagen es obligatoria',
    en: 'Image URL is required',
  },
  DOWNLOAD_URL_REQUIRED: {
    es: 'La URL de descarga es obligatoria',
    en: 'Download URL is required',
  },

  // Image validation
  IMAGE_ALT_MAX_LENGTH: {
    es: 'El texto alt no puede exceder 200 caracteres',
    en: 'Alt text cannot exceed 200 characters',
  },
  IMAGE_MIN_REQUIRED: {
    es: 'Debes agregar al menos una imagen',
    en: 'You must add at least one image',
  },

  // Variant validation
  VARIANT_ATTRIBUTE_REQUIRED: {
    es: 'La variante debe tener al menos un valor de atributo',
    en: 'Variant must have at least one attribute value',
  },
  ATTRIBUTE_VALUE_REQUIRED: {
    es: 'El ID del valor de atributo es obligatorio',
    en: 'Attribute value ID is required',
  },

  // Attribute validation
  ATTRIBUTE_NAME_REQUIRED: {
    es: 'El nombre del atributo es obligatorio',
    en: 'Attribute name is required',
  },
  ATTRIBUTE_TYPE_REQUIRED: {
    es: 'El tipo de atributo es obligatorio',
    en: 'Attribute type is required',
  },
  ATTRIBUTE_TYPE_INVALID: {
    es: 'Tipo de atributo invalido',
    en: 'Invalid attribute type',
  },
  ATTRIBUTE_VALUE_MIN: {
    es: 'El atributo debe tener al menos un valor',
    en: 'Attribute must have at least one value',
  },
  ATTRIBUTE_VALUE_EMPTY: {
    es: 'El valor no puede estar vacio',
    en: 'Value cannot be empty',
  },

  // Digital product validation
  DIGITAL_FIELDS_REQUIRED: {
    es: 'Los campos del producto digital son obligatorios',
    en: 'Digital product fields are required',
  },
  FILE_SIZE_REQUIRED: {
    es: 'El tamano del archivo es obligatorio',
    en: 'File size is required',
  },
  FILE_TYPE_INVALID: {
    es: 'Tipo de archivo invalido',
    en: 'Invalid file type',
  },

  // Bundle validation
  BUNDLE_NAME_REQUIRED: {
    es: 'El nombre del bundle es obligatorio',
    en: 'Bundle name is required',
  },
  BUNDLE_PRICE_REQUIRED: {
    es: 'El precio del bundle es obligatorio',
    en: 'Bundle price is required',
  },
  BUNDLE_MIN_ITEMS: {
    es: 'El bundle debe tener al menos 2 productos',
    en: 'Bundle must have at least 2 products',
  },
  BUNDLE_PRODUCT_ID_REQUIRED: {
    es: 'El ID del producto es obligatorio',
    en: 'Product ID is required',
  },

  // Status validation
  STATUS_INVALID: {
    es: 'Estado de producto invalido',
    en: 'Invalid product status',
  },
} as const;

/**
 * Inventory Status Messages
 *
 * Messages for inventory state display
 */
export const INVENTORY_STATUS_MESSAGES = {
  IN_STOCK: {
    es: 'En stock',
    en: 'In stock',
  },
  LOW_STOCK: {
    es: 'Stock bajo',
    en: 'Low stock',
  },
  OUT_OF_STOCK: {
    es: 'Agotado',
    en: 'Out of stock',
  },
  UNITS_AVAILABLE: {
    es: 'unidades disponibles',
    en: 'units available',
  },
  UNITS_REMAINING: {
    es: 'unidades restantes',
    en: 'units remaining',
  },
} as const;

/**
 * Product Status Messages
 *
 * Messages for product status display
 */
export const PRODUCT_STATUS_MESSAGES = {
  ACTIVE: {
    es: 'Activo',
    en: 'Active',
  },
  DRAFT: {
    es: 'Borrador',
    en: 'Draft',
  },
  ARCHIVED: {
    es: 'Archivado',
    en: 'Archived',
  },
} as const;

/**
 * UI Messages
 *
 * Messages for product-related UI elements
 */
export const PRODUCT_UI_MESSAGES = {
  // Pricing
  STARTING_AT: {
    es: 'Desde',
    en: 'Starting at',
  },
  REGULAR_PRICE: {
    es: 'Precio regular',
    en: 'Regular price',
  },
  PROMOTIONAL_PRICE: {
    es: 'Precio promocional',
    en: 'Promotional price',
  },
  SAVE: {
    es: 'Ahorra',
    en: 'Save',
  },

  // Product badges
  FEATURED: {
    es: 'Destacado',
    en: 'Featured',
  },
  NEW: {
    es: 'Nuevo',
    en: 'New',
  },
  ON_SALE: {
    es: 'En oferta',
    en: 'On sale',
  },
  DIGITAL: {
    es: 'Digital',
    en: 'Digital',
  },

  // Reviews
  NO_REVIEWS: {
    es: 'Sin resenas',
    en: 'No reviews',
  },
  REVIEWS_COUNT: {
    es: 'resenas',
    en: 'reviews',
  },
  AVERAGE_RATING: {
    es: 'Calificacion promedio',
    en: 'Average rating',
  },
  WRITE_REVIEW: {
    es: 'Escribe una resena',
    en: 'Write a review',
  },

  // Actions
  ADD_TO_CART: {
    es: 'Agregar al carrito',
    en: 'Add to cart',
  },
  BUY_NOW: {
    es: 'Comprar ahora',
    en: 'Buy now',
  },
  VIEW_DETAILS: {
    es: 'Ver detalles',
    en: 'View details',
  },
  DOWNLOAD: {
    es: 'Descargar',
    en: 'Download',
  },

  // Variants
  SELECT_OPTIONS: {
    es: 'Selecciona opciones',
    en: 'Select options',
  },
  SELECT_VARIANT: {
    es: 'Selecciona una variante',
    en: 'Select a variant',
  },

  // Form steps
  STEP_BASIC_INFO: {
    es: 'Informacion basica',
    en: 'Basic information',
  },
  STEP_MEDIA: {
    es: 'Imagenes',
    en: 'Images',
  },
  STEP_OPTIONS_VARIANTS: {
    es: 'Opciones y variantes',
    en: 'Options and variants',
  },
  STEP_TYPE_SPECIFIC: {
    es: 'Tipo de producto',
    en: 'Product type',
  },
  STEP_CONFIGURATIONS: {
    es: 'Configuracion',
    en: 'Configuration',
  },

  // Empty states
  NO_PRODUCTS: {
    es: 'No hay productos',
    en: 'No products',
  },
  NO_PRODUCTS_DESCRIPTION: {
    es: 'Crea tu primer producto para comenzar',
    en: 'Create your first product to get started',
  },
  NO_VARIANTS: {
    es: 'No hay variantes',
    en: 'No variants',
  },
  NO_IMAGES: {
    es: 'No hay imagenes',
    en: 'No images',
  },

  // Confirmations
  CONFIRM_DELETE: {
    es: 'Estas seguro de que deseas eliminar este producto?',
    en: 'Are you sure you want to delete this product?',
  },
  CONFIRM_DELETE_BULK: {
    es: 'Estas seguro de que deseas eliminar los productos seleccionados?',
    en: 'Are you sure you want to delete the selected products?',
  },
  CONFIRM_ARCHIVE: {
    es: 'Estas seguro de que deseas archivar este producto?',
    en: 'Are you sure you want to archive this product?',
  },
  DELETE_WARNING: {
    es: 'Esta accion no se puede deshacer.',
    en: 'This action cannot be undone.',
  },
} as const;

/**
 * Combined PRODUCT_MESSAGES export
 *
 * Single object containing all product-related messages for easy import
 */
export const PRODUCT_MESSAGES = {
  SUCCESS: PRODUCT_SUCCESS_MESSAGES,
  ERROR: PRODUCT_ERROR_MESSAGES,
  VALIDATION: PRODUCT_VALIDATION_MESSAGES,
  INVENTORY_STATUS: INVENTORY_STATUS_MESSAGES,
  PRODUCT_STATUS: PRODUCT_STATUS_MESSAGES,
  UI: PRODUCT_UI_MESSAGES,
} as const;

/**
 * Helper function to get message in specific language
 *
 * @param messageObj - Message object with language keys
 * @param locale - Language code ('es' or 'en')
 * @returns Translated message
 */
export function getProductMessage(
  messageObj: { es: string; en: string },
  locale: 'es' | 'en' = 'es'
): string {
  return messageObj[locale];
}

/**
 * Helper function to format bulk operation message with count
 *
 * @param count - Number of affected items
 * @param messageObj - Message object with language keys
 * @param locale - Language code ('es' or 'en')
 * @returns Formatted message with count
 */
export function formatBulkMessage(
  count: number,
  messageObj: { es: string; en: string },
  locale: 'es' | 'en' = 'es'
): string {
  return `${count} ${messageObj[locale]}`;
}
