'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { SettingsToolbar } from '@/features/header/components/settings-toolbar';
import { UserMenu } from '@/features/header/components/user-menu';
import type { HeaderActionsProps } from '@/features/header/types';
import { Link } from '@/i18n/navigation';

export const HeaderActions = ({ user }: HeaderActionsProps) => {
  const t = useTranslations();
  const actionsRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={actionsRef} className="hidden md:flex items-center gap-3">
      <SettingsToolbar />
      {user ? (
        <UserMenu user={user} />
      ) : (
        <Button asChild size="lg">
          <Link href="/login">{t('header.actions.login')}</Link>
        </Button>
      )}
    </div>
  );
};
