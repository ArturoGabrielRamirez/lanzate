import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/features/shadcn/components/ui/card"
import { DeleteStoreButton } from "@/features/stores/components/delete-store-button"
import { selectStoreBasicsBySlugData } from "@/features/stores/data/select-store-basics-by-slug.data"

type DangerZoneServerWrapperProps = {
    slug: string
    userId: number
}

export async function DangerZoneServerWrapper({ slug, userId }: DangerZoneServerWrapperProps) {
    const { payload: store } = await selectStoreBasicsBySlugData(slug)

    if (!store) return null

    return (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Danger zone</CardTitle>
                <CardDescription>
                    Esta acción es irreversible.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DeleteStoreButton storeId={store.id} userId={userId} />
            </CardContent>
        </Card>
    )
}

