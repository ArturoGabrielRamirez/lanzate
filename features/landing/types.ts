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

