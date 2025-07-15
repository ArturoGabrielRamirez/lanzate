import CartList from "@/features/cart/components/cart-list"
import CartResume from "@/features/cart/components/cart-resume"
import { Title } from "@/features/layout/components"

function CartPage() {
    return (
        <section className="p-4">
            <Title title="Cart" breadcrumbs={[{ label: "cart", href: "/cart" }]} />
            <div className="flex flex-col gap-4 lg:flex-row">
                <CartList />
                <CartResume />
            </div>
        </section>
    )
}

export default CartPage