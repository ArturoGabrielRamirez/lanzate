import CartResume from "@/features/cart/components/cart-resume"
import CheckoutForm from "@/features/checkout/components/checkout-form"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { Title } from "@/features/layout/components"

async function CheckoutPage({ params }: { params: Promise<{ subdomain: string }> }) {

    const { subdomain } = await params
    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    return (
        <section className="p-4 grow flex flex-col">
            <Title title="Checkout" breadcrumbs={[{ label: "checkout", href: "/checkout" }]} />
            <div className="flex flex-col gap-4 lg:flex-row">
                <CheckoutForm subdomain={subdomain} userId={user.id} />
                <CartResume />
            </div>
        </section>
    )
}
export default CheckoutPage