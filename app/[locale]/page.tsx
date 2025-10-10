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
                <h1 className="text-6xl font-bold">Hero Section</h1>
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