'use client';

import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';

/**
 * Header Component
 *
 * A simple header that contains the theme toggle and language switcher.
 * This is a Client Component that can be used on any page.
 */
export function Header() {
  return (
    <header className="fixed right-4 top-4 z-50 flex items-center gap-2">
      <LanguageSwitcher />
      <ThemeToggle />
    </header>
  );
}
