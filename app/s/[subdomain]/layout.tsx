import { Toaster } from "@/components/ui/sonner";
import CartProvider from "@/features/cart/components/cart-provider";
import { Header } from "@/features/store-landing/components"
import StoreProvider from "@/features/store-landing/components/store-provider";
import { getStoreWithProducts } from "@/features/subdomain/actions/getStoreWithProducts";

export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ subdomain: string }> }) {

    const { subdomain } = await params
    const { payload: storeData, error } = await getStoreWithProducts(subdomain);
    console.log("🚀 ~ Layout ~ storeData:", storeData)

    if (error || !storeData) {
        return <div>Tienda no encontrada</div>;
    }

    console.log("🚀 ~ Layout ~ storeData.customization?.background_color:", storeData.customization?.background_color)

    return (
        <CartProvider>
            <StoreProvider>
                <div style={{
                    "--background": storeData.customization?.background_color,
                    "--primary": storeData.customization?.primary_color,
                    "--accent": storeData.customization?.accent_color,
                    "--secondary": storeData.customization?.secondary_color,
                }} className="contents">
                    <Header title={storeData.name} />
                    <main className='flex flex-col overflow-y-hidden overflow-x-hidden grow bg-background' >
                        {children}
                    </main>
                    <Toaster />
                </div>
            </StoreProvider>
        </CartProvider>
    );
}