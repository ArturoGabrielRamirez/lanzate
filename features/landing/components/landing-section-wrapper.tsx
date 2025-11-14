import { BackgroundPattern } from "@/features/landing/components/background-pattern";
import { LandingSectionWrapperProps } from "@/features/landing/types";
import { cn } from "@/lib/utils";

const brightnessVariants = {
    default: "brightness-90 dark:brightness-100",
    dim: "dark:brightness-75",
    bright: "brightness-100 dark:brightness-100"
} as const;

export function LandingSectionWrapper({
    children,
    id,
    className,
    showPattern = true,
    patternBrightness = "default",
    containerClassName,
    contentClassName,
    noContentWrapper = false
}: LandingSectionWrapperProps) {
    return (
        <section
            className={cn(
                "relative pt-17 md:py-17 flex snap-start",
                className
            )}
            id={id}
        >
            <div className={cn("container mx-auto px-4 relative h-full grow w-full", containerClassName)}>
                {showPattern && (
                    <div className={cn("absolute inset-0", brightnessVariants[patternBrightness])}>
                        <BackgroundPattern />
                    </div>
                )}
                {noContentWrapper ? (
                    children
                ) : contentClassName !== undefined ? (
                    <div className={cn("relative z-20", contentClassName)}>
                        {children}
                    </div>
                ) : (
                    <div className="relative z-20">
                        {children}
                    </div>
                )}
            </div>
        </section>
    );
}

