import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { getCurrentUserAction } from '@/features/global/actions';
import { SettingsToolbar } from '@/features/header/components/settings-toolbar';
import { Link } from '@/i18n/navigation';

async function HeaderActions() {

  const t = await getTranslations();
  const { payload: currentUser } = await getCurrentUserAction();

  return (
    <div className="hidden md:flex items-center md:gap-3">
      <SettingsToolbar />
      {!currentUser && (
        <Button asChild size="lg" className='bg-transparent border border-border dark:!border-primary dark:hover:!bg-primary/20'>
          <Link href="/login">{t('header.actions.login')}</Link>
        </Button>
      )}
    </div>
  );
};

export { HeaderActions };