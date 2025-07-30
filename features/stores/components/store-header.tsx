import { getStoreHeaderBySlug } from "../actions/getStoreHeaderBySlug"
import { Card, CardContent } from "@/components/ui/card"
import { Title } from "@/features/layout/components"
import { Store } from "lucide-react"
import { getTranslations } from "next-intl/server"

type StoreHeaderProps = {
    slug: string
}

async function StoreHeader({ slug }: StoreHeaderProps) {

    const { payload: store, error } = await getStoreHeaderBySlug(slug)

    if (error || !store) {
        return <div>Error loading store header</div>
    }

    const t = await getTranslations("store.layout")
    const t2 = await getTranslations("store")

    return (
        <>
            <Title
                title={(
                    <div className="flex items-center gap-2">
                        <Store />
                        {t2("store-details")}
                    </div>
                )}
                breadcrumbs={[
                    {
                        label: t2("plural-title"),
                        href: "/stores"
                    },
                    {
                        label: store.name,
                        href: `/stores/${slug}`
                    }
                ]}
                showDate
            />
            <section className="flex items-center gap-4">
                <Card className="w-full">
                    <CardContent className="flex flex-col justify-between w-full gap-4 md:items-center xs:flex-row">
                        <div className="flex items-center gap-4">
                            <img
                                src={`https://api.dicebear.com/9.x/initials/svg?seed=${store.name}`}
                                alt="User avatar"
                                className="rounded-full size-24"
                            />
                            <div className="flex flex-col gap-2">
                                <p className="text-xl font-bold">{store.name}</p>
                                <div>
                                    <p className="capitalize text-muted-foreground">
                                        {store.description || t("no-description")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p>{t2("current-balance")}</p>
                            <p className="text-lg font-bold lg:text-2xl">
                                {store.balance 
                                    ? Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(store.balance.current_balance)
                                    : "N/A"
                                }
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </>
    )
}

export default StoreHeader 