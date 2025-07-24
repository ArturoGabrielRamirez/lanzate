import { Toaster } from "@/components/ui/sonner";
import CartProvider from "@/features/cart/components/cart-provider";
import { Header } from "@/features/store-landing/components"
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

    const { locale, subdomain } = await params;

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
    console.log("🏪 Store layout - locale:", locale, "subdomain:", subdomain, "store:", storeData.name);

    return (
        <CartProvider>
            <StoreProvider>
                <Header title={storeData.name} />
                <main className='flex flex-col overflow-y-hidden overflow-x-hidden grow'>
                    {children}
                </main>
                <Toaster />
            </StoreProvider>
        </CartProvider>
    );
}