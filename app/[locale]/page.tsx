import { ContactSection, FaqSection, FeaturesSection, HeroSection, IntegrationSection, PricingSection } from "@/features/landing/components";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home page',
};


export default function Home() {

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <IntegrationSection />
      <FaqSection />
      <ContactSection />
      <PricingSection />
    </>
  );
}
