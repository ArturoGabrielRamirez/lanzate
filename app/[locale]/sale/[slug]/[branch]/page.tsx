/* import { ShoppingBasket } from "lucide-react" */
/* import { getTranslations } from "next-intl/server" */

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
/* import { Title } from "@/features/layout/components" */
import SaleInterface from "@/features/sale/components/sale-interface"
import { getStoreBySubdomainAction } from "@/features/stores/actions/get-store-by-subdomain.action"

type Props = {
    params: Promise<{ slug: string, branch: string }>
}

async function SaleStorePage({ params }: Props) {
    const { slug, branch } = await params
    /* const t = await getTranslations("sale") */

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: store, hasError: storeError, message: storeMessage } = await getStoreBySubdomainAction(slug)

    if (storeError || !store) {
        return console.error(storeMessage)
    }

    return (
        <section className="p-2 md:p-4 flex flex-col pt-13 md:pt-24 grow mx-auto container z-10 xl:px-0 pb-26">
           {/*  <Title title={(
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
            ]} className="hidden md:block" /> */}

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