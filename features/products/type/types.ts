import { Category, Color, Product, ProductVariant, StoreCustomization } from "@prisma/client";

export type GetProductDetailsReturn = {
    message: string;
    payload: (Product & {
        categories: Category[];
        store: {
            id: number;
            name: string;
            subdomain: string;
            customization: StoreCustomization | null;
        };
        variants?: (ProductVariant & { color: Color | null })[];
    }) | null;
    error: boolean;
};