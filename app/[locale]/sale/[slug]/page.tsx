import { ShoppingBasket } from "lucide-react"
import { Title } from "@/features/layout/components"
import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { SaleInterface } from "@/features/sale/components"

type Props = {
    params: Promise<{ slug: string }>
}

async function SaleStorePage({ params }: Props) {
    const { slug } = await params

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: store, error: storeError, message: storeMessage } = await getStoresFromSlug(slug)

    if (storeError || !store) {
        return console.error(storeMessage)
    }

    return (
        <section className="p-4 flex flex-col pt-17 grow">
            <Title title={(
                <div className="flex items-center gap-2">
                    <ShoppingBasket />
                    New order - {store.name}
                </div>
            )} breadcrumbs={[
                {
                    label: "Sale",
                    href: "/sale"
                },
                {
                    label: store.name,
                    href: `/sale/${slug}`
                }
            ]} />

            <SaleInterface 
                storeName={store.name}
                storeDescription={store.description ?? undefined}
                storeId={store.id}
            />
        </section>
    )
}

export default SaleStorePage 