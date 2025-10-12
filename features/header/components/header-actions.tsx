import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { SettingsToolbar } from '@/features/header/components/settings-toolbar';
import { getUserInfo } from '@/features/layout/actions';
import { Link } from '@/i18n/naviation';

async function HeaderActions() {

    const t = await getTranslations();
    const { payload: user } = await getUserInfo()

    return (
        <div className="hidden md:flex items-center md:gap-3">
            <SettingsToolbar />
            {!user && (
                <Button asChild size="lg" className='bg-transparent border border-border dark:!border-primary dark:hover:!bg-primary/20'>
                    <Link href="/login">{t('feature/header.navigation.login')}</Link>
                </Button>
            )}
        </div>
    );
};

export { HeaderActions };