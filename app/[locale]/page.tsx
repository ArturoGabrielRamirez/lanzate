import HeroSection from "@/features/landing/components/hero-section";
import FeaturesSection from "@/features/landing/components/features-section";
import StatsSection from "@/features/landing/components/stats-section";
import PricingSection from "@/features/landing/components/pricing-section";
import CustomSection from "@/features/landing/components/custom-section";
import { Particles } from "@/components/ui/shadcn-io/particles";
import { BubbleBackground } from "@/components/ui/shadcn-io/bubble-background";

export default function Home() {

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <PricingSection />
      <CustomSection />

      {/* <Particles
        className="absolute inset-0 blur-xs"
        quantity={100}
        ease={300}
        staticity={50}
        color="#ea580c"
        size={1.5}
      />
      <Particles
        className="absolute inset-0 blur-[1px]"
        quantity={250}
        ease={200}
        staticity={40}
        color="#ea580c"
        size={1}
      />
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={150}
        staticity={10}
        color="#ea580c"
        size={0.8}
      /> */}
      {/* <BubbleBackground
        interactive
        className="absolute inset-0 flex items-center justify-center opacity-30"
        colors={{
          fourth: "50, 12, 0",
          second: "50, 12, 0",
          sixth: "50, 12, 0",
          fifth: "50, 12, 0",
        }}
      /> */}
    </>
  );
}
