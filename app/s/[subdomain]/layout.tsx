import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/features/store-landing/components"
import { getStoreWithProducts } from "@/features/subdomain/actions/getStoreWithProducts";

export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ subdomain: string }> }) {

    const { subdomain } = await params
    const { payload: storeData, error } = await getStoreWithProducts(subdomain);

    if (error || !storeData) {
        return <div>Tienda no encontrada</div>;
    }

    return (
        <>
            <Header title={storeData.store.name} />
            <main className='flex flex-col overflow-y-hidden overflow-x-hidden grow'>
                {children}
            </main>
            <Toaster />
        </>
    );
}