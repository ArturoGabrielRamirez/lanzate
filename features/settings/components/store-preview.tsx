import { getStoreSettingsAction } from "@/features/settings/actions/getStoreSettingsAction"
import { StoreCustomizationForm } from "@/features/settings/types"

type StorePreviewProps = {
    slug: string
    initialData?: StoreCustomizationForm
}

async function StorePreview({ slug, initialData }: StorePreviewProps) {
    let storeData: StoreCustomizationForm | null = null
    let error = false

    if (initialData) {
        storeData = initialData
    } else {
        const result = await getStoreSettingsAction(slug)
        storeData = result.payload
        error = result.error
    }

    if (error || !storeData) {
        return (
            <div className="contents">
                <p className="text-muted-foreground">Unable to load preview</p>
            </div>
        )
    }

    return (
        <div
            style={{
                "--background": storeData.background_color,
            } as React.CSSProperties}
            className="bg-background"
        >
            preview
        </div>
    )
}

export default StorePreview