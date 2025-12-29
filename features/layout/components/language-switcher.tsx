'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { routing } from '@/i18n/routing';

/**
 * Language Switcher Component
 *
 * Provides a button to toggle between Spanish (ES) and English (EN) locales.
 * Uses next-intl's routing configuration to switch between locale paths.
 *
 * Features:
 * - Shows current locale with flag/text
 * - Toggles between ES and EN
 * - Preserves current route path when switching
 * - Styled with shadcn/ui Button component
 */
export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentLocale = (): 'es' | 'en' => {
    // Extract locale from pathname (e.g., /es/... or /en/...)
    const segments = pathname.split('/');
    const locale = segments[1];
    return routing.locales.includes(locale as any) ? (locale as 'es' | 'en') : routing.defaultLocale as 'es' | 'en';
  };

  const currentLocale = getCurrentLocale();
  const nextLocale = currentLocale === 'es' ? 'en' : 'es';

  const switchLocale = () => {
    // Remove current locale from pathname and add new one
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    const newPath = segments.join('/');

    router.push(newPath);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={switchLocale}
      aria-label={`Switch to ${nextLocale === 'es' ? 'Spanish' : 'English'}`}
      title={`Switch to ${nextLocale === 'es' ? 'Spanish' : 'English'}`}
    >
      <div className="flex items-center justify-center gap-1">
        <Globe className="h-[1.2rem] w-[1.2rem]" />
        <span className="text-xs font-semibold uppercase">
          {currentLocale}
        </span>
      </div>
    </Button>
  );
}
