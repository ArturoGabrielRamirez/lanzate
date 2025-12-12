import { HeaderLoginLink } from '@/features/header/components/header-login-link';
import { SettingsToolbar } from '@/features/header/components/settings-toolbar';

async function HeaderActions() {
    return (
        <div className="hidden md:flex items-center md:gap-3">
            <SettingsToolbar />
            <HeaderLoginLink />
        </div>
    );
};

export { HeaderActions };