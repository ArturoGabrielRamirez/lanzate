export type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    created_at: string;
};

export type SubdomainData = {
    id: string;
    subdomain: string;
    created_at: string;
    name: string;
};

export type StoreWithProducts = {
    store: SubdomainData;
    products: Product[];
};

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
    payload: SubdomainData | null;
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
    payload: SubdomainData | null;
    error: boolean;
};

export type SelectStoreWithProductsReturn = {
    message: string;
    payload: StoreWithProducts | null;
    error: boolean;
};