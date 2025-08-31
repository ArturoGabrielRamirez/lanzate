import { Product as PrismaProduct, ProductVariant, Store, StoreBalance, StoreCustomization, Category, StoreOperationalSettings, Branch, Color } from "@prisma/client";

export type Product = PrismaProduct;

export type SubdomainData = {
    id: string;
    subdomain: string;
    created_at: string;
    name: string;
};

export type StoreWithProducts = Store & {
    products: (Product & { variants: ProductVariant[] })[]
    customization: StoreCustomization | null
    operational_settings: StoreOperationalSettings | null
}

export type GetStoreWithProductsReturn = {
    message: string;
    payload: StoreWithProducts | null;
    error: boolean;
};

export type GetAllStoresReturn = {
    message: string;
    payload: SubdomainData[];
    error: boolean;
};

export type GetStoreBySubdomainReturn = {
    message: string;
    payload: Store & { balance: StoreBalance, branches: Branch[], operational_settings: StoreOperationalSettings | null } | null;
    error: boolean;
};

export type ValidateSubdomainReturn = {
    message: string;
    payload: boolean;
    error: boolean;
};

export type CheckSubdomainExistsReturn = {
    message: string;
    payload: boolean;
    error: boolean;
};

export type SelectAllStoresReturn = {
    message: string;
    payload: SubdomainData[];
    error: boolean;
};

export type SelectStoreBySubdomainReturn = {
    message: string;
    payload: StoreWithProducts | null;
    error: boolean;
};

export type SelectStoreWithProductsReturn = {
    message: string;
    payload: StoreWithProducts | null;
    error: boolean;
};

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