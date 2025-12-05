import { Category, Product, ProductVariant, StoreCustomization, Store, ProductMedia, /* ProductVariantStock, */ Branch, VariantStock } from "@prisma/client";

import { DeferredFile } from "@/features/global/types/media";
import { ProductWithRelations } from "@/features/products/types/products-by-store.types"

// Main product types
export type GetProductDetailsReturn = {
    message: string;
    payload: (Product & {
        categories: Category[];
        store: {
            id: number;
            name: string;
            subdomain: string;
            customization: StoreCustomization | null;
        };
        variants?: (ProductVariant & { color: ProductColor | null })[];
    }) | null
    error: boolean
}

// Product color type
export type ProductColor = {
    id: string
    name: string
    hex: string
}

// Form and section data types
export type CategoryValue = { value: string; label: string }

export type MediaSectionData = {
    files: File[]
     urls?: string[]
    primaryIndex: number | null
}

export type CategoriesSectionData = {
    categories: CategoryValue[]
}

export type SizesSectionData = {
    isUniqueSize: boolean
    sizes: { label: string; value: string; group?: string }[]
    measures?: { label: string; value: string; group?: string }[]
}

export type ColorsSectionData = {
    colors: ProductColor[]
}

export type SettingsSectionData = {
    isActive: boolean
    isFeatured: boolean
    isPublished: boolean
}

export type DimensionsSectionData = {
    height?: number
    heightUnit?: string
    width?: number
    widthUnit?: string
    depth?: number
    depthUnit?: string
    diameter?: number
    diameterUnit?: string
    weight?: number
    weightUnit?: string
}

export type TFunction = (key: string, values?: Record<string, string | number | boolean | Date | undefined>) => string

export type VariantPreview = {
    id: string
    size?: string
    color?: ProductColor
}

// Component prop types
export type CreateProductButtonProps = {
    storeId: number
    userId: number
    onlyIcon?: boolean
}

// Discriminated union types for unified component
type WithStoreId = {
    storeId?: number
    userId: number
    onlyIcon?: boolean
}

type WithStoreSelection = {
    userId: number
    stores: Store[]
    onlyIcon?: boolean
}

export type UnifiedCreateProductButtonProps = WithStoreId | WithStoreSelection

export type DeleteProductButtonProps = {
    productId: number
    slug: string
    onComplete?: () => void
    userId: number
}

export type EditProductButtonProps = {
    product: Product & { categories: Category[] }
    slug: string
    onComplete?: () => void
    userId: number
}

export type ProductCardProps = {
    product: Product
    slug: string
}

export type ProductDetailPageProps = {
    params: Promise<{ slug: string, id: string }>
}

// Action payload types
export type InsertProductPayload = {
    name: string
    price: number
    stock: number
    description?: string
    categories: CategoryValue[]
    image?: File
    is_active?: boolean
    is_featured?: boolean
    is_published?: boolean
}

export type UpdateProductPayload = {
    name: string
    price: number
    stock: number
    description?: string
    categories: CategoryValue[]
    image?: File
    is_active?: boolean
    is_featured?: boolean
    is_published?: boolean
}

// (Consolidated alias) Keep a single canonical name
export type CreateUnifiedProductArgs = {
    form: {
        name: string
        slug?: string
        description?: string
        price: number
        stock: number
        categories: { label: string; value: string }[]
        images?: File[]
        [key: string]: unknown
    }
    media?: { files: File[]; primaryIndex: number | null }
    categories?: { categories: { label: string; value: string }[] }
    sizes?: { isUniqueSize: boolean; sizes: { label: string; value: string }[]; measures?: { label: string; value: string; group?: string }[] }
    colors?: { colors: { id: string; name: string; rgba: [number, number, number, number] }[] }
    dimensions?: { [key: string]: unknown }
    settings?: { isActive: boolean; isFeatured: boolean; isPublished: boolean }
    variants?: { id: string; sizeOrMeasure?: string; color?: { id: string; name: string; rgba: [number, number, number, number] } }[]
    targetStoreId: number
    userId: number
}

// (Consolidated) Use UpdatePricesPayload

// Data layer types
export type CreateStoreColorArgs = { name: string; hex: string }

export type DistributeStockData = {
    productId: number
    distributions: {
        branchId: number
        quantity: number
    }[]
}

export type VariantBranch = { id: number; name: string }

export type UnifiedArgs = CreateUnifiedProductArgs

export type UpdatePricesPayload = {
    storeId: number
    amount: number
    updateType: "fijo" | "porcentaje"
    productIds?: number[]
    categoryId?: number
}

// Utils: payload mapping helpers
export type FormValues = {
    name: string
    slug?: string
    description?: string
    price: number
    stock: number
    categories: { label: string; value: string }[]
    images?: File[]
    [key: string]: unknown
}

export type SectionRefs = {
    media?: { files: File[]; primaryIndex: number | null }
    categories?: { categories: { label: string; value: string }[] }
    sizes?: { isUniqueSize: boolean; sizes: { label: string; value: string }[]; measures?: { label: string; value: string; group?: string }[] }
    colors?: { colors: ProductColor[] }
    dimensions?: { [key: string]: unknown }
    settings?: { isActive: boolean; isFeatured: boolean; isPublished: boolean }
    variants?: { id: string; sizeOrMeasure?: string; color?: ProductColor }[]
}

// Create form Sections - Props
export type BasicInfoDefaults = {
    name?: string
    slug?: string
    description?: string
    sku?: string
    barcode?: string
}

export type BasicInfoSectionProps = { defaults?: BasicInfoDefaults }

export type CategoriesSectionProps = {
    storeId?: number
    value?: CategoriesSectionData
    onChange?: (data: CategoriesSectionData) => void
}

export type ColorsSectionProps = {
    value?: ColorsSectionData
    onChange?: (data: ColorsSectionData) => void
}

export type DimensionsSectionProps = { onChange?: (data: DimensionsSectionData) => void }

export interface MediaSectionProps {
    value?: {
        urls?: string[]      // ✅ Cambiar de files a urls
        primaryIndex?: number | null
    }
    onChange?: (value: { urls: string[]; primaryIndex: number | null }) => void
    onFileReject?: (file: File, message: string) => void
}

export type PriceStockSectionDefaults = { price?: number | string; stock?: number | string }
export type PriceStockSectionProps = { defaults?: PriceStockSectionDefaults }

export type SettingsSectionProps = {
    value?: SettingsSectionData
    onChange?: (data: SettingsSectionData) => void
}

export type SizesSectionProps = {
    value?: SizesSectionData
    onChange?: (data: SizesSectionData) => void
}

export type VariantsEditorProps = {
    variant: VariantPreview
    onClose: () => void
}

export type VariantsPreviewSectionProps = {
    onEditVariant?: (v: VariantPreview) => void
}

// Component props - product detail display
export type BasicInfoDisplayProps = {
    product: Product
    slug: string
    userId: number
}

export type BasicInfoFormValues = Pick<Product, 'name' | 'description' | 'slug'>

export type CategoriesDisplayProps = {
    product: Product & { categories: Category[] }
}

export type DimensionsDisplayProps = {
    product: Product
}

export type MediaDisplayProps = {
    product: Product & {
        media?: { id: number; url: string; type: string }[]
        primary_media?: { id: number; url: string; type: string } | null
    }
}

export type PriceStockDisplayProps = {
    product: Product
    slug: string
    userId: number
}

export type PriceStockFormValues = Pick<ProductWithAllRelations, "variants">

export type ProductDetailFormProps = {
    product: Product & {
        categories: Category[]
        variants: (ProductVariant & {
            color?: { name: string } | null
            stocks?: { quantity: number }[]
            primary_media?: { url: string } | null
            price?: number | null
            size_or_measure?: string | null
        })[]
        media?: { id: number; url: string; type: string }[]
        primary_media?: { id: number; url: string; type: string } | null
    }
    slug: string
    userId: number
}

export type SettingsDisplayProps = {
    product: Product
}

export type VariantsDisplayProps = {
    product: Product & {
        variants: (ProductVariant & {
            color?: { name: string } | null
            stocks?: { quantity: number }[]
            primary_media?: { url: string } | null
        })[]
    }
    slug: string
    userId: number
}

// Variant detail components - shared types
export type ValidatedCardProps = {
    keys: string[]
    completeKeys?: string[]
    children: React.ReactNode
    className?: string
}

export type VariantDisplayBaseProps = { variant: ProductVariant }

export type VariantBasicInfoDisplayProps = VariantDisplayBaseProps & {
    variant: VariantWithColor
    slug: string
    productId: number
    product: ProductWithVariants
}

export type VariantColorDisplayProps = VariantDisplayBaseProps & {
    variant: VariantWithColor
    product: ProductCommon
}

export type VariantConfigDisplayProps = VariantDisplayBaseProps & {
    product: ProductWithVariants
}

export type VariantDetailFormProps = {
    variant: VariantFull
    productPrice: number
    slug: string
    productId: number
    product: ProductWithMedia & ProductWithVariants
}

export type VariantDimensionsDisplayProps = VariantDisplayBaseProps & {
    product: ProductDimensions
}

export type VariantLinkCardProps = {
    variant: VariantFull  // ✅ Usa el tipo completo que ya está definido
    slug: string
    productId: string | number
    productPrice?: number
}

export type VariantMediaDisplayProps = {
    variant: VariantWithMedia
    product: ProductWithMedia
}

export type VariantPriceDisplayProps = VariantDisplayBaseProps & { productPrice: number }

export type VariantPriceFormValues = {
    "variant-price"?: string
}

export type VariantSizesDisplayProps = VariantDisplayBaseProps & { product: ProductDimensions }

export type VariantStockDisplayProps = VariantDisplayBaseProps & {
    variant: VariantWithStock & { stocks?: (StockInfo & { branch?: { id: number; name: string } })[] }
}

export type VariantStockFormValues = {
    stock: number
}
// Profile components
export type ProductSkeletonGridProps = {
    count?: number
}

// Variant update payloads
export type UpdateVariantBasicInfoPayload = {
    name: string | null
    sku: string | null
    barcode: string | null
    description: string | null
}

export type UpdateVariantDimensionsPayload = {
    weight?: number | null
    weight_unit?: string | null
    height?: number | null
    height_unit?: string | null
    width?: number | null
    width_unit?: string | null
    depth?: number | null
    depth_unit?: string | null
    diameter?: number | null
    diameter_unit?: string | null
}

export type UpdateVariantFlagsPayload = {
    is_active: boolean
    is_published: boolean
    is_featured: boolean
}

export type UpdateVariantMediaPayload = {
    primary_media_id?: number | null
    files?: File[]
}

export type UpdateVariantPricePayload = {
    price: number | null
}

export type UpdateVariantSizesPayload = {
    size: string | null
    measure: string | null
}

export type VariantStockUpdate = { branch_id: number; quantity: number }

// =====================
// Base reusable types
// =====================

// Utility primitives
export type LabelValue = { label: string; value: string }
export type StockInfo = { quantity: number; branch_id: number; branch?: { id: number; name: string } }
export type ColorRGBA = [number, number, number, number]

// Common Prisma relation shapes
export type ProductWithMedia = Product & {
    media?: ProductMedia[]
    primary_media?: ProductMedia | null
}

export type VariantWithColor = ProductVariant & { color?: ProductColor | null }

export type VariantWithStock = ProductVariant & {
    stocks?: StockInfo[]
}

export type VariantWithMedia = ProductVariant & {
    primary_media?: ProductMedia | null
    media?: ProductMedia[]
}

// Composed relations
export type VariantFull = VariantWithColor & VariantWithStock & VariantWithMedia

export type ProductWithVariants = Product & {
    variants: VariantFull[]
}

export type ProductWithAllRelations = ProductWithMedia & ProductWithVariants & {
    categories: Category[]
}

// Consolidated product shape for UI components
export type ProductCommon = Product & {
    media?: ProductMedia[]
    primary_media?: ProductMedia | null
    variants?: VariantFull[]
    categories?: Category[]
    available_colors?: ProductColor[]
}

// =====================
// Top-level components props/types
// =====================

export type LikeButtonProps = { productId: number }

export type DistributeStockButtonProps = {
    productId: number
    productName: string
    availableStock: number
    branches: (Branch & { stock_items: VariantStock[] })[]
    variantStocks?: { branch_id: number; quantity: number }[]
}

export type CreateColorInlineProps = {
    onCreated?: (color: { id: number; name: string; hex: string }) => void
}

export type EmployeePermissions = {
    isAdmin: boolean
    permissions?: {
        can_create_orders: boolean
        can_update_orders: boolean
        can_create_products: boolean
        can_update_products: boolean
        can_manage_stock: boolean
        can_process_refunds: boolean
        can_view_reports: boolean
        can_manage_employees: boolean
        can_manage_store: boolean
    }
}


export type ProductsTableProps = {
    storeId: number
    userId: number
    slug: string
    employeePermissions: EmployeePermissions
    branches: (Branch & { stock_items: VariantStock[] })[]
    headerActions?: React.ReactNode
}

export type ProductsTableWrapperProps = {
    limit: number
    orderBy: string
    page: number
    search: string
    storeId?: number
    slug?: string
    subdomain?: string
    userId: number
    employeePermissions: EmployeePermissions
    branches: (Branch & { stock_items: VariantStock[] })[]
    headerActions?: React.ReactNode
}

export type ProductsTableVariantRow = ProductWithRelations & { 
    row_id: string
    variant_id?: number
    variant_label?: string
    stock: number
    variant_price?: number
}

export type MinimalUser = {
    id: number
    email: string
    first_name?: string | null
    last_name?: string | null
}

export type LikeButtonClientProps = {
    productId: number
    user: MinimalUser | null
    initialLiked: boolean
    initialCount: number
}

export type DeleteVariantButtonProps = {
    variantId: number
    slug: string
    productId: number
    onlyIcon?: boolean
}

export type AddToCartButtonProps = {
    product: Product
    withText?: boolean
    className?: string
    canBeAddedToCart: boolean
    overrideId?: string | number
    overrideName?: string
    overridePrice?: number
    overrideImage?: string
}

export type ProductComment = {
    id: number
    content: string
    created_at: Date
    users: {
        id: number
        first_name?: string | null
        last_name?: string | null
        email: string
    }
}

export type CommentsClientProps = {
    productId: number
    user: MinimalUser | null
    initialComments: ProductComment[]
}

export type CommentsProps = { productId: number }

export type ExportProductsButtonProps = {
    data: (Product & { categories: Category[] })[]
    onlyIcon?: boolean
}

export type GridCardProps = {
    product: Product
    href: string
}

export type ListCardProps = {
    product: Product
    href: string
}

export type ProductCardContainerProps = {
    listCard: React.ReactNode
    gridCard: React.ReactNode
}

export type ProductListContainerProps = { children: React.ReactNode }

export type RelatedProductsProps = { productId: number }

// =====================
// Dimension aliases via Pick<PrismaModel>
// =====================

export type ProductDimensions = Pick<
    ProductWithVariants,
    | 'variants'
>

export type VariantDimensions = Pick<
    ProductVariant,
    | 'height' | 'height_unit'
    | 'width' | 'width_unit'
    | 'depth' | 'depth_unit'
    | 'diameter' | 'diameter_unit'
    | 'weight' | 'weight_unit'
>

export type EditProductPayload = {
    name: string
    price: number
    stock: number
    description?: string
    categories: CategoryValue[]
    image?: File
    is_active?: boolean
    is_featured?: boolean
    is_published?: boolean
}

export interface ProductMediaSelectorProps {
  value?: DeferredFile[]
  onChange?: (files: DeferredFile[]) => void
  maxFiles?: number
}