import { ReactNode } from "react"

type RootLayoutProps = {
    children: ReactNode;
    params: Promise<{
        locale: string;
    }>;
};

export type Props = Readonly<RootLayoutProps>