import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { getStoreWithProducts } from "@/features/subdomain/actions/getStoreWithProducts";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from "./product-card";

type Props = {
    subdomain: string
    category: string | undefined
    sort: string | undefined
}

async function ProductList({ subdomain, category, sort }: Props) {

    const { payload: storeData, error } = await getStoreWithProducts(subdomain, category, sort);

    if (error || !storeData) {
        return <div>Tienda no encontrada</div>;
    }

    const paginationMaxAmount = 10;
    const paginationCurrentPage = 1;
    const paginationTotalPages = Math.ceil(storeData.products.length / paginationMaxAmount);


    return (
        <>
            {storeData.products.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-4 grow">
                    {storeData.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
            {storeData.products.length === 0 && (
                <div className="border-muted-foreground/50 border-2 rounded-md p-4 border-dashed">
                    <p className="text-center text-muted-foreground">No products found</p>
                </div>
            )}
            <div className="flex justify-center gap-1 absolute bottom-4 left-0 right-0">
                <Button variant="outline" size="icon">
                    <ChevronLeft />
                </Button>
                <div className="flex gap-2">
                    {Array.from({ length: paginationTotalPages }).map((_, index) => (
                        <Button key={index} variant="outline" size="icon" className={cn(paginationCurrentPage === index + 1 && "bg-primary text-primary-foreground")}>
                            {index + 1}
                        </Button>
                    ))}
                </div>
                <Button variant="outline" size="icon">
                    <ChevronRight />
                </Button>
            </div>
        </>
    )
}
export default ProductList