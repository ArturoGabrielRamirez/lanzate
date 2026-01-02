import { getTranslations } from 'next-intl/server';

export async function LandingFooter() {
  const t = await getTranslations();

  return (
    <footer className="z-10 border-t border-border/40 bg-background/80 backdrop-blur-sm h-16">
      <div className="mx-auto container flex flex-col items-center md:justify-between md:flex-row h-full px-4 gap-2 justify-center">
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
    </footer>
  );
}
