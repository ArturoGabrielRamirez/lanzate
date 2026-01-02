'use client';

import { LanguageSwitcher } from '@/features/layout/components/language-switcher';
import { ThemeToggle } from '@/features/layout/components/theme-toggle';

function Header() {
  return (
    <header className="fixed right-4 top-4 z-50 flex items-center gap-2">
      <LanguageSwitcher />
      <ThemeToggle />
    </header>
  );
}

export { Header };