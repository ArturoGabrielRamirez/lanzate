import HeroSection from "@/features/landing/components/hero-section";
import FeaturesSection from "@/features/landing/components/features-section";
import StatsSection from "@/features/landing/components/stats-section";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import PricingSection from "@/features/landing/components/pricing-section";

export default function Home() {

  return (
    <>
      <HeroSection />
      <div className="relative">
        <FeaturesSection />
        <StatsSection />
        <DotPattern
          width={30}
          height={30}
          className={cn(
            "[mask-image:linear-gradient(to_top_left,white,transparent_70%,transparent)] ",
          )}
        />
      </div>
      <PricingSection />
    </>
  );
}
