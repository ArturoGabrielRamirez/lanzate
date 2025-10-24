import { useTranslations } from "next-intl";

import CartList from "@/features/cart/components/cart-list"
import CartResume from "@/features/cart/components/cart-resume"
import { CheckoutProvider } from "@/features/checkout/components/checkout-context";
import { Title } from "@/features/layout/components"
import { PageContainer } from "@/features/layout/components/page-container"

function CartPage() {
    const t = useTranslations("cart");
    return (
        <CheckoutProvider>
            <PageContainer>
                <Title title={t("title")} breadcrumbs={[{ label: t("title"), href: "/cart" }]} homePath="/" />
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
            </PageContainer>
        </CheckoutProvider>
    )
}

export default CartPage