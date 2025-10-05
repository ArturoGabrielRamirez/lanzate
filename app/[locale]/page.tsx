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
            <FAQSection />
            <Footer />
        </div>
    );
}

export default HomePage;