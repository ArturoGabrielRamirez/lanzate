import HeroSection from "@/features/landing/components/hero-section";
import FeaturesSection from "@/features/landing/components/features-section";
import StatsSection from "@/features/landing/components/stats-section";
import PricingSection from "@/features/landing/components/pricing-section";
import CustomSection from "@/features/landing/components/custom-section";

export default function Home() {

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <PricingSection />
      <CustomSection />
    </>
  );
}
