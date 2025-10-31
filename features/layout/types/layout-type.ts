import { ReactNode } from "react"

type RootLayoutProps = {
    children: ReactNode;
    params: Promise<{
        locale: string;
    }>;
};

export type LayoutType = Readonly<RootLayoutProps>