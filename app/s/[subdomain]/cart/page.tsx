import { Title } from "@/features/layout/components"

type Props = {}
function CartPage({ }: Props) {
    return (
        <section className="p-4">
            <Title title="Cart" breadcrumbs={[{ label: "cart", href: "/cart" }]} />
        </section>
    )
}
export default CartPage