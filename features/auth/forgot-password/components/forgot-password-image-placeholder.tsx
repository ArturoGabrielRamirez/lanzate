'use client';

import { KeyRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const ForgotPasswordImagePlaceholder = () => {
  const t = useTranslations('auth.forgot');

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-lg flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 text-center space-y-2 p-8 typography">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50">
          <KeyRound className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="not-typography">{t('imagePlaceholderTitle')}</h3>
        <p className="small text-muted-foreground max-w-sm mx-auto">{t('imagePlaceholderDescription')}</p>
      </div>
    </div>
  );
};


