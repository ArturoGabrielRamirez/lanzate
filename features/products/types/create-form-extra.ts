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
    colors: import("./product-color").ProductColor[]
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
    color?: import("./product-color").ProductColor
}


