import CartResume from "@/features/cart/components/cart-resume"
import CheckoutForm from "@/features/checkout/components/checkout-form"
import { Title } from "@/features/layout/components"

function CheckoutPage() {
    return (
        <section className="p-4 grow flex flex-col">
            <Title title="Checkout" breadcrumbs={[{ label: "checkout", href: "/checkout" }]} />
            <div className="flex flex-col gap-4 lg:flex-row">
                <CheckoutForm />
                <CartResume />
            </div>
        </section>
    )
}
export default CheckoutPage