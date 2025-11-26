import { ShoppingBasket } from "lucide-react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import SaleInterface from "@/features/sale/components/sale-interface"
import { getStoresFromUserData } from "@/features/stores/data/get-stores-from-user.data"
/* import { Title } from "@/features/layout/components" */

export const metadata: Metadata = {
    title: "Nueva venta",
    description: "Nueva venta en el punto de venta"
}

async function SalePage() {
    const t = await getTranslations("sale")


    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()
    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: stores, hasError: storesError, message: storesMessage } = await getStoresFromUserData(user.id)
    if (storesError || !stores) {
        return console.error(storesMessage)
    }

    const store = stores[0]
    if (stores.length === 0) {
        return (console.error("No tenés tiendas asociadas. Podés crear una en la sección de tiendas. O desde el siguiente enlace: "),
            console.error("/stores/new"))
    }



    return (
        <section className="p-2 md:p-4 flex flex-col pt-13 md:pt-24 mx-auto container z-10 xl:px-0">
            {/* <Title title={( */}
            <div className="flex items-center gap-2">
                <ShoppingBasket />
                {t("title")}
            </div>
            {/*  )} breadcrumbs={[{
                label: t("breadcrumbs.sale"),z
                href: "/sale"
            }]} showDate/> */}

           {/*  <div className="flex-1 flex items-center justify-center min-h-[400px]"> */}
               {/*  <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 w-full max-w-md"> */}
                    <Suspense /* fallback={<StoreSelectorSkeleton />} */>
                        <SaleInterface
                            storeId={store.id}
                            branchId={store.branches[0].id}
                     
                            subdomain={store.subdomain}
                            processed_by_user_id={user.id}
                            branchName={store.branches[0].name}
                            storeName={store.name}
                        />
                    </Suspense>
             {/*    </div>
            </div> */}
        </section>
    )
}

export default SalePage