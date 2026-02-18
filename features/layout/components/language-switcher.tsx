'use client';

import { usePathname, useRouter } from 'next/navigation';

import { Button } from "@/features/global/components/button/button";
import { Locale, routing } from '@/i18n/routing';

function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentLocale = (): 'es' | 'en' => {
    const segments = pathname.split('/');
    const locale = segments[1];
    return routing.locales.includes(locale as Locale) ? locale as Locale : 'en';
  };

  const currentLocale = getCurrentLocale();
  const nextLocale = currentLocale === 'es' ? 'en' : 'es';

  const switchLocale = () => {
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
      tooltip={`Switch to ${nextLocale === 'es' ? 'Spanish' : 'English'}`}
    >
      <div className="flex items-center justify-center gap-1">
        <span className="text-xs font-semibold uppercase">
          {currentLocale}
        </span>
      </div>
    </Button>
  );
}

export { LanguageSwitcher };