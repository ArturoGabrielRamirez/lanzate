import { Title } from "@/features/layout/components"

function CheckoutPage() {
    return (
        <section className="p-4 grow flex flex-col">
            <Title title="Checkout" breadcrumbs={[{ label: "checkout", href: "/checkout" }]} />
        </section>
    )
}
export default CheckoutPage