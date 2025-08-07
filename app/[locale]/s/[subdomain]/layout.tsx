import { Toaster } from "@/components/ui/sonner";
import CartProvider from "@/features/cart/components/cart-provider";
import { Header } from "@/features/store-landing/components"
import MainContainer from "@/features/store-landing/components/main-container";
import StoreProvider from "@/features/store-landing/components/store-provider";
import { getStoreWithProducts } from "@/features/subdomain/actions/getStoreWithProducts";
import { getTranslations } from "next-intl/server";

type LayoutProps = {
    children: React.ReactNode;
    params: Promise<{
        locale: string;
        subdomain: string;
    }>;
};


export default async function Layout({ children, params }: LayoutProps) {

    const { subdomain } = await params;

    const { payload: storeData, error } = await getStoreWithProducts(
        subdomain,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        20,
        1
    );

    const t = await getTranslations("store");

    if (error || !storeData) {
        return <div>{t("store-not-found")}</div>;
    }

    return (
        <CartProvider>
            <StoreProvider>
                <div
                    style={{
                        "--background": storeData.customization?.background_color,
                        "--foreground": storeData.customization?.background_foreground_color,
                        "--header": storeData.customization?.header_color,
                        "--header-foreground": storeData.customization?.header_foreground_color,
                        "--filter-background": storeData.customization?.filter_background_color,
                        "--filter-text": storeData.customization?.filter_text_color,
                        "--product-card-background": storeData.customization?.product_card_background_color,
                        "--product-card-text": storeData.customization?.product_card_text_color,
                        "--show-brand-logo": storeData.customization?.show_brand_logo ? "block" : "none",
                        "--show-brand-text": storeData.customization?.show_brand_text ? "block" : "none",
                        "--primary": storeData.customization?.primary_color,
                        "--accent": storeData.customization?.accent_color,
                        "--secondary": storeData.customization?.secondary_color,
                    } as React.CSSProperties}
                    className="contents"
                >
                    <Header
                        title={storeData.name}
                        socialMedia={storeData.operational_settings}
                        showSocialLinks={storeData.customization?.show_social_links ?? true}
                    />
                    <MainContainer>
                        {children}
                    </MainContainer>
                    <Toaster />
                </div>
            </StoreProvider>
        </CartProvider>
    );
}