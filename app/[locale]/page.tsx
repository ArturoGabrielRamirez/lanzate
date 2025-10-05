import {
    HeroSection,
    HowItWorksSection,
    FAQSection,
    Footer,
} from "@/features/landing/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
    description: "Gestiona tu negocio online nunca fue tan fácil. Enfocate en crecer mientras te damos el control total.",
};

function HomePage() {
    return (
        <div className="min-h-screen">
            <HeroSection />
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
            <Footer />
        </div>
    );
}

export default HomePage;