'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { SettingsToolbar } from './settings-toolbar';
import { useGsapFadeIn } from '@/features/global/hooks';
import { UserMenu } from './user-menu';
import { isAuthenticated } from '@/features/global/utils';
import { User } from '@supabase/supabase-js';

interface HeaderActionsProps {
  user?: User | null;
}

export const HeaderActions = ({ user }: HeaderActionsProps) => {
  const t = useTranslations();
  const actionsRef = useRef<HTMLDivElement>(null);

  useGsapFadeIn(actionsRef, { x: 20, delay: 0.8 });

  return (
    <div ref={actionsRef} className="hidden md:flex items-center gap-3">
      <SettingsToolbar />
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
