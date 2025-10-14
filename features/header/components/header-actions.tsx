import { HeaderLoginLink, SettingsToolbar } from '@/features/header/components';
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