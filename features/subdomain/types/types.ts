import { Product as PrismaProduct } from "@prisma/client";

export type Product = PrismaProduct;

export type SubdomainData = {
    id: string;
    subdomain: string;
    created_at: string;
    name: string;
};