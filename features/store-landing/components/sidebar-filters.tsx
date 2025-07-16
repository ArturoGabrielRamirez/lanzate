import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategorySelect from "@/features/store-landing/components/category-select-";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

function SidebarFilters() {
    return (
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
                        <CategorySelect withLabel={false} />
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
    )
}
export default SidebarFilters