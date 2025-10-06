'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitch } from './language-switch';
import { UserMenu } from './user-menu';
import { isAuthenticated } from '@/features/global/utils';
import { User } from '@supabase/supabase-js';

interface HeaderActionsProps {
  user?: User | null;
}

export const HeaderActions = ({ user }: HeaderActionsProps) => {
  const t = useTranslations();
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!actionsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(actionsRef.current, {
        opacity: 0,
        x: 20,
        duration: 0.5,
        delay: 0.8, // Delay increased to wait for header and nav animations
        ease: 'power3.out',
      });
    }, actionsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={actionsRef} className="hidden md:flex items-center gap-3">
      <LanguageSwitch />
      <ThemeToggle />
      {isAuthenticated(user) ? (
        <UserMenu user={user} />
      ) : (
        <Button asChild size="lg">
          <Link href="/login">{t('header.actions.login')}</Link>
        </Button>
      )}
    </div>
  );
};
