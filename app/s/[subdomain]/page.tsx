import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Title } from "@/features/layout/components";
import { getStoreWithProducts } from "@/features/subdomain/actions/getStoreWithProducts";
import { Search, ShoppingCart } from "lucide-react";


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
        <section className="p-4 grow flex flex-col">
            <Title title="My Products" />
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-4 grow">
                <div className="flex flex-col gap-4">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Search</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Input placeholder="Search" />
                                <Button variant="outline">
                                    <Search />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Sort by</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Select defaultValue="price-asc">
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                                        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                                        <SelectItem value="price-asc">Price (Low-High)</SelectItem>
                                        <SelectItem value="price-desc">Price (High-Low)</SelectItem>
                                        <SelectItem value="created-asc">Oldest</SelectItem>
                                        <SelectItem value="created-desc">Newest</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-4">
                    {storeData.products.map((product) => (
                        <Card key={product.id} className="aspect-9/12 bg-accent hover:scale-105 transition-all cursor-pointer">
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
                </div>
            </div>
        </section>
    );
}