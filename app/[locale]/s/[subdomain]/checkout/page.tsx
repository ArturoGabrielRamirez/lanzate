import { CartResume } from "@/features/cart/components"
import { CheckoutForm, CheckoutProvider } from "@/features/checkout/components"
import { getUserInfo } from "@/features/global/actions"
/* import { Title } from "@/features/layout/components" */
import {PageContainer} from "@/features/layout/components/page-container"
import { getStoreBySubdomainAction } from "@/features/stores/actions"

async function CheckoutPage({ params }: { params: Promise<{ subdomain: string }> }) {

    const { subdomain } = await params
    const { payload: store, hasError: storeError, message: storeMessage } = await getStoreBySubdomainAction(subdomain)
    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

  /*   const breadcrumbs = [
        { label: "cart", href: "/cart" },
        { label: "checkout", href: "/checkout" }
    ] */

    if (userError || !user) {
        return console.error(userMessage)
    }

    if (storeError || !store) {
        return console.error(storeMessage)
    }

    return (
        <CheckoutProvider>
            <PageContainer className="![padding-top:calc(var(--section-padding-top)_+_2rem)]">
                {/* <Title title="Checkout" breadcrumbs={breadcrumbs} homePath="/"/> */}
                <div className="flex flex-col gap-4 lg:flex-row">
                    <CheckoutForm 
                        subdomain={subdomain} 
                        userId={String(user.id)} 
                        branches={store.branches}
                        operationalSettings={store.operational_settings}
                    />
                    <CartResume operationalSettings={store.operational_settings} />
                </div>
            </PageContainer>
        </CheckoutProvider>
    )
}

export default CheckoutPage