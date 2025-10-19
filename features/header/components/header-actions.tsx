import { HeaderLoginLink } from '@/features/header/components/header-login-link';
import { SettingsToolbar } from '@/features/header/components/settings-toolbar';
import { getUserInfo } from '@/features/layout/actions';

async function HeaderActions() {

    const { payload: user } = await getUserInfo()

    return (
        <div className="hidden md:flex items-center md:gap-3">
            <SettingsToolbar />
            {!user && (
                <HeaderLoginLink />
            )}
        </div>
    );
};

export { HeaderActions };