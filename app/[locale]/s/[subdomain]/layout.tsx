import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Toaster } from "@/components/ui/sonner";
import CartProvider from "@/features/cart/components/cart-provider";
import { Header } from "@/features/store-landing/components"
import Footer from "@/features/store-landing/components/footer";
import MainContainer from "@/features/store-landing/components/main-container";
import StoreProvider from "@/features/store-landing/components/store-provider";
import { getStoreWithProducts } from "@/features/subdomain/actions/getStoreWithProducts";

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
                        /* "--background": storeData.customization?.background_color,
                        "--foreground": storeData.customization?.background_foreground_color,
                        "--header": storeData.customization?.header_color,
                        "--header-foreground": storeData.customization?.header_foreground_color,
                        "--filter-background": storeData.customization?.filter_background_color,
                        "--filter-text": storeData.customization?.filter_text_color,
                        "--product-card-background": storeData.customization?.product_card_background_color,
                        "--product-card-text": storeData.customization?.product_card_text_color,
                        "--show-brand-logo": storeData.customization?.show_brand_logo ? "block" : "none",
                        "--show-brand-text": storeData.customization?.show_brand_text ? "block" : "none",
                        "--header-floating": storeData.customization?.header_floating ? "fixed" : "static",
                        "--header-size": storeData.customization?.header_size == "LARGE" ? "100%" : storeData.customization?.header_size == "MEDIUM" ? "80%" : "50%",
                        "--section-padding-top": storeData.customization?.header_floating ? "88px" : "0px",
                        "--header-top": storeData.customization?.header_floating ? "16px" : "0px",
                        "--header-padding-top": storeData.customization?.header_floating ? "8px" : "16px",
                        "--header-padding-bottom": storeData.customization?.header_floating ? "8px" : "16px",
                        "--header-padding-left": storeData.customization?.header_floating ? "24px" : "16px",
                        "--header-padding-right": storeData.customization?.header_floating ? "24px" : "16px",
                        "--header-border-radius": storeData.customization?.header_size !== "LARGE" ? "16px" : "0px",
                        "--show-filters": storeData.customization?.show_filters ? "flex" : "none",
                        "--show-sorting-filter": storeData.customization?.show_sorting_filter ? "block" : "none",
                        "--show-categories-filter": storeData.customization?.show_categories_filter ? "block" : "none",
                        "--show-price-filter": storeData.customization?.show_price_filter ? "block" : "none",
                        "--show-searchbar-filter": storeData.customization?.show_searchbar_filter ? "block" : "none",
                        "--primary": storeData.customization?.primary_color,
                        "--accent": storeData.customization?.accent_color,
                        "--secondary": storeData.customization?.secondary_color, */
                    } as React.CSSProperties}
                    className="contents"
                >
                    <Suspense>
                        <Header
                            logo={storeData.logo}
                            title={storeData.name}
                            socialMedia={storeData.operational_settings}
                            showSocialLinks={storeData.customization?.show_social_links ?? true}
                        />
                    </Suspense>
                    <MainContainer>
                        {children}
                    </MainContainer>
                    <Footer
                        title={storeData.name}
                        socialMedia={storeData.operational_settings}
                        showSocialLinks={storeData.customization?.show_social_links ?? true}
                    />
                    <Toaster />
                </div>
            </StoreProvider>
        </CartProvider>
    );
}