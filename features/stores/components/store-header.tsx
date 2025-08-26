"use client"

import { Card, CardAction, CardContent } from "@/components/ui/card"
import { Title } from "@/features/layout/components"
import { Store } from "lucide-react"
import StoreLogoEditor from "./store-logo-editor"
import { useEffect, useState } from "react"
import { getStoreHeaderBySlug } from "../actions/getStoreHeaderBySlug"
import { updateStoreLogo } from "../actions/updateStoreLogo"
import { toast } from "sonner"
import { StoreBannerEditor } from "./store-banner-editor"
import { updateStoreBanner } from "../actions/updateStoreBanner"

type StoreHeaderProps = {
    slug: string
}

function StoreHeader({ slug }: StoreHeaderProps) {
    type StoreHeaderData = {
        id: number
        name: string
        description: string | null
        logo: string | null
        banner: string | null
    }
    const [store, setStore] = useState<StoreHeaderData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadStore = async () => {
            try {
                const { payload, error: hasError, message } = await getStoreHeaderBySlug(slug)
                if (hasError) setError(message)
                else setStore(payload)
            } catch {
                setError('Error loading store')
            } finally {
                setLoading(false)
            }
        }

        loadStore()
    }, [slug])

    const handleLogoUpdate = async (newLogoUrl: string | null) => {
        if (store) {
            if (!store.id) {
                toast.error('Missing store id')
                return
            }
            try {
                // Actualizar estado local
                setStore({
                    ...store,
                    logo: newLogoUrl
                })

                // Actualizar en la base de datos
                if (newLogoUrl) {
                    toast.loading('Updating store logo...')
                    const { error, message } = await updateStoreLogo(store.id, newLogoUrl)
                    if (error) {
                        toast.dismiss()
                        toast.error(message)
                    } else {
                        toast.dismiss()
                        toast.success(message)
                    }
                }
            } catch (error) {
                console.error('Error updating store logo:', error)
                toast.error('Error updating store logo')
            }
        }
    }

    const handleBannerUpdate = async (newBannerUrl: string | null) => {
        if (store) {
            if (!store.id) {
                toast.error('Missing store id')
                return
            }
            try {
                setStore({
                    ...store,
                    banner: newBannerUrl
                })
                if (newBannerUrl) {
                    toast.loading('Updating store banner...')
                    const { error, message } = await updateStoreBanner(store.id, newBannerUrl)
                    if (error) {
                        toast.dismiss()
                        toast.error(message)
                    } else {
                        toast.dismiss()
                        toast.success(message)
                    }
                }
            } catch (error) {
                console.error('Error updating store banner:', error)
                toast.error('Error updating store banner')
            }
        }
    }

    if (loading) {
        return <div>Loading store header...</div>
    }

    if (error || !store) {
        return <div>Error loading store header</div>
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
                <Card className="w-full relative overflow-hidden group/store-banner">
                    <img
                        src={store.banner || `https://api.dicebear.com/9.x/shapes/svg?seed=${store.name}&backgroundColor=transparent`}
                        alt="Store banner"
                        className="w-full h-40 object-cover absolute top-0 left-0 brightness-[30%]"
                    />
                    <CardContent className="flex items-center gap-4 w-full z-10">
                        <div className="relative">
                            <img
                                src={store.logo || `https://api.dicebear.com/9.x/initials/svg?seed=${store.name}`}
                                alt="Store logo"
                                className="size-24 rounded-full object-cover"
                            />
                            <StoreLogoEditor
                                currentLogo={store.logo}
                                storeName={store.name}
                                onLogoUpdate={handleLogoUpdate}
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
                        <CardAction className="group-hover/store-banner:opacity-100 opacity-0 transition-opacity duration-300">
                            <StoreBannerEditor
                                currentBanner={store.banner}
                                storeName={store.name}
                                onBannerUpdate={handleBannerUpdate}
                            />
                        </CardAction>
                    </CardContent>
                </Card>
            </section>
        </>
    )
}

export default StoreHeader 