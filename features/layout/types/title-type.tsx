export type TitleProps = {
    className?: string;
    title: string | React.ReactNode;
    breadcrumbs?: {
        label: string;
        href: string;
    }[];
    canGoBack?: boolean;
    showDate?: boolean;
    homePath?: string;
};
