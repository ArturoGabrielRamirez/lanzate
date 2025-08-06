import { CheckoutForm } from "@/features/checkout/components"
import { CartResume } from "@/features/cart/components"
import { Title } from "@/features/layout/components"
import { getUserInfo } from "@/features/layout/actions"
import { getStoreBySubdomain } from "@/features/subdomain/actions"
/* import { getCurrentLocale } from "@/locales/server" */

async function CheckoutPage({ params }: { params: Promise<{ subdomain: string }> }) {

    const { subdomain } = await params
    const { payload: store, error: storeError, message: storeMessage } = await getStoreBySubdomain(subdomain)
    const { payload: user, error: userError, message: userMessage } = await getUserInfo()
    /* const currentLocale = await getCurrentLocale()
    console.log("🚀 ~ CheckoutPage ~ currentLocale:", currentLocale) */

    const breadcrumbs = [
        { label: "cart", href: "/cart" },
        { label: "checkout", href: "/checkout" }
    ]

    if (userError || !user) {
        return console.error(userMessage)
    }

    if (storeError || !store) {
        return console.error(storeMessage)
    }

    return (
        <section className="p-4 grow flex flex-col">
            <Title title="Checkout" breadcrumbs={breadcrumbs} homePath="/"/>
            <div className="flex flex-col gap-4 lg:flex-row">
                <CheckoutForm subdomain={subdomain} userId={String(user.id)} branches={store.branches} />
                <CartResume />
            </div>
        </section>
    )
}
export default CheckoutPage