export interface LandingSectionWrapperProps {
    children: React.ReactNode;
    id?: string;
    className?: string;
    showPattern?: boolean;
    patternBrightness?: "default" | "dim" | "bright";
    containerClassName?: string;
    contentClassName?: string;
    noContentWrapper?: boolean;
}

export interface SectionHeaderProps {
    icon: React.ReactNode;
    labelKey: string;
    titleKey?: string;
    descriptionKey?: string;
    namespace: string;
    titleClassName?: string;
    descriptionClassName?: string;
    containerClassName?: string;
}

