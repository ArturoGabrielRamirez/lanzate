import { getTranslations } from 'next-intl/server';

export async function LandingFooter() {
  const t = await getTranslations();

  return (
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
  );
}
