import { HeroSection } from '@/features/landing/components';
import { LandingFooter, LandingHeader } from '@/features/layout/components';

async function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">

      <div className="absolute inset-0 bg-grid-pattern opacity-0 dark:opacity-100" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/50 to-background" />

      <LandingHeader />

      <main className="relative z-10">
        <HeroSection />
      </main>

      <LandingFooter />
    </div>
  );
}

export default HomePage;