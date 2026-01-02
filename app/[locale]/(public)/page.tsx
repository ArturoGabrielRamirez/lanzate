import { Header } from '@/features/layout/components/header';
import { HeroSection } from '@/features/landing/components';
import { Separator } from '@/features/shadcn/components/ui/separator';
import { getTranslations } from 'next-intl/server';

async function HomePage() {
  const t = await getTranslations();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Grid background pattern - visible in dark mode */}
      <div className="absolute inset-0 bg-grid-pattern opacity-0 dark:opacity-100" />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/50 to-background" />

      {/* Header with theme toggle and language switcher */}
      <Header />

      {/* Main content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Separator */}
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <Separator className="opacity-20" />
        </div>

        {/* Features section placeholder - can be expanded later */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-20 md:px-12 lg:px-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              {t('welcome')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('description')}
            </p>
          </div>
        </section>
      </main>

      {/* Footer placeholder */}
      <footer className="relative z-10 border-t border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:px-16">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2025 Lanzate. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('nav.home')}
              </a>
              <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('nav.access')}
              </a>
              <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('nav.moreInfo')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;