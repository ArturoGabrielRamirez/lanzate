import { CreateUnifiedProductArgs, ProductColor } from "@/features/products/types"

type FormValues = {
    name: string
    slug?: string
    description?: string
    price: number
    stock: number
    categories: { label: string; value: string }[]
    images?: File[]
    [key: string]: unknown
}

type SectionRefs = {
    media?: { files: File[]; primaryIndex: number | null }
    categories?: { categories: { label: string; value: string }[] }
    sizes?: { isUniqueSize: boolean; sizes: { label: string; value: string }[]; measures?: { label: string; value: string; group?: string }[] }
    colors?: { colors: ProductColor[] }
    dimensions?: { [key: string]: unknown }
    settings?: { isActive: boolean; isFeatured: boolean; isPublished: boolean }
    variants?: { id: string; sizeOrMeasure?: string; color?: ProductColor }[]
}

export function mapUnifiedCreatePayload(
    form: FormValues,
    refs: SectionRefs,
    targetStoreId: number,
    userId: number
): CreateUnifiedProductArgs {
    return {
        form: {
            name: form.name,
            slug: form.slug as string | undefined,
            description: (form.description as string | undefined) ?? "",
            price: form.price,
            stock: form.stock,
            categories: form.categories ?? [],
            images: form.images ?? [],
        },
        media: refs.media ?? { files: [], primaryIndex: null },
        categories: refs.categories ?? { categories: [] },
        sizes: refs.sizes ?? { isUniqueSize: false, sizes: [], measures: [] },
        colors: refs.colors ?? { colors: [] },
        dimensions: refs.dimensions ?? {},
        settings: refs.settings ?? { isActive: true, isFeatured: false, isPublished: true },
        variants: refs.variants ?? [],
        targetStoreId,
        userId,
    }
}


