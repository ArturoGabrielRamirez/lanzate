import { getStoreWithProductsAction } from "@/features/stores/actions/get-store-with-products.action";
import ProductsCard from "./products-card";
import type { Product, ProductVariant } from "@prisma/client";
import ProductListContainer from "./product-list-container";

type Props = {
    subdomain: string
    category: string | undefined
    sort: string | undefined
    search: string | undefined
    min: string | undefined
    max: string | undefined
    limit: number
    page: number
}

async function ProductList({ subdomain, category, sort, search, min, max, limit, page }: Props) {

    const { payload: storeData, error } = await getStoreWithProductsAction(subdomain, category, sort, search, min, max, limit, page);

    if (error || !storeData) {
        return <div>Tienda no encontrada</div>;
    }

    const items: (Product & { __href: string })[] = storeData.products.flatMap((p: Product & { variants?: ProductVariant[] }) => {
        if (p.variants && p.variants.length > 0) {
            return p.variants.map((v: ProductVariant) => {
                const search = new URLSearchParams()
                if (v.size) search.set("size", v.size)
                if (v.measure) search.set("measure", v.measure)
                if (v.color_id) search.set("color", String(v.color_id))
                return ({
                    ...p,
                    id: v.id,
                    price: v.price ?? p.price,
                    name: v.name ?? p.name,
                    description: v.description ?? p.description,
                    sku: v.sku ?? p.sku,
                    barcode: v.barcode ?? p.barcode,
                    __href: `/item/${p.id}?${search.toString()}`,
                } as Product & { __href: string })
            });
        }
        return [{ ...p, __href: `/item/${p.id}` } as Product & { __href: string }];
    });

    return (
        <>
            {items.length > 0 && (
                <ProductListContainer>
                    {items.map((product) => (
                        <ProductsCard key={product.id} product={product} href={product.__href} />
                    ))}
                </ProductListContainer>
            )}
            {items.length === 0 && (
                <div className="border-muted-foreground/50 border-2 rounded-md p-4 border-dashed">
                    <p className="text-center text-muted-foreground">No products found</p>
                </div>
            )}
        </>
    )
}
export default ProductList