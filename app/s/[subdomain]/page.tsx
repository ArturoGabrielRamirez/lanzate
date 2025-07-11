import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Title } from "@/features/layout/components";
import CategorySelect from "@/features/store-landing/components/category-select-";
import ProductCard from "@/features/store-landing/components/product-card";
import { getStoreWithProducts } from "@/features/subdomain/actions/getStoreWithProducts";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Grid, Grid2X2, List, Search, ShoppingCart } from "lucide-react";

type Props = {
    params: Promise<{ subdomain: string }>
}

export default async function StorePage({ params }: Props) {
    const { subdomain } = await params
    const { payload: storeData, error } = await getStoreWithProducts(subdomain);

    if (error || !storeData) {
        return <div>Tienda no encontrada</div>;
    }

    const paginationMaxAmount = 10;
    const paginationCurrentPage = 1;
    const paginationTotalPages = Math.ceil(storeData.products.length / paginationMaxAmount);

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
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <CategorySelect />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Price Range</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Input placeholder="Min $" />
                                <Input placeholder="Max $" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col gap-4 relative">
                    <div className="flex gap-2 justify-between">
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Grid2X2 />
                            </Button>
                            <Button variant="outline">
                                <List />
                            </Button>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Button variant="outline">
                                <ChevronLeft />
                            </Button>
                            <p>{paginationCurrentPage} of {paginationTotalPages}</p>
                            <Button variant="outline">
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <p>Showing {paginationMaxAmount} of {storeData.products.length} products</p>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-4">
                        {storeData.products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
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
                </div>
            </div>
        </section>
    );
}