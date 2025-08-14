import { ShoppingBasket } from "lucide-react"
import { Title } from "@/features/layout/components"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { SaleInterface } from "@/features/sale/components"
import { getTranslations } from "next-intl/server"
import { getStoreBySubdomain } from "@/features/subdomain/actions/getStoreBySubdomain"

type Props = {
    params: Promise<{ slug: string, branch: string }>
}

async function SaleStorePage({ params }: Props) {
    const { slug, branch } = await params
    const t = await getTranslations("sale")

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: store, error: storeError, message: storeMessage } = await getStoreBySubdomain(slug)

    if (storeError || !store) {
        return console.error(storeMessage)
    }

    return (
        <section className="p-2 md:p-4 flex flex-col pt-13 md:pt-17 grow">
            <Title title={(
                <div className="flex items-center gap-2">
                    <ShoppingBasket />
                    {t("title")} - {store.name}
                </div>
            )} breadcrumbs={[
                {
                    label: t("breadcrumbs.sale"),
                    href: "/sale"
                },
                {
                    label: store.name,
                    href: `/sale/${slug}`
                }
            ]} className="hidden md:block" />

            <SaleInterface
                storeName={store.name}
                storeDescription={store.description ?? undefined}
                storeId={store.id}
                branchId={parseInt(branch)}
                subdomain={store.subdomain}
                processed_by_user_id={user.id}
                branchName={store.branches.find(b => b.id === parseInt(branch))?.name}
            />
        </section>
    )
}

export default SaleStorePage 