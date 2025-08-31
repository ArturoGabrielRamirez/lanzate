import { getStoreWithProducts } from "@/features/subdomain/actions/getStoreWithProducts";
import ProductCard from "./product-card";
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

    const { payload: storeData, error } = await getStoreWithProducts(subdomain, category, sort, search, min, max, limit, page);

    if (error || !storeData) {
        return <div>Tienda no encontrada</div>;
    }

    const items: Product[] = storeData.products.flatMap((p: Product & { variants?: ProductVariant[] }) => {
        if (p.variants && p.variants.length > 0) {
            return p.variants.map((v) => ({
                ...p,
                id: v.id,
                price: v.price ?? p.price,
            } as Product));
        }
        return [p];
    });

    return (
        <>
            {items.length > 0 && (
                <ProductListContainer>
                    {items.map((product) => (
                        <ProductCard key={product.id} product={product} />
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