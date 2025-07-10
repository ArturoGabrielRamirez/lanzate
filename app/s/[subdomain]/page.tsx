import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoreWithProducts } from "@/features/subdomain/actions/getStoreWithProducts";
import { ShoppingCart } from "lucide-react";


type Props = {
    params: Promise<{ subdomain: string }>
}

export default async function StorePage({ params }: Props) {
    const { subdomain } = await params
    const { payload: storeData, error } = await getStoreWithProducts(subdomain);

    if (error || !storeData) {
        return <div>Tienda no encontrada</div>;
    }

    return (
        <section className="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-4 p-4">
            {storeData.products.map((product) => (
                <Card key={product.id} className="aspect-9/12 bg-accent ">
                    <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{product.description || "No description available for this product"}</CardDescription>
                    </CardHeader>
                    <CardContent className="grow">
                        <img src="https://api.dicebear.com/9.x/icons/svg?seed=boxes" alt="Product Image" className="rounded-md" />
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <p>${product.price}</p>
                        <Button variant="outline" size="icon">
                            <ShoppingCart />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </section>
    );
}