'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const LoginForm = () => {
  const t = useTranslations('auth.login');

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Form Placeholder */}
      <div className="space-y-4">
        {/* Email Input Placeholder */}
        <div className="space-y-2">
          <div className="h-10 bg-muted/50 rounded-md animate-pulse" />
          <p className="text-xs text-muted-foreground">{t('emailPlaceholder')}</p>
        </div>

        {/* Password Input Placeholder */}
        <div className="space-y-2">
          <div className="h-10 bg-muted/50 rounded-md animate-pulse" />
          <p className="text-xs text-muted-foreground">{t('passwordPlaceholder')}</p>
        </div>

        {/* Forgot Password Link Placeholder */}
        <div className="flex justify-end">
          <div className="h-4 w-32 bg-muted/50 rounded animate-pulse" />
        </div>

        {/* Submit Button Placeholder */}
        <Button className="w-full" size="lg" disabled>
          {t('submitButton')}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('orContinueWith')}
            </span>
          </div>
        </div>

        {/* Social Login Placeholders */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-muted/50 rounded-md animate-pulse" />
          <div className="h-10 bg-muted/50 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('noAccount')} </span>
        <Link href="/signup" className="text-primary hover:underline font-medium">
          {t('signUp')}
        </Link>
      </div>
    </div>
  );
};

