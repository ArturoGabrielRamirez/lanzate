'use client';

import { useEffect, useState, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Switch } from '@/components/ui/switch';

export const LanguageSwitch = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isChecked, setIsChecked] = useState(locale === 'en');

  useEffect(() => {
    setIsChecked(locale === 'en');
  }, [locale]);

  const handleChange = (checked: boolean) => {
    const nextLocale = checked ? 'en' : 'es';
    setIsChecked(checked);

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <p className={`text-xs font-medium transition-colors ${!isChecked ? 'text-primary' : 'text-muted-foreground'}`}>
        ES
      </p>
      <Switch 
        checked={isChecked} 
        onCheckedChange={handleChange} 
        disabled={isPending}
        className="cursor-pointer"
      />
      <p className={`text-xs font-medium transition-colors ${isChecked ? 'text-primary' : 'text-muted-foreground'}`}>
        EN
      </p>
    </div>
  );
};

