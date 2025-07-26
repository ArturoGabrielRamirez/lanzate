import { useTranslations } from 'next-intl';
import HeroSection from "@/features/landing/components/hero-section";
import FeaturesSection from "@/features/landing/components/features-section";
import StatsSection from "@/features/landing/components/stats-section";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import PricingSection from "@/features/landing/components/pricing-section";

export default function Home() {

  const t = useTranslations('home');

  return (
    <div className="max-md:pt-24 max-md:pb-12">
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
      <PricingSection/>
    </div>
  );
}
