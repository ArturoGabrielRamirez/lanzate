import { Store } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Title } from "@/features/layout/components"
import { getStoreHeaderBySlug } from "@/features/stores/actions/getStoreHeaderBySlug"
import StoreBannerEditorWrapper from "@/features/stores/components/store-banner-editor-wrapper"
import StoreLogoEditorWrapper from "@/features/stores/components/store-logo-editor-wrapper"

type StoreHeaderServerProps = {
    slug: string
}

async function StoreHeaderServer({ slug }: StoreHeaderServerProps) {
    const { payload: store, error, message } = await getStoreHeaderBySlug(slug)

    if (error || !store) {
        return <div>Error loading store header: {message}</div>
    }

    return (
        <>
            <Title
                title={(
                    <div className="flex items-center gap-2">
                        <Store />
                        Store Details
                    </div>
                )}
                breadcrumbs={[
                    {
                        label: "Stores",
                        href: "/stores"
                    },
                    {
                        label: store.name,
                        href: `/stores/${slug}`
                    }
                ]}
                showDate
            />
            <section className="items-center gap-4 flex mb-2 md:mb-0">
                <Card className="w-full relative overflow-hidden group/store-banner bg-background">
                    <img
                        src={store.banner || `https://api.dicebear.com/9.x/shapes/svg?seed=${store.name}&backgroundColor=transparent`}
                        alt="Store banner"
                        className="w-full h-full object-cover absolute top-0 left-0 mask-l-from-50"
                    />
                    <CardContent className="flex items-center gap-4 w-full z-10">
                        <div className="flex items-center gap-4 w-full">
                            <div className="relative">
                                <img
                                    src={store.logo || `https://api.dicebear.com/9.x/initials/svg?seed=${store.name}`}
                                    alt="Store logo"
                                    className="size-24 rounded-full object-cover border-primary border-2"
                                />
                                <StoreLogoEditorWrapper
                                    currentLogo={store.logo}
                                    storeName={store.name}
                                    storeId={store.id}
                                />
                            </div>
                            <div className="flex flex-col gap-2 flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h2 className="text-xl font-bold truncate">
                                        {store.name}
                                    </h2>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                    {store.description || "No description"}
                                </p>
                            </div>
                        </div>
                        <StoreBannerEditorWrapper
                            currentBanner={store.banner}
                            storeName={store.name}
                            storeId={store.id}
                        />
                    </CardContent>
                </Card>
            </section>
        </>
    )
}

export { StoreHeaderServer }
