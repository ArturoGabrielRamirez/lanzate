import { HeroSection } from "@/features/landing/components";

import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Home",
    description: "Gestiona tu negocio online nunca fue tan fácil. Enfocate en crecer mientras te damos el control total.",
};

function HomePage() {
    return (
        <>
            <HeroSection />
            {/* 
            <HowItWorksSection />
            <div id="integrations" className="py-20 px-4 bg-muted/30">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Integraciones</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Próximamente podrás integrar Lanzate con tus herramientas favoritas para automatizar tu negocio.
                    </p>
                </div>
            </div>
            <FAQSection />
            <Footer /> */}

            {/* Simulated content sections for testing header scroll behavior */}
            <div id="inicio" className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
                <div className="relative w-full max-w-4xl overflow-hidden rounded-[40px] bg-primary p-6 sm:p-10 md:p-20">
                    <div className="absolute inset-0 hidden h-full w-full overflow-hidden md:block">
                        <div className="absolute top-1/2 right-[-45%] aspect-square h-[800px] w-[800px] -translate-y-1/2">
                            <div className="absolute inset-0 rounded-full bg-primary opacity-30"></div>
                            <div className="absolute inset-0 scale-[0.8] rounded-full bg-orange-300 opacity-30"></div>
                            <div className="absolute inset-0 scale-[0.6] rounded-full bg-orange-200 opacity-30"></div>
                            <div className="absolute inset-0 scale-[0.4] rounded-full bg-orange-100 opacity-30"></div>
                            <div className="absolute inset-0 scale-[0.2] rounded-full bg-orange-50 opacity-30"></div>
                            <div className="absolute inset-0 scale-[0.1] rounded-full bg-white/50 opacity-30"></div>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl md:mb-4 md:text-5xl">
                            Let&apos;s Get In Touch.
                        </h1>
                        <p className="mb-6 max-w-md text-base text-white sm:text-lg md:mb-8">
                            Your laboratory instruments should serve you, not the other way
                            around. We&apos;re happy to help you.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                            <button className="flex w-full items-center justify-between rounded-full bg-black px-5 py-3 text-white sm:w-[240px]">
                                <span className="font-medium">Book a discovery call</span>
                                <span className="h-5 w-5 flex-shrink-0 rounded-full bg-white"></span>
                            </button>
                            <button className="flex w-full items-center justify-between rounded-full bg-black px-5 py-3 text-white sm:w-[240px]">
                                <span className="font-medium">Test Your Samples</span>
                                <span className="h-5 w-5 flex-shrink-0 rounded-full bg-white"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="how-it-works" className="min-h-screen bg-muted/30 flex items-center justify-center">
                <h2 className="text-5xl font-bold">How It Works</h2>
            </div>
            <div id="integrations" className="min-h-screen bg-background flex items-center justify-center">
                <h2 className="text-5xl font-bold">Integraciones</h2>
            </div>
            <div id="pricing" className="min-h-screen bg-muted/30 flex items-center justify-center">
                <h2 className="text-5xl font-bold">Pricing / FAQ</h2>
            </div>
            <div id="contact" className="min-h-[50vh] bg-background flex items-center justify-center">
                <h2 className="text-5xl font-bold">Contact / Footer</h2>
            </div>
        </>
    );
}

export default HomePage;