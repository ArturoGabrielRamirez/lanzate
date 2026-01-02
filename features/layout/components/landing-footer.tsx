import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

export async function LandingFooter() {
  const t = await getTranslations();

  return (
    <footer className="z-10 border-t border-border bg-background/90 backdrop-blur-sm h-16">
      <div className="mx-auto container flex flex-col items-center md:justify-between md:flex-row h-full px-4 gap-2 justify-center">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © 2025 Lanzate. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6">
          <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            {t('nav.home')}
          </Link>
          <Link href="/login" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            {t('nav.access')}
          </Link>
          <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
            {t('nav.moreInfo')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
