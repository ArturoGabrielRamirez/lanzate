import { LandingSectionWrapper } from "@/features/landing/components/landing-section-wrapper";
import { Skeleton } from "@/features/shadcn/components/ui/skeleton";

export function SectionSkeleton() {
    return (
        <LandingSectionWrapper>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                    <Skeleton className="h-6 w-64 mx-auto md:mx-0" />
                    <Skeleton className="h-4 w-96 mx-auto md:mx-0" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            </div>
        </LandingSectionWrapper>
    );
}

