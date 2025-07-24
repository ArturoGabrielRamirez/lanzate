import CartList from "@/features/cart/components/cart-list"
import CartResume from "@/features/cart/components/cart-resume"
import { Title } from "@/features/layout/components"
import { useTranslations } from "next-intl";

function CartPage() {
    const t = useTranslations("cart");
    return (
        <section className="p-4 grow flex flex-col">
            <Title title={t("title")} breadcrumbs={[{ label: t("title"), href: "/cart" }]} />
            <div className="flex flex-col gap-4 lg:flex-row">
                <CartList />
                <CartResume />
            </div>
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-muted-foreground/50 rounded-md mt-4">
                <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground text-center">{t("description.products")}</p>
                    <p className="text-muted-foreground text-center">{t("description.coming-soon")}</p>
                </div>
            </div>
        </section>
    )
}

export default CartPage