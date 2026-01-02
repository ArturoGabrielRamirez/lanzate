'use client';

import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';

export function Header() {
  return (
    <header className="fixed right-4 top-4 z-50 flex items-center gap-2">
      <LanguageSwitcher />
      <ThemeToggle />
    </header>
  );
}
