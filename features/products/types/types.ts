import { Category, Color, Product, ProductVariant, StoreCustomization, Store } from "@prisma/client";

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
        variants?: (ProductVariant & { color: Color | null })[];
    }) | null;
    error: boolean;
};

// Product color type
export type ProductColor = {
    id: string
    name: string
    rgba: [number, number, number, number]
}

// Form and section data types
export type CategoryValue = { value: string; label: string }

export type MediaSectionData = {
    files: File[]
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

export type UpdatePricesActionPayload = {
    storeId: number
    amount: number
    updateType: "fijo" | "porcentaje"
    productIds?: number[]
    categoryId?: number
}

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

export type UnifiedArgs = {
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
    variants?: { id: string; size?: string; measure?: string; color?: { id: string; name: string; rgba: [number, number, number, number] } }[]
    targetStoreId: number
    userId: number
}

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