import { LandingFooter, LandingHeader } from "@/features/layout/components";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-dvh h-[calc(100dvh-8rem)] overflow-y-auto bg-background flex flex-col">

            <div className="absolute inset-0 bg-grid-pattern" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/50 to-background" />

            <LandingHeader />
            <main className="relative z-10 grow flex items-center">
                {children}
            </main>
            <LandingFooter />
        </div>
    );
}