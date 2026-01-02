'use client';

import { LanguageSwitcher } from '@/features/layout/components/language-switcher';
import { ThemeToggle } from '@/features/layout/components/theme-toggle';

function LandingHeader() {
  return (
    <header className="fixed z-50 flex items-center gap-2 w-full px-4 py-3 bg-background/80 backdrop-blur-sm border-b border-border">
      <LanguageSwitcher />
      <ThemeToggle />
    </header>
  );
}

export { LandingHeader };