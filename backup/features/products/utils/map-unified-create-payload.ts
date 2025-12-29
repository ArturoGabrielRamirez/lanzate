import { CreateUnifiedProductArgs, FormValues, SectionRefs } from "@/features/products/types"

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


