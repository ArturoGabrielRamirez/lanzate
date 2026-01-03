'use client';

import { LanguageSwitcher } from '@/features/layout/components/language-switcher';
import { ThemeToggle } from '@/features/layout/components/theme-toggle';
import { Link } from '@/i18n/navigation';

function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full px-2 py-3 bg-background/90 backdrop-blur-sm border-b border-border flex justify-center h-16">
      <div className='container flex items-center gap-2 justify-between'>
        <Link href="/">
          <h1>
            Lanzate
          </h1>
        </Link>
        <div className='flex gap-2'>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export { LandingHeader };