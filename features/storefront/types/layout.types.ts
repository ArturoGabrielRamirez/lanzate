import { AnyPageSection } from "@/features/storefront/types/storefront-sections.types";
import { StorePublicData, StoreTheme } from "@/features/stores/types";

export interface StorefrontShellLayoutProps {
    params: Promise<{ subdomain: string; locale: string }>;
    children: React.ReactNode;
}

export interface StorefrontContextValue {
    store: StorePublicData;
    theme: StoreTheme;
    homeSections: AnyPageSection[];
}
